
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Play, Pause, RefreshCw } from 'lucide-react';

interface ProjectileState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
  isMoving: boolean;
}

const ProjectileSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(50);
  const [gravity, setGravity] = useState(9.8);
  
  const [projectileState, setProjectileState] = useState<ProjectileState>({
    x: 50,  // start position
    y: 0,   // ground level (will be adjusted based on canvas)
    vx: 0,  // initial velocity x component
    vy: 0,  // initial velocity y component
    time: 0,
    isMoving: false
  });
  
  // Initialize canvas and simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = 400; // Fixed height for simulation
      
      // Reset projectile to starting position
      setProjectileState(prev => ({
        ...prev,
        x: 50,
        y: canvas.height - 20, // 20px from bottom
        isMoving: false
      }));
      
      // Draw the initial scene
      drawScene();
    };
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Handle simulation state changes
  useEffect(() => {
    if (isSimulating && projectileState.isMoving) {
      startAnimation();
    } else {
      stopAnimation();
    }
    
    return () => {
      stopAnimation();
    };
  }, [isSimulating, projectileState.isMoving]);
  
  // Update initial velocity when angle or velocity magnitude changes
  useEffect(() => {
    const radians = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(radians);
    const vy = -velocity * Math.sin(radians); // Negative because canvas y increases downward
    
    setProjectileState(prev => ({
      ...prev,
      vx,
      vy
    }));
    
    // Redraw scene with updated trajectory preview
    drawScene();
  }, [angle, velocity]);
  
  // Start animation loop
  const startAnimation = () => {
    if (animationRef.current) return;
    
    let lastTime: number | null = null;
    
    const animate = (currentTime: number) => {
      if (lastTime === null) {
        lastTime = currentTime;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = (currentTime - lastTime) / 1000; // convert to seconds
      lastTime = currentTime;
      
      updateProjectile(deltaTime);
      drawScene();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Stop animation loop
  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Update projectile position and velocity
  const updateProjectile = (deltaTime: number) => {
    if (!canvasRef.current) return;
    
    setProjectileState(prev => {
      const newTime = prev.time + deltaTime;
      const newVy = prev.vy + gravity * deltaTime;
      const newX = prev.x + prev.vx * deltaTime;
      const newY = prev.y + newVy * deltaTime;
      
      // Check if projectile has hit the ground
      if (newY >= canvasRef.current!.height - 20) {
        setIsSimulating(false);
        return {
          ...prev,
          y: canvasRef.current!.height - 20,
          time: newTime,
          isMoving: false
        };
      }
      
      // Check if projectile has gone off-screen
      if (newX > canvasRef.current!.width) {
        setIsSimulating(false);
        return {
          ...prev,
          isMoving: false
        };
      }
      
      return {
        ...prev,
        x: newX,
        y: newY,
        vy: newVy,
        time: newTime
      };
    });
  };
  
  // Draw the scene (ground, projectile, trajectory)
  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    context.fillStyle = '#8B4513'; // Brown color for ground
    context.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // Draw projectile
    context.fillStyle = '#FF0000'; // Red ball
    context.beginPath();
    context.arc(projectileState.x, projectileState.y, 10, 0, Math.PI * 2);
    context.fill();
    
    // Draw trajectory preview if not moving
    if (!projectileState.isMoving && !isSimulating) {
      drawTrajectoryPreview(context);
    }
  };
  
  // Draw predicted trajectory path
  const drawTrajectoryPreview = (context: CanvasRenderingContext2D) => {
    const startX = 50; // same as initial position
    const startY = canvasRef.current!.height - 20; // ground level
    
    const radians = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(radians);
    const vy = -velocity * Math.sin(radians); // Negative because canvas y increases downward
    
    context.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    context.lineWidth = 2;
    context.setLineDash([5, 5]); // Dashed line
    context.beginPath();
    context.moveTo(startX, startY);
    
    for (let t = 0; t < 10; t += 0.1) {
      const x = startX + vx * t;
      const y = startY + vy * t + 0.5 * gravity * t * t;
      
      if (y >= canvasRef.current!.height - 20 || x > canvasRef.current!.width) {
        break;
      }
      
      context.lineTo(x, y);
    }
    
    context.stroke();
    context.setLineDash([]); // Reset to solid line
  };
  
  // Start the simulation
  const handleStart = () => {
    setProjectileState(prev => ({
      ...prev,
      x: 50,
      y: canvasRef.current!.height - 20, // Reset to ground level
      time: 0,
      isMoving: true
    }));
    
    setIsSimulating(true);
  };
  
  // Reset the simulation
  const handleReset = () => {
    setIsSimulating(false);
    setProjectileState(prev => ({
      ...prev,
      x: 50,
      y: canvasRef.current!.height - 20, // Reset to ground level
      time: 0,
      isMoving: false
    }));
    
    drawScene();
  };
  
  // Toggle simulation pause/play
  const handleTogglePause = () => {
    setIsSimulating(prev => !prev);
  };
  
  return (
    <div className="w-full space-y-4">
      <Card className="p-4 border shadow-md">
        <h2 className="text-xl font-bold mb-4">Projectile Motion Simulation</h2>
        
        <div className="relative overflow-hidden border rounded-lg">
          <canvas 
            ref={canvasRef} 
            className="w-full bg-sky-50 dark:bg-sky-950"
            style={{ height: '400px' }}
          />
        </div>
        
        <div className="flex gap-2 mt-4">
          {!projectileState.isMoving ? (
            <Button onClick={handleStart} className="flex items-center gap-1">
              <Play size={16} /> Start
            </Button>
          ) : (
            <Button onClick={handleTogglePause} className="flex items-center gap-1">
              {isSimulating ? <Pause size={16} /> : <Play size={16} />}
              {isSimulating ? 'Pause' : 'Resume'}
            </Button>
          )}
          
          <Button 
            onClick={handleReset} 
            variant="outline"
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} /> Reset
          </Button>
        </div>
        
        <Collapsible 
          open={isControlsOpen} 
          onOpenChange={setIsControlsOpen}
          className="mt-4 border rounded-md p-2"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Simulation Controls</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isControlsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-4 mt-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="angle" className="text-sm">Launch Angle: {angle}°</label>
              </div>
              <Slider
                id="angle"
                value={[angle]}
                min={0}
                max={90}
                step={1}
                onValueChange={(values) => setAngle(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="velocity" className="text-sm">Initial Velocity: {velocity} m/s</label>
              </div>
              <Slider
                id="velocity"
                value={[velocity]}
                min={10}
                max={100}
                step={1}
                onValueChange={(values) => setVelocity(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="gravity" className="text-sm">Gravity: {gravity} m/s²</label>
              </div>
              <Slider
                id="gravity"
                value={[gravity]}
                min={1}
                max={20}
                step={0.1}
                onValueChange={(values) => setGravity(values[0])}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      
      <Card className="p-4 border shadow-md">
        <h3 className="font-bold mb-2">How It Works</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This simulation demonstrates projectile motion under gravity. Adjust the launch angle, initial velocity, 
          and gravitational acceleration to see how they affect the trajectory. The red dashed line shows the 
          predicted path of the projectile before launch.
        </p>
        <div className="mt-4">
          <h4 className="font-semibold text-sm">Physics Equations:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2">
            <li>Horizontal position: x = x₀ + v₀ᵪ × t</li>
            <li>Vertical position: y = y₀ + v₀ᵧ × t + ½ × g × t²</li>
            <li>Horizontal velocity: v₀ᵪ = v₀ × cos(θ)</li>
            <li>Vertical velocity: v₀ᵧ = -v₀ × sin(θ)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ProjectileSimulation;
