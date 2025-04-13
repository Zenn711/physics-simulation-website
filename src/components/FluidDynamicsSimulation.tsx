
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, HelpCircle, MoveHorizontal, Droplet, Wind, Grid3X3, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const FluidDynamicsSimulation = () => {
  // Simulation parameters
  const [params, setParams] = useState({
    viscosity: 0.1,       // Fluid viscosity [0.01 - 0.5]
    flowSpeed: 1,         // Flow speed [0.1 - 2]
    particleDensity: 200, // Number of particles [50 - 500]
    obstacleSize: 50,     // Size of obstacle [10 - 100]
  });

  const [simulationType, setSimulationType] = useState<'laminar' | 'turbulent' | 'diffusion'>('laminar');
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'compare' | 'learn'>('live');
  const [highlightEffect, setHighlightEffect] = useState<'none' | 'pressure' | 'speed' | 'vorticity'>('none');
  
  // Canvas references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compareLaminarRef = useRef<HTMLCanvasElement>(null);
  const compareTurbulentRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Particle class to represent fluid elements
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    age: number;
    maxAge: number;
    hue: number;
    pressure?: number; // Estimated pressure at particle location
    speed?: number;    // Particle speed
  }

  // Method to reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
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

  // Toggle simulation running state
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
    
    // Handle audio
    if (soundEnabled) {
      if (!isRunning) {
        if (!audioRef.current) {
          const audio = new Audio('/fluid-sound.mp3');
          audio.loop = true;
          audio.volume = 0.3;
          audioRef.current = audio;
        }
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    }
  };

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

    // If we're on the compare tab, also initialize the comparison views
    if (activeTab === 'compare' && compareLaminarRef.current && compareTurbulentRef.current) {
      initializeComparisonView();
    }
  };
  
  // Create a single particle
  const createParticle = (width: number, height: number): Particle => {
    // For consistent flow, create particles on the left side
    const x = Math.random() * (width / 5);
    const y = Math.random() * height;
    
    // Base velocity on flow speed and simulation type
    let vx = params.flowSpeed * (0.5 + Math.random() * 0.5);
    let vy = (Math.random() - 0.5) * 0.1;
    
    if (simulationType === 'turbulent') {
      vx *= 0.8 + Math.random() * 0.4;
      vy = (Math.random() - 0.5) * 0.4;
    }
    
    return {
      x,
      y,
      vx,
      vy,
      age: 0,
      maxAge: 100 + Math.random() * 100,
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
        } else if (simulationType === 'diffusion') {
          // Diffusion: Slower, more spread out
          p.vy += (Math.random() - 0.5) * 0.03;
          p.vx *= 0.99; // Slow down over time
        }
        
        // Apply viscosity - now affects velocity directly
        p.vx *= (1 - params.viscosity * 0.01);
        p.vy *= (1 - params.viscosity * 0.01);
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Calculate speed (for visualization)
        p.speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        
        // Boundaries check - improved to ensure continuous flow
        if (p.x < 0) p.x = 0;
        if (p.x > canvas.width) {
          // Reset to left side with new random position
          p.x = Math.random() * (canvas.width / 10);
          p.y = Math.random() * canvas.height;
          p.age = 0; // Reset age to extend lifetime
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy = -p.vy * 0.5; // Bounce
        }
        if (p.y > canvas.height) {
          p.y = canvas.height;
          p.vy = -p.vy * 0.5; // Bounce
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
      const gridSize = 20;
      const arrowLength = 10 * params.flowSpeed;
      
      for (let x = 20; x < canvas.width; x += gridSize) {
        for (let y = 20; y < canvas.height; y += gridSize) {
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
    }
    
    // Draw obstacle with gradient to show pressure
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
    
    // Draw pressure zones around obstacle based on highlight mode
    if (isRunning) {
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
    }
    
    // Draw particles
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
    
    // Add legends for highlight effects
    if (highlightEffect !== 'none' && isRunning) {
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
    }
  };
  
  // Initialize comparison views for side-by-side visualization
  const initializeComparisonView = () => {
    if (!compareLaminarRef.current || !compareTurbulentRef.current) return;
    
    const laminarCtx = compareLaminarRef.current.getContext('2d');
    const turbulentCtx = compareTurbulentRef.current.getContext('2d');
    if (!laminarCtx || !turbulentCtx) return;
    
    // Clear canvases
    laminarCtx.clearRect(0, 0, compareLaminarRef.current.width, compareLaminarRef.current.height);
    turbulentCtx.clearRect(0, 0, compareTurbulentRef.current.width, compareTurbulentRef.current.height);
    
    // Draw static comparison images - simplified version for educational purposes
    drawComparisonView(laminarCtx, 'laminar', compareLaminarRef.current.width, compareLaminarRef.current.height);
    drawComparisonView(turbulentCtx, 'turbulent', compareTurbulentRef.current.width, compareTurbulentRef.current.height);
  };
  
  // Draw a static comparison view
  const drawComparisonView = (ctx: CanvasRenderingContext2D, type: 'laminar' | 'turbulent', width: number, height: number) => {
    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, width, height);
    
    // Set up obstacle
    const obstacleX = width / 2;
    const obstacleY = height / 2;
    const obstacleRadius = 25;
    
    // Draw flow field
    const gridSize = type === 'laminar' ? 20 : 15;
    
    for (let x = 20; x < width - 20; x += gridSize) {
      for (let y = 20; y < height - 20; y += gridSize) {
        const dx = x - obstacleX;
        const dy = y - obstacleY;
        const distToObstacle = Math.sqrt(dx * dx + dy * dy);
        
        if (distToObstacle < obstacleRadius + 5) continue;
        
        // Calculate flow vector
        let vx = 1; // Base flow direction
        let vy = 0;
        
        // Modify flow based on obstacle
        if (distToObstacle < obstacleRadius * 3) {
          const influence = Math.max(0, 1 - distToObstacle / (obstacleRadius * 3));
          const nx = dx / distToObstacle;
          const ny = dy / distToObstacle;
          
          // Flow deflection
          if (x < obstacleX) {
            vx -= vx * influence * 0.5;
            vy += ny * influence * (dy < 0 ? -1 : 1);
          } else {
            // Wake region
            vx = vx * (1 - influence * 0.3);
            vy += ny * influence * 0.5 * (dy < 0 ? -1 : 1);
            
            // Add turbulence in turbulent mode
            if (type === 'turbulent') {
              // Use deterministic "randomness" based on position for static image
              const seed = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 10000;
              const randomVal = (seed - Math.floor(seed)) * 2 - 1;
              vx += randomVal * influence * 0.4;
              vy += Math.cos(x * 0.2) * influence * 0.4;
            }
          }
        }
        
        // Normalize and scale vector
        const mag = Math.sqrt(vx * vx + vy * vy);
        const arrowLength = 10;
        if (mag > 0) {
          vx = vx / mag * arrowLength;
          vy = vy / mag * arrowLength;
        }
        
        // Draw streamline
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx, y + vy);
        
        // Different colors for different flow types
        let hue, alpha;
        if (type === 'laminar') {
          hue = 210;
          alpha = 0.3;
        } else {
          hue = (x > obstacleX) ? 
            ((y > obstacleY) ? 120 : 280) : // Different colors in wake
            210; // Same as laminar in front
          alpha = 0.25;
        }
        
        ctx.strokeStyle = `hsla(${hue}, 80%, 50%, ${alpha})`;
        ctx.lineWidth = 0.8;
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
        ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${alpha})`;
        ctx.fill();
      }
    }
    
    // Draw obstacle
    const gradient = ctx.createRadialGradient(
      obstacleX - obstacleRadius * 0.3, obstacleY - obstacleRadius * 0.3,
      0,
      obstacleX, obstacleY,
      obstacleRadius * 1.5
    );
    
    const highPressure = `hsla(${type === 'turbulent' ? 0 : 210}, 80%, 40%, 0.9)`;
    const lowPressure = `hsla(${type === 'turbulent' ? 260 : 190}, 70%, 50%, 0.7)`;
    
    gradient.addColorStop(0, highPressure);
    gradient.addColorStop(1, lowPressure);
    
    ctx.beginPath();
    ctx.arc(obstacleX, obstacleY, obstacleRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add pressure zones
    const frontGradient = ctx.createRadialGradient(
      obstacleX - obstacleRadius, obstacleY,
      0,
      obstacleX - obstacleRadius, obstacleY,
      obstacleRadius * 1.5
    );
    frontGradient.addColorStop(0, `rgba(255, 50, 50, 0.3)`);
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
    backGradient.addColorStop(0, `rgba(50, 50, 255, 0.25)`);
    backGradient.addColorStop(1, 'rgba(50, 50, 255, 0)');
    
    ctx.beginPath();
    ctx.arc(obstacleX + obstacleRadius * 1.5, obstacleY, obstacleRadius * 2, 0, Math.PI * 2);
    ctx.fillStyle = backGradient;
    ctx.fill();
    
    // Add vortices in wake for turbulent flow
    if (type === 'turbulent') {
      for (let i = 1; i <= 3; i++) {
        const vortexX = obstacleX + obstacleRadius * (1 + i * 0.7);
        const upperY = obstacleY - obstacleRadius * 0.5 * i;
        const lowerY = obstacleY + obstacleRadius * 0.5 * i;
        
        const vortexGradient1 = ctx.createRadialGradient(
          vortexX, upperY, 0,
          vortexX, upperY, obstacleRadius * 0.4
        );
        vortexGradient1.addColorStop(0, `rgba(255, 100, 100, 0.2)`);
        vortexGradient1.addColorStop(1, 'rgba(255, 100, 100, 0)');
        
        ctx.beginPath();
        ctx.arc(vortexX, upperY, obstacleRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = vortexGradient1;
        ctx.fill();
        
        const vortexGradient2 = ctx.createRadialGradient(
          vortexX, lowerY, 0,
          vortexX, lowerY, obstacleRadius * 0.4
        );
        vortexGradient2.addColorStop(0, `rgba(100, 100, 255, 0.2)`);
        vortexGradient2.addColorStop(1, 'rgba(100, 100, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(vortexX, lowerY, obstacleRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = vortexGradient2;
        ctx.fill();
      }
    }
    
    // Add title
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(type === 'laminar' ? 'Laminar Flow' : 'Turbulent Flow', width / 2, 20);
    
    // Add key characteristics
    ctx.font = '12px Arial';
    
    if (type === 'laminar') {
      ctx.fillText('Smooth, ordered flow', width / 2, height - 40);
      ctx.fillText('Particles follow predictable paths', width / 2, height - 25);
      ctx.fillText('Higher viscosity, lower speeds', width / 2, height - 10);
    } else {
      ctx.fillText('Chaotic, disordered flow', width / 2, height - 40);
      ctx.fillText('Forms vortices and eddies', width / 2, height - 25);
      ctx.fillText('Lower viscosity, higher speeds', width / 2, height - 10);
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
    
    // Also resize comparison canvases if they exist
    if (compareLaminarRef.current && compareTurbulentRef.current) {
      const compareContainer = compareLaminarRef.current.parentElement;
      if (compareContainer) {
        const halfWidth = compareContainer.clientWidth / 2 - 10; // With some gap
        
        compareLaminarRef.current.width = halfWidth;
        compareLaminarRef.current.height = compareContainer.clientHeight;
        
        compareTurbulentRef.current.width = halfWidth;
        compareTurbulentRef.current.height = compareContainer.clientHeight;
        
        initializeComparisonView();
      }
    }
  };
  
  // Initialize canvas when component mounts
  useEffect(() => {
    if (!canvasRef.current) return;
    
    resizeCanvas();
    initializeParticles();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle simulation type change
  useEffect(() => {
    resetSimulation();
  }, [simulationType]);
  
  // Start/stop animation when isRunning changes
  useEffect(() => {
    if (isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [isRunning]);
  
  // Update when parameters change - now we immediately reinitialize particles when needed
  useEffect(() => {
    // If changing particle density, need to reinitialize
    if (particlesRef.current.length !== params.particleDensity) {
      initializeParticles();
    } else {
      // Otherwise just update the scene
      drawScene();
    }
  }, [params]);
  
  // Handle tab changes
  useEffect(() => {
    if (activeTab === 'compare') {
      // Initialize comparison views when switching to compare tab
      setTimeout(() => {
        initializeComparisonView();
      }, 50); // Short delay to ensure DOM is ready
    } else if (activeTab === 'live') {
      // Make sure simulation display is updated
      drawScene();
    }
  }, [activeTab]);
  
  // Parameter change handlers
  const handleViscosityChange = (newValue: number[]) => {
    setParams(prev => ({ ...prev, viscosity: newValue[0] }));
  };
  
  const handleFlowSpeedChange = (newValue: number[]) => {
    setParams(prev => ({ ...prev, flowSpeed: newValue[0] }));
    
    // Update existing particles' velocity for immediate effect
    if (particlesRef.current.length > 0) {
      const speedRatio = newValue[0] / params.flowSpeed;
      particlesRef.current.forEach(p => {
        p.vx *= speedRatio;
      });
    }
  };
  
  const handleParticleDensityChange = (newValue: number[]) => {
    setParams(prev => ({ ...prev, particleDensity: newValue[0] }));
  };
  
  const handleObstacleSizeChange = (newValue: number[]) => {
    setParams(prev => ({ ...prev, obstacleSize: newValue[0] }));
  };
  
  // Helper component for parameter controls with tooltips
  const ParameterControl = ({ 
    label, 
    value, 
    min, 
    max, 
    step, 
    onChange, 
    tooltip,
    icon
  }: { 
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number[]) => void;
    tooltip: string;
    icon: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span>{icon}</span>
          <span>{label}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="font-mono">{value.toFixed(2)}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={onChange}
      />
    </div>
  );
  
  // Content for the "Learn" tab
  const LearnContent = () => (
    <div className="p-4 space-y-6 text-left">
      <div>
        <h3 className="text-lg font-medium mb-2">Key Fluid Dynamics Concepts</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Reynolds Number</strong>: A dimensionless quantity that helps predict flow patterns. 
            Low Reynolds numbers result in laminar flow, while high values lead to turbulent flow.
          </li>
          <li>
            <strong>Bernoulli's Principle</strong>: When the speed of a fluid increases, its pressure decreases.
            This explains why there's high pressure in front of an obstacle and low pressure behind it.
          </li>
          <li>
            <strong>Viscosity</strong>: The "thickness" of a fluid that resists deformation. 
            Higher viscosity fluids (like honey) flow more slowly than lower viscosity fluids (like water).
          </li>
          <li>
            <strong>Vortices</strong>: Spinning regions of fluid that form when flow separates from a surface.
            In turbulent flow, these create the characteristic "vortex street" pattern behind obstacles.
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Flow Regimes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <h4 className="text-md font-medium">Laminar Flow</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Smooth, orderly flow where fluid particles move in parallel layers with minimal mixing.
              Occurs at low Reynolds numbers (low speed, high viscosity).
              Streamlines are smooth and predictable.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <h4 className="text-md font-medium">Turbulent Flow</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Chaotic, irregular flow with significant mixing between layers.
              Occurs at high Reynolds numbers (high speed, low viscosity).
              Forms eddies and vortices, especially in the wake region behind obstacles.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Visual Elements in the Simulation</h3>
        <div className="space-y-2">
          <div className="flex items-start space-x-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-red-500 mt-1"></div>
            <p className="text-sm">Red areas indicate high pressure, typically in front of the obstacle where fluid "piles up".</p>
          </div>
          <div className="flex items-start space-x-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 mt-1"></div>
            <p className="text-sm">Blue areas indicate low pressure, typically behind the obstacle in the wake region.</p>
          </div>
          <div className="flex items-start space-x-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-purple-500 mt-1"></div>
            <p className="text-sm">Purple and green areas in the vorticity view indicate counterclockwise and clockwise rotation.</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 flex items-center justify-center border border-white">
              <div className="w-2 h-0.5 bg-white"></div>
            </div>
            <p className="text-sm">Streamlines show the direction fluid would flow at each point, helping visualize the overall pattern.</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Real-World Examples</h3>
        <div className="space-y-1 text-sm">
          <p>• <strong>Aerodynamics</strong>: Car and airplane designs minimize drag by controlling flow separation.</p>
          <p>• <strong>Weather</strong>: High and low pressure systems create wind patterns in Earth's atmosphere.</p>
          <p>• <strong>Blood Flow</strong>: Blood exhibits both laminar and turbulent flow in different parts of circulatory system.</p>
          <p>• <strong>River Systems</strong>: Obstacles in rivers create complex flow patterns including eddies and vortices.</p>
        </div>
      </div>
      
      <div className="pt-2 border-t">
        <p className="text-sm text-muted-foreground italic">
          Try different highlight modes in the live simulation to see pressure gradients, speed variations, and vorticity patterns around the obstacle.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="w-full flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Fluid Dynamics Simulator</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowInfoPanel(!showInfoPanel)}>
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle info panel</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={simulationType} 
            onValueChange={(val: 'laminar' | 'turbulent' | 'diffusion') => setSimulationType(val)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Flow Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laminar">Laminar Flow</SelectItem>
              <SelectItem value="turbulent">Turbulent Flow</SelectItem>
              <SelectItem value="diffusion">Dye Diffusion</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={highlightEffect} 
            onValueChange={(val: 'none' | 'pressure' | 'speed' | 'vorticity') => setHighlightEffect(val)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Visualization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Standard View</SelectItem>
              <SelectItem value="pressure">Pressure Map</SelectItem>
              <SelectItem value="speed">Speed Map</SelectItem>
              <SelectItem value="vorticity">Vorticity Map</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {showInfoPanel && (
        <Card className="w-full mb-4">
          <CardContent className="pt-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium">What are you seeing?</h3>
              <p>
                {simulationType === 'laminar' && 
                  'Laminar flow shows smooth, ordered fluid movement around the obstacle. Notice the symmetric pattern and steady flow lines.'}
                {simulationType === 'turbulent' && 
                  'Turbulent flow exhibits chaotic patterns behind the obstacle. Watch for vortices forming in the wake region.'}
                {simulationType === 'diffusion' && 
                  'Diffusion demonstrates how dye particles spread through a fluid, regardless of the main flow direction.'}
              </p>
              
              <div className="pt-2">
                <p className="font-medium">Current visualization: {highlightEffect === 'none' ? 'Standard View' : `${highlightEffect.charAt(0).toUpperCase() + highlightEffect.slice(1)} Map`}</p>
                <p>
                  {highlightEffect === 'none' && 'Standard view shows the basic flow pattern around the obstacle.'}
                  {highlightEffect === 'pressure' && 'Pressure map highlights areas of high pressure (red) in front of the obstacle and low pressure (blue) behind it.'}
                  {highlightEffect === 'speed' && 'Speed map shows velocity variations with blue indicating slow flow and red showing fast flow.'}
                  {highlightEffect === 'vorticity' && 'Vorticity map reveals rotational motion in the fluid, with different colors for clockwise and counterclockwise rotation.'}
                </p>
              </div>
              
              <div className="pt-2">
                <p><strong>Try this:</strong> Adjust the viscosity slider and observe how it affects the flow pattern. Higher viscosity produces more laminar flow, while lower viscosity tends toward turbulence.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'live' | 'compare' | 'learn')}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="live">Live Simulation</TabsTrigger>
          <TabsTrigger value="compare">Compare Flow Types</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="live" className="w-full">
          <div className="relative w-full h-64 md:h-96 rounded-lg shadow-lg overflow-hidden bg-gradient-to-b from-blue-900/30 to-blue-950/40 dark:from-blue-950/80 dark:to-black/90">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full"
            />
            
            {/* Informative overlay */}
            {!isRunning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
                <div className="text-center p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {simulationType === 'laminar' && 'Laminar Flow'}
                    {simulationType === 'turbulent' && 'Turbulent Flow'}
                    {simulationType === 'diffusion' && 'Dye Diffusion'}
                  </h3>
                  <p className="text-sm text-white/80 max-w-md">
                    {simulationType === 'laminar' && 'Smooth, orderly flow with fluid moving in parallel layers.'}
                    {simulationType === 'turbulent' && 'Chaotic flow with irregular fluctuations and eddies.'}
                    {simulationType === 'diffusion' && 'Observe how dye particles spread through a fluid over time.'}
                  </p>
                  <Button 
                    onClick={toggleSimulation}
                    variant="outline"
                    className="mt-4 bg-white/20 hover:bg-white/30 border-white/40 text-white"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Simulation
                  </Button>
                </div>
              </div>
            )}
            
            {/* Parameter explanations when using different highlight modes */}
            {isRunning && highlightEffect !== 'none' && (
              <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs p-2 rounded">
                {highlightEffect === 'pressure' && 
                  <p>Blue = Low Pressure, Red = High Pressure</p>}
                {highlightEffect === 'speed' && 
                  <p>Blue = Slow Flow, Red = Fast Flow</p>}
                {highlightEffect === 'vorticity' && 
                  <p>Green = Clockwise, Purple = Counterclockwise</p>}
              </div>
            )}
          </div>
          
          {/* React key insights based on visualization */}
          {isRunning && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-3">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  {highlightEffect === 'none' && simulationType === 'laminar' && 
                    'Notice how the streamlines bend smoothly around the obstacle, maintaining their ordered pattern.'}
                  {highlightEffect === 'none' && simulationType === 'turbulent' && 
                    'Observe the irregular eddies forming behind the obstacle, creating a turbulent wake region.'}
                  {highlightEffect === 'none' && simulationType === 'diffusion' && 
                    'Watch how the dye particles disperse over time, slowly spreading throughout the fluid domain.'}
                  {highlightEffect === 'pressure' && 
                    'Pressure is highest at the front of the obstacle (stagnation point) where flow velocity approaches zero.'}
                  {highlightEffect === 'speed' && 
                    'Flow speed increases as fluid moves around the sides of the obstacle, then slows in the wake region.'}
                  {highlightEffect === 'vorticity' && 
                    'Vortices form in the wake region as flow separates from the obstacle, creating areas of rotation.'}
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="compare" className="w-full">
          <div className="text-center mb-3">
            <Badge variant="outline" className="font-normal">Side-by-side comparison</Badge>
            <p className="text-sm text-muted-foreground mt-1">Observe the key differences between laminar and turbulent flow patterns</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 h-64 md:h-80">
            <div className="relative flex-1 bg-gradient-to-b from-blue-900/30 to-blue-950/40 dark:from-blue-950/80 dark:to-black/90 rounded-lg shadow-md overflow-hidden">
              <canvas 
                ref={compareLaminarRef} 
                className="w-full h-full"
              />
            </div>
            <div className="relative flex-1 bg-gradient-to-b from-blue-900/30 to-blue-950/40 dark:from-blue-950/80 dark:to-black/90 rounded-lg shadow-md overflow-hidden">
              <canvas 
                ref={compareTurbulentRef}
                className="w-full h-full" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Laminar Flow Characteristics</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Smooth, predictable paths</li>
                <li>Symmetric flow patterns</li>
                <li>Minimal mixing between layers</li>
                <li>Lower Reynolds numbers</li>
                <li>Higher viscosity fluids</li>
              </ul>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Turbulent Flow Characteristics</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Chaotic, irregular motion</li>
                <li>Vortex formation in wake</li>
                <li>Enhanced mixing between layers</li>
                <li>Higher Reynolds numbers</li>
                <li>Lower viscosity fluids</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="learn">
          <LearnContent />
        </TabsContent>
      </Tabs>
      
      {activeTab === 'live' && (
        <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <ParameterControl
                  label="Viscosity"
                  value={params.viscosity}
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  onChange={handleViscosityChange}
                  tooltip="Controls fluid thickness. Higher values make the fluid move more slowly and stay laminar."
                  icon={<Droplet className="h-4 w-4" />}
                />
                
                <ParameterControl
                  label="Flow Speed"
                  value={params.flowSpeed}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onChange={handleFlowSpeedChange}
                  tooltip="Controls how fast the fluid flows from left to right. Higher speeds tend to produce turbulence."
                  icon={<Wind className="h-4 w-4" />}
                />
                
                <ParameterControl
                  label="Particle Density"
                  value={params.particleDensity}
                  min={50}
                  max={500}
                  step={10}
                  onChange={handleParticleDensityChange}
                  tooltip="Number of particles used to visualize the flow. More particles give a clearer picture but may slow performance."
                  icon={<Grid3X3 className="h-4 w-4" />}
                />
                
                <ParameterControl
                  label="Obstacle Size"
                  value={params.obstacleSize}
                  min={10}
                  max={100}
                  step={5}
                  onChange={handleObstacleSizeChange}
                  tooltip="Size of the circular obstacle. Larger obstacles create more significant flow disturbances."
                  icon={<MoveHorizontal className="h-4 w-4" />}
                />
                
                <div className="flex items-center justify-between mt-2">
                  <span>Sound Effects</span>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${soundEnabled ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Reynolds Number Explained</h3>
                <p className="text-sm text-muted-foreground">
                  The Reynolds number (Re) is a dimensionless quantity that predicts flow patterns. It's calculated as:
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 my-2 text-center font-mono">
                  Re = (ρ × v × L) / μ
                </div>
                <p className="text-sm text-muted-foreground">
                  Where ρ is fluid density, v is flow velocity, L is characteristic length, and μ is fluid viscosity.
                </p>
                <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                  <li><strong>Re &lt; 2300</strong>: Laminar flow (smooth, orderly)</li>
                  <li><strong>2300 &lt; Re &lt; 4000</strong>: Transitional flow</li>
                  <li><strong>Re &gt; 4000</strong>: Turbulent flow (chaotic, with eddies)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Flow Visualization Methods</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  This simulation uses several methods to help you understand fluid behavior:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <h4 className="text-sm font-medium">Streamlines</h4>
                    <p className="text-xs text-muted-foreground">
                      Show the path that fluid particles would follow at any moment in time.
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <h4 className="text-sm font-medium">Pressure Map</h4>
                    <p className="text-xs text-muted-foreground">
                      Red and blue regions indicate high and low pressure areas, respectively.
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <h4 className="text-sm font-medium">Speed Map</h4>
                    <p className="text-xs text-muted-foreground">
                      Shows velocity magnitude, with blue for slow and red for fast flow.
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <h4 className="text-sm font-medium">Vorticity Map</h4>
                    <p className="text-xs text-muted-foreground">
                      Visualizes rotational motion in the fluid.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeTab === 'live' && (
        <div className="flex justify-center space-x-4 mt-6">
          <Button 
            onClick={toggleSimulation} 
            variant="outline"
            size="lg"
            className="space-x-2"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? "Pause" : "Play"}</span>
          </Button>
          
          <Button 
            onClick={resetSimulation} 
            variant="outline"
            size="lg"
            className="space-x-2"
          >
            <RefreshCw size={18} />
            <span>Reset</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FluidDynamicsSimulation;
