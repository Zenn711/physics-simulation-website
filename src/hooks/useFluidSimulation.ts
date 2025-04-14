
import { useState, useRef, useEffect } from 'react';
import { Particle, SimulationParams, SimulationType, HighlightEffect } from '../types/fluidSimulation';

export const useFluidSimulation = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  params: SimulationParams,
  simulationType: SimulationType,
  isRunning: boolean,
  highlightEffect: HighlightEffect
) => {
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize particles
  const initializeParticles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const particles: Particle[] = [];
    const count = params.particleDensity;
    
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(canvas.width, canvas.height));
    }
    
    particlesRef.current = particles;
    drawScene();
  };
  
  // Create a single particle
  const createParticle = (width: number, height: number): Particle => {
    // Distribute particles across the left edge more evenly
    const x = Math.random() * (width / 10);
    const y = Math.random() * height;
    
    // Base velocity on flow speed and simulation type
    // Increased base velocity to ensure particles move all the way across
    let vx = params.flowSpeed * (0.7 + Math.random() * 0.5);
    let vy = (Math.random() - 0.5) * 0.1;
    
    if (simulationType === 'turbulent') {
      vx *= 0.9 + Math.random() * 0.4; // Ensure even turbulent flow moves forward
      vy = (Math.random() - 0.5) * 0.4;
    }
    
    return {
      x,
      y,
      vx,
      vy,
      age: 0,
      maxAge: 200 + Math.random() * 200, // Increased maxAge to allow particles to travel farther
      hue: simulationType === 'diffusion' ? 
        Math.floor(180 + Math.random() * 60) : // Blue-cyan for diffusion
        Math.floor(200 + Math.random() * 40),   // Blue for flow
      pressure: 0,
      speed: Math.sqrt(vx * vx + vy * vy)
    };
  };

  // Animation loop
  const animate = () => {
    if (!canvasRef.current) return;
    
    updateParticles();
    drawScene();
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Update particle positions
  const updateParticles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const particles = particlesRef.current;
    const obstacleX = canvas.width / 2;
    const obstacleY = canvas.height / 2;
    const obstacleRadius = params.obstacleSize / 2;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Age the particle
      p.age += 1;
      
      // If the particle is too old, reset it
      if (p.age > p.maxAge) {
        const newParticle = createParticle(canvas.width, canvas.height);
        particles[i] = newParticle;
        continue;
      }
      
      // Calculate distance to obstacle
      const dx = p.x - obstacleX;
      const dy = p.y - obstacleY;
      const distToObstacle = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate pressure based on position relative to obstacle
      // Higher in front, lower behind
      const frontOfObstacle = p.x < obstacleX;
      const angleFactor = Math.abs(Math.atan2(dy, dx)) / Math.PI; // 0 at direct front/back, 1 at sides
      
      // Calculate estimated pressure: higher at front, lower at back, with distance falloff
      if (distToObstacle < obstacleRadius * 4) {
        const distanceFactor = 1 - Math.min(1, (distToObstacle - obstacleRadius) / (obstacleRadius * 3));
        const basePressure = frontOfObstacle ? 1 : -0.5;
        p.pressure = basePressure * distanceFactor * (1 - angleFactor * 0.7);
      } else {
        p.pressure = 0; // Normal pressure far from obstacle
      }
      
      // Check for collision with obstacle
      if (distToObstacle < obstacleRadius + 5) {
        // Handle collision by reflecting the velocity
        const nx = dx / distToObstacle;
        const ny = dy / distToObstacle;
        
        // Dot product of velocity and normal
        const dot = p.vx * nx + p.vy * ny;
        
        // Reflection formula: v - 2(v·n)n
        p.vx = p.vx - 2 * dot * nx;
        p.vy = p.vy - 2 * dot * ny;
        
        // Move the particle slightly outside the obstacle
        p.x = obstacleX + (obstacleRadius + 5) * nx;
        p.y = obstacleY + (obstacleRadius + 5) * ny;
        
        // Add some random variation in turbulent mode
        if (simulationType === 'turbulent') {
          p.vx += (Math.random() - 0.5) * 0.5;
          p.vy += (Math.random() - 0.5) * 0.5;
        }
      } else {
        // Apply flow field and viscosity effects
        if (simulationType === 'laminar') {
          // Laminar flow: Smooth and ordered
          p.vy += (canvas.height / 2 - p.y) * 0.0002 * (1 - params.viscosity);
        } else if (simulationType === 'turbulent') {
          // Turbulent flow: More chaotic
          p.vy += (Math.random() - 0.5) * 0.04 * params.flowSpeed;
          p.vx += (Math.random() - 0.5) * 0.01 * params.flowSpeed;
          
          // Add a small forward bias to ensure progress
          if (p.vx < params.flowSpeed * 0.4) {
            p.vx += 0.01 * params.flowSpeed;
          }
        } else if (simulationType === 'diffusion') {
          // Diffusion: Slower, more spread out
          p.vy += (Math.random() - 0.5) * 0.03;
          p.vx *= 0.995; // Slow down over time but not too much
          
          // Add small forward bias for diffusion too
          if (p.vx < params.flowSpeed * 0.2) {
            p.vx += 0.005 * params.flowSpeed;
          }
        }
        
        // Apply viscosity - now affects velocity directly
        // Reduced viscosity impact to ensure flow continues
        const viscosityFactor = Math.min(0.99, 1 - params.viscosity * 0.01);
        p.vx *= viscosityFactor;
        p.vy *= viscosityFactor;
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Calculate speed (for visualization)
        p.speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        
        // Boundaries check - improved to allow continuous flow
        if (p.x < 0) {
          // If particle moves off the left edge, reset it to the left edge
          p.x = 0;
          p.vx = Math.abs(p.vx); // Ensure it moves right
        }
        
        if (p.x > canvas.width) {
          // When particle reaches right edge, reset to left with new position
          const newParticle = createParticle(canvas.width, canvas.height);
          particles[i] = newParticle;
          continue;
        }
        
        if (p.y < 0) {
          p.y = 0;
          p.vy = Math.abs(p.vy) * 0.5; // Bounce with damping
        }
        
        if (p.y > canvas.height) {
          p.y = canvas.height;
          p.vy = -Math.abs(p.vy) * 0.5; // Bounce with damping
        }
      }
    }
  };

  // Draw the scene
  const drawScene = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear with a semi-transparent background for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw obstacle
    const obstacleX = canvas.width / 2;
    const obstacleY = canvas.height / 2;
    const obstacleRadius = params.obstacleSize / 2;
    
    // Draw flow field (streamlines) before the obstacle
    if (isRunning) {
      drawStreamlines(ctx, canvas.width, canvas.height, obstacleX, obstacleY, obstacleRadius);
    }
    
    // Draw obstacle with gradient to show pressure
    drawObstacle(ctx, obstacleX, obstacleY, obstacleRadius);
    
    // Draw pressure zones around obstacle based on highlight mode
    if (isRunning) {
      drawPressureZones(ctx, obstacleX, obstacleY, obstacleRadius);
    }
    
    // Draw particles
    drawParticles(ctx);
    
    // Add legends for highlight effects
    if (highlightEffect !== 'none' && isRunning) {
      drawLegends(ctx);
    }
  };

  const drawStreamlines = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    obstacleX: number, 
    obstacleY: number, 
    obstacleRadius: number
  ) => {
    const gridSize = 20;
    const arrowLength = 10 * params.flowSpeed;
    
    for (let x = 20; x < width; x += gridSize) {
      for (let y = 20; y < height; y += gridSize) {
        // Calculate distance to obstacle
        const dx = x - obstacleX;
        const dy = y - obstacleY;
        const distToObstacle = Math.sqrt(dx * dx + dy * dy);
        
        // Skip drawing streamlines inside or very close to obstacle
        if (distToObstacle < obstacleRadius + 10) continue;
        
        // Calculate flow direction (simplified potential flow around circle)
        let vx = params.flowSpeed;
        let vy = 0;
        
        // Disturb flow around obstacle
        if (distToObstacle < obstacleRadius * 3) {
          // Add deviation around the obstacle
          const influence = Math.max(0, 1 - distToObstacle / (obstacleRadius * 3));
          const nx = dx / distToObstacle;
          const ny = dy / distToObstacle;
          
          if (x < obstacleX) {
            // Flow approaching obstacle
            vx -= vx * influence * 0.5;
            vy += ny * params.flowSpeed * influence * (dy < 0 ? -1 : 1);
          } else {
            // Flow after obstacle - add some wake effects
            vx = vx * (1 - influence * 0.3);
            vy += ny * params.flowSpeed * influence * 0.5 * (dy < 0 ? -1 : 1);
            
            // Add turbulence in wake if turbulent mode
            if (simulationType === 'turbulent') {
              vx += (Math.random() - 0.5) * influence * 0.4;
              vy += (Math.random() - 0.5) * influence * 0.4;
            }
          }
        }
        
        // Normalize vector
        const mag = Math.sqrt(vx * vx + vy * vy);
        if (mag > 0) {
          vx = vx / mag * arrowLength;
          vy = vy / mag * arrowLength;
        }

        // Calculate color based on highlight mode
        let hue = 220;
        let saturation = 80;
        let lightness = 50;
        let alpha = 0.2;
        
        // Different highlight modes
        const speed = Math.sqrt(vx * vx + vy * vy);
        const normalizedSpeed = speed / arrowLength;
        
        if (highlightEffect === 'speed') {
          // Speed coloring: blue to red
          hue = 240 - normalizedSpeed * 240;  // Blue to red
          saturation = 80;
          lightness = 50;
          alpha = 0.3;
        } else if (highlightEffect === 'pressure') {
          // Pressure coloring: blue (low) to red (high)
          const pressure = x < obstacleX ? 
            Math.max(0, 1 - distToObstacle / (obstacleRadius * 3)) : // Higher at front
            -Math.max(0, 1 - distToObstacle / (obstacleRadius * 3));  // Lower at back
              
          hue = pressure > 0 ? 0 : 240;  // Red for high, blue for low
          saturation = Math.abs(pressure) * 100;
          lightness = 50;
          alpha = Math.min(0.5, Math.abs(pressure) + 0.1);
        } else if (highlightEffect === 'vorticity') {
          // Vorticity coloring: clockwise vs counterclockwise rotation
          // In a real simulation this would be curl(v), here we approximate
          const vorticity = x > obstacleX ? (y < obstacleY ? 1 : -1) : 0;
          hue = vorticity > 0 ? 120 : 300; // Green for clockwise, purple for counter
          saturation = Math.abs(vorticity) * 80;
          lightness = 50;
          alpha = Math.min(0.4, Math.abs(vorticity) + 0.1);
          
          // Only show vorticity in wake region
          if (x < obstacleX || distToObstacle > obstacleRadius * 2.5) {
            alpha *= 0.3;
          }
        } else {
          // Default flow visualization
          if (simulationType === 'turbulent') alpha = 0.15;
          
          if (simulationType === 'diffusion') {
            hue = 180; // Cyan for diffusion
          } else {
            hue = 220 - normalizedSpeed * 40; // Blue to purple based on speed
          }
        }
        
        // Draw streamline
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx, y + vy);
        
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.lineWidth = highlightEffect !== 'none' ? 1.2 : 0.8;
        ctx.stroke();
        
        // Draw arrow tip
        const arrowSize = 2;
        const angle = Math.atan2(vy, vx);
        ctx.beginPath();
        ctx.moveTo(x + vx, y + vy);
        ctx.lineTo(
          x + vx - arrowSize * Math.cos(angle - Math.PI / 6),
          y + vy - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          x + vx - arrowSize * Math.cos(angle + Math.PI / 6),
          y + vy - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.fill();
      }
    }
  };

  const drawObstacle = (
    ctx: CanvasRenderingContext2D, 
    obstacleX: number, 
    obstacleY: number, 
    obstacleRadius: number
  ) => {
    const gradientRadius = obstacleRadius * 1.5;
    const gradient = ctx.createRadialGradient(
      obstacleX - obstacleRadius * 0.3, obstacleY - obstacleRadius * 0.3,
      0,
      obstacleX, obstacleY,
      gradientRadius
    );
    
    if (simulationType === 'diffusion') {
      gradient.addColorStop(0, '#666');
      gradient.addColorStop(1, '#444');
    } else {
      // Show pressure gradient on obstacle
      const highPressure = `hsla(${simulationType === 'turbulent' ? 0 : 210}, 80%, 40%, 0.9)`;
      const lowPressure = `hsla(${simulationType === 'turbulent' ? 260 : 190}, 70%, 50%, 0.7)`;
      
      gradient.addColorStop(0, highPressure); // High pressure (front)
      gradient.addColorStop(1, lowPressure);  // Low pressure (back)
    }
    
    ctx.beginPath();
    ctx.arc(obstacleX, obstacleY, obstacleRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const drawPressureZones = (
    ctx: CanvasRenderingContext2D, 
    obstacleX: number, 
    obstacleY: number, 
    obstacleRadius: number
  ) => {
    if (highlightEffect === 'pressure') {
      // High pressure zone in front
      const frontGradient = ctx.createRadialGradient(
        obstacleX - obstacleRadius, obstacleY,
        0,
        obstacleX - obstacleRadius, obstacleY,
        obstacleRadius * 1.5
      );
      frontGradient.addColorStop(0, `rgba(255, 50, 50, ${0.3 * params.flowSpeed})`);
      frontGradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
      
      ctx.beginPath();
      ctx.arc(obstacleX - obstacleRadius, obstacleY, obstacleRadius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = frontGradient;
      ctx.fill();
      
      // Low pressure zone behind
      const backGradient = ctx.createRadialGradient(
        obstacleX + obstacleRadius * 1.5, obstacleY,
        0,
        obstacleX + obstacleRadius * 1.5, obstacleY,
        obstacleRadius * 2
      );
      backGradient.addColorStop(0, `rgba(50, 50, 255, ${0.25 * params.flowSpeed})`);
      backGradient.addColorStop(1, 'rgba(50, 50, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(obstacleX + obstacleRadius * 1.5, obstacleY, obstacleRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = backGradient;
      ctx.fill();
      
      // Add labels for pressure zones
      ctx.font = '12px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText('High Pressure', obstacleX - obstacleRadius, obstacleY - obstacleRadius * 1.5);
      ctx.fillText('Low Pressure', obstacleX + obstacleRadius * 1.5, obstacleY - obstacleRadius);
    }
    
    // Add vortices in wake for turbulent flow or vorticity visualization
    if (simulationType === 'turbulent' || highlightEffect === 'vorticity') {
      for (let i = 1; i <= 3; i++) {
        const vortexX = obstacleX + obstacleRadius * (1 + i * 0.7);
        const upperY = obstacleY - obstacleRadius * 0.5 * i;
        const lowerY = obstacleY + obstacleRadius * 0.5 * i;
        
        // Color based on highlight mode
        let upperColor, lowerColor;
        let upperAlpha = 0.2 * params.flowSpeed;
        let lowerAlpha = 0.2 * params.flowSpeed;
        
        if (highlightEffect === 'vorticity') {
          upperColor = `rgba(180, 50, 255, ${upperAlpha})`; // Purple for counterclockwise
          lowerColor = `rgba(50, 200, 100, ${lowerAlpha})`; // Green for clockwise
        } else {
          upperColor = `rgba(255, 100, 100, ${upperAlpha})`;
          lowerColor = `rgba(100, 100, 255, ${lowerAlpha})`;
        }
        
        const vortexGradient1 = ctx.createRadialGradient(
          vortexX, upperY, 0,
          vortexX, upperY, obstacleRadius * 0.4
        );
        vortexGradient1.addColorStop(0, upperColor);
        vortexGradient1.addColorStop(1, upperColor.replace(/[^,]+\)/, '0)'));
        
        ctx.beginPath();
        ctx.arc(vortexX, upperY, obstacleRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = vortexGradient1;
        ctx.fill();
        
        const vortexGradient2 = ctx.createRadialGradient(
          vortexX, lowerY, 0,
          vortexX, lowerY, obstacleRadius * 0.4
        );
        vortexGradient2.addColorStop(0, lowerColor);
        vortexGradient2.addColorStop(1, lowerColor.replace(/[^,]+\)/, '0)'));
        
        ctx.beginPath();
        ctx.arc(vortexX, lowerY, obstacleRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = vortexGradient2;
        ctx.fill();
        
        // Add vortex labels when showing vorticity
        if (highlightEffect === 'vorticity' && i === 2) {
          ctx.font = '12px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.textAlign = 'center';
          ctx.fillText('Counterclockwise', vortexX, upperY - obstacleRadius * 0.5);
          ctx.fillText('Clockwise', vortexX, lowerY + obstacleRadius * 0.7);
        }
      }
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    
    for (const p of particles) {
      const alpha = 1 - (p.age / p.maxAge);
      
      if (simulationType === 'diffusion') {
        // Diffusion style: blurry dots
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 50%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      } else {
        // Flow style: lines
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
        
        // Determine color based on highlight effect
        let hue, saturation, lightness;
        
        if (highlightEffect === 'speed' && p.speed) {
          // Color by speed
          const normalizedSpeed = Math.min(1, p.speed / (params.flowSpeed * 1.5));
          hue = 240 - normalizedSpeed * 240;  // Blue to red
          saturation = 80;
          lightness = 50 + normalizedSpeed * 10;
        } else if (highlightEffect === 'pressure' && p.pressure !== undefined) {
          // Color by pressure
          hue = p.pressure > 0 ? 0 : 240;  // Red for high, blue for low
          saturation = Math.min(100, 60 + Math.abs(p.pressure) * 80);
          lightness = 50;
        } else {
          // Default coloring scheme
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const normalizedSpeed = Math.min(1, speed / (params.flowSpeed * 1.5));
          
          hue = simulationType === 'laminar' ? 
            220 - normalizedSpeed * 40 : // Blue to purple gradient for laminar
            (220 - normalizedSpeed * 120) % 360; // Wider color range for turbulent
          
          saturation = simulationType === 'laminar' ? 80 : 70;
          lightness = 50 + normalizedSpeed * 10;
        }
        
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.lineWidth = 1.5 + (p.speed || 0);
        ctx.stroke();
      }
    }
  };

  const drawLegends = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    const legendX = 20;
    const legendWidth = 100;
    const legendHeight = 15;
    
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    
    if (highlightEffect === 'speed') {
      ctx.fillText('Speed', legendX, 25);
      const speedGradient = ctx.createLinearGradient(legendX, 40, legendX + legendWidth, 40);
      speedGradient.addColorStop(0, 'blue');
      speedGradient.addColorStop(0.5, 'purple');
      speedGradient.addColorStop(1, 'red');
      
      ctx.fillStyle = speedGradient;
      ctx.fillRect(legendX, 30, legendWidth, legendHeight);
      
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText('Low', legendX, 55);
      ctx.textAlign = 'right';
      ctx.fillText('High', legendX + legendWidth, 55);
    } else if (highlightEffect === 'pressure') {
      ctx.fillText('Pressure', legendX, 25);
      const pressureGradient = ctx.createLinearGradient(legendX, 40, legendX + legendWidth, 40);
      pressureGradient.addColorStop(0, 'blue');
      pressureGradient.addColorStop(0.5, 'white');
      pressureGradient.addColorStop(1, 'red');
      
      ctx.fillStyle = pressureGradient;
      ctx.fillRect(legendX, 30, legendWidth, legendHeight);
      
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText('Low', legendX, 55);
      ctx.textAlign = 'right';
      ctx.fillText('High', legendX + legendWidth, 55);
    } else if (highlightEffect === 'vorticity') {
      ctx.fillText('Vorticity', legendX, 25);
      const vorticityGradient = ctx.createLinearGradient(legendX, 40, legendX + legendWidth, 40);
      vorticityGradient.addColorStop(0, 'rgb(180, 50, 255)'); // Counterclockwise
      vorticityGradient.addColorStop(1, 'rgb(50, 200, 100)'); // Clockwise
      
      ctx.fillStyle = vorticityGradient;
      ctx.fillRect(legendX, 30, legendWidth, legendHeight);
      
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText('CCW', legendX, 55);
      ctx.textAlign = 'right';
      ctx.fillText('CW', legendX + legendWidth, 55);
    }
    ctx.restore();
  };

  // Method to reset the simulation
  const resetSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    initializeParticles();
    
    // If audio is playing, pause it
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Update canvas size when window resizes
  const resizeCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    if (!container) return;
    
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    drawScene();
  };

  // Handle sound effects
  const setupAudio = (soundEnabled: boolean) => {
    if (soundEnabled) {
      if (!audioRef.current) {
        const audio = new Audio('/fluid-sound.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        audioRef.current = audio;
      }
      
      if (isRunning) {
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return {
    initializeParticles,
    resetSimulation,
    resizeCanvas,
    animate,
    drawScene,
    setupAudio,
    audioRef,
    animationRef,
    particlesRef
  };
};
