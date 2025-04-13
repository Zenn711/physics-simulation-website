import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, HelpCircle, MoveHorizontal, Droplet, Wind, Grid3X3 } from 'lucide-react';
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
  
  // Canvas references
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
        Math.floor(200 + Math.random() * 40)   // Blue for flow
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
          
          // Draw streamline
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + vx, y + vy);
          
          // Different colors based on speed
          const speed = Math.sqrt(vx * vx + vy * vy);
          const normalizedSpeed = speed / arrowLength;
          
          let alpha = 0.2;
          if (simulationType === 'turbulent') alpha = 0.15;
          
          let hue;
          if (simulationType === 'diffusion') {
            hue = 180; // Cyan for diffusion
          } else {
            hue = 220 - normalizedSpeed * 40; // Blue to purple based on speed
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
    
    // Draw pressure zones around obstacle
    if (simulationType !== 'diffusion' && isRunning) {
      // High pressure zone in front
      const frontGradient = ctx.createRadialGradient(
        obstacleX - obstacleRadius, obstacleY,
        0,
        obstacleX - obstacleRadius, obstacleY,
        obstacleRadius * 1.2
      );
      frontGradient.addColorStop(0, `rgba(30, 144, 255, ${0.2 * params.flowSpeed})`);
      frontGradient.addColorStop(1, 'rgba(30, 144, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(obstacleX - obstacleRadius, obstacleY, obstacleRadius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = frontGradient;
      ctx.fill();
      
      // Low pressure zone behind
      const backGradient = ctx.createRadialGradient(
        obstacleX + obstacleRadius * 1.5, obstacleY,
        0,
        obstacleX + obstacleRadius * 1.5, obstacleY,
        obstacleRadius * 2
      );
      backGradient.addColorStop(0, `rgba(138, 43, 226, ${0.15 * params.flowSpeed})`);
      backGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
      
      ctx.beginPath();
      ctx.arc(obstacleX + obstacleRadius * 1.5, obstacleY, obstacleRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = backGradient;
      ctx.fill();
      
      // Add vortices in wake for turbulent flow
      if (simulationType === 'turbulent') {
        for (let i = 1; i <= 3; i++) {
          const vortexX = obstacleX + obstacleRadius * (1 + i * 0.7);
          const upperY = obstacleY - obstacleRadius * 0.5 * i;
          const lowerY = obstacleY + obstacleRadius * 0.5 * i;
          
          const vortexGradient1 = ctx.createRadialGradient(
            vortexX, upperY, 0,
            vortexX, upperY, obstacleRadius * 0.4
          );
          vortexGradient1.addColorStop(0, `rgba(255, 100, 100, ${0.2 * params.flowSpeed})`);
          vortexGradient1.addColorStop(1, 'rgba(255, 100, 100, 0)');
          
          ctx.beginPath();
          ctx.arc(vortexX, upperY, obstacleRadius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = vortexGradient1;
          ctx.fill();
          
          const vortexGradient2 = ctx.createRadialGradient(
            vortexX, lowerY, 0,
            vortexX, lowerY, obstacleRadius * 0.4
          );
          vortexGradient2.addColorStop(0, `rgba(100, 100, 255, ${0.2 * params.flowSpeed})`);
          vortexGradient2.addColorStop(1, 'rgba(100, 100, 255, 0)');
          
          ctx.beginPath();
          ctx.arc(vortexX, lowerY, obstacleRadius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = vortexGradient2;
          ctx.fill();
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
        
        // Determine color based on speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const normalizedSpeed = Math.min(1, speed / (params.flowSpeed * 1.5));
        
        const hue = simulationType === 'laminar' ? 
          220 - normalizedSpeed * 40 : // Blue to purple gradient for laminar
          (220 - normalizedSpeed * 120) % 360; // Wider color range for turbulent
        
        const saturation = simulationType === 'laminar' ? 80 : 70;
        const lightness = 50 + normalizedSpeed * 10;
        
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.lineWidth = 1.5 + normalizedSpeed;
        ctx.stroke();
      }
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

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="w-full flex flex-wrap items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Fluid Dynamics Simulator</h2>
        <div className="flex space-x-2">
          <Select 
            value={simulationType} 
            onValueChange={(val: 'laminar' | 'turbulent' | 'diffusion') => setSimulationType(val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Flow Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laminar">Laminar Flow</SelectItem>
              <SelectItem value="turbulent">Turbulent Flow</SelectItem>
              <SelectItem value="diffusion">Dye Diffusion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
      </div>
      
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
                tooltip="Controls fluid thickness. Higher values make the fluid move more slowly."
                icon={<Droplet className="h-4 w-4" />}
              />
              
              <ParameterControl
                label="Flow Speed"
                value={params.flowSpeed}
                min={0.1}
                max={2}
                step={0.1}
                onChange={handleFlowSpeedChange}
                tooltip="Controls how fast the fluid flows from left to right."
                icon={<Wind className="h-4 w-4" />}
              />
              
              <ParameterControl
                label="Particle Density"
                value={params.particleDensity}
                min={50}
                max={500}
                step={10}
                onChange={handleParticleDensityChange}
                tooltip="Number of particles used to visualize the flow."
                icon={<Grid3X3 className="h-4 w-4" />}
              />
              
              <ParameterControl
                label="Obstacle Size"
                value={params.obstacleSize}
                min={10}
                max={100}
                step={5}
                onChange={handleObstacleSizeChange}
                tooltip="Size of the circular obstacle in the middle of the flow."
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
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">About This Simulation</h3>
              <p className="text-sm text-muted-foreground">
                This simulation demonstrates fundamental concepts in fluid dynamics, showing how fluids behave
                when flowing around obstacles. Experiment with different parameters to see how they affect the flow patterns.
              </p>
              
              <div className="grid grid-cols-1 gap-3 mt-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <h4 className="text-sm font-medium">Reynolds Number</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    In fluid dynamics, the Reynolds number predicts flow patterns. Low values produce laminar flow,
                    while high values create turbulent flow. Increase flow speed or decrease viscosity to see the transition.
                  </p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <h4 className="text-sm font-medium">Flow Visualization</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Each colored streak represents a particle in the fluid. Watch how they interact with the obstacle
                    and form patterns based on the flow regime. Pressure gradients appear as color variations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
    </div>
  );
};

export default FluidDynamicsSimulation;
