
import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Pause, Play, RefreshCw } from 'lucide-react';

const ProjectileSimulation = () => {
  // Simulation parameters
  const [angle, setAngle] = useState<number>(45);
  const [velocity, setVelocity] = useState<number>(20);
  const [gravity, setGravity] = useState<number>(9.8);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  
  // Canvas references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Track projectile position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trajectory, setTrajectory] = useState<{x: number, y: number}[]>([]);
  
  // Maximum flight values for scaling
  const [maxDistance, setMaxDistance] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  
  // Calculate max distance and height
  useEffect(() => {
    const angleRad = angle * (Math.PI / 180);
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);
    
    // Calculate time of flight
    const timeOfFlight = (2 * vy) / gravity;
    
    // Calculate max distance
    const distance = vx * timeOfFlight;
    
    // Calculate max height
    const height = (vy * vy) / (2 * gravity);
    
    setMaxDistance(distance);
    setMaxHeight(height);
    
    resetSimulation();
  }, [angle, velocity, gravity]);
  
  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
    setPosition({ x: 0, y: 0 });
    setTrajectory([{ x: 0, y: 0 }]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    drawCanvas();
  };
  
  // Handle simulation start/stop
  const toggleSimulation = () => {
    if (isRunning) {
      setIsRunning(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      setIsRunning(true);
      runSimulation();
    }
  };
  
  // Run the simulation
  const runSimulation = () => {
    if (!isRunning) return;
    
    const angleRad = angle * (Math.PI / 180);
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);
    
    const newTime = time + 0.05;
    const x = vx * newTime;
    const y = vy * newTime - 0.5 * gravity * newTime * newTime;
    
    // If projectile hits ground, stop simulation
    if (y < 0) {
      setIsRunning(false);
      return;
    }
    
    setPosition({ x, y });
    setTrajectory(prev => [...prev, { x, y }]);
    setTime(newTime);
    
    drawCanvas();
    
    animationRef.current = requestAnimationFrame(runSimulation);
  };
  
  // Draw the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate scale to fit trajectory on canvas
    const paddingX = 50;
    const paddingY = 50;
    const scaleX = (canvasWidth - paddingX * 2) / (maxDistance || 1);
    const scaleY = (canvasHeight - paddingY * 2) / (maxHeight || 1);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw ground
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight - paddingY);
    ctx.lineTo(canvasWidth, canvasHeight - paddingY);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw trajectory
    if (trajectory.length > 1) {
      ctx.beginPath();
      trajectory.forEach((point, i) => {
        const screenX = paddingX + point.x * scaleX;
        const screenY = canvasHeight - (paddingY + point.y * scaleY);
        
        if (i === 0) {
          ctx.moveTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      });
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw projectile
    const screenX = paddingX + position.x * scaleX;
    const screenY = canvasHeight - (paddingY + position.y * scaleY);
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#8B5CF6';
    ctx.fill();
    
    // Draw launch point
    ctx.beginPath();
    ctx.arc(paddingX, canvasHeight - paddingY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444';
    ctx.fill();
  };
  
  // Set up canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    drawCanvas();
    
    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Update canvas when simulation parameters change
  useEffect(() => {
    drawCanvas();
  }, [position, trajectory]);
  
  return (
    <div className="flex flex-col space-y-6 p-4 w-full">
      <div className="w-full h-[350px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Launch Angle: {angle}°</Label>
              <Input
                type="number"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-20 text-right"
                min="0"
                max="90"
              />
            </div>
            <Slider
              value={[angle]}
              onValueChange={([value]) => setAngle(value)}
              min={0}
              max={90}
              step={1}
              className="cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Initial Velocity: {velocity} m/s</Label>
              <Input
                type="number"
                value={velocity}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-20 text-right"
                min="1"
                max="50"
              />
            </div>
            <Slider
              value={[velocity]}
              onValueChange={([value]) => setVelocity(value)}
              min={1}
              max={50}
              step={1}
              className="cursor-pointer"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Gravity: {gravity} m/s²</Label>
              <Input
                type="number"
                value={gravity}
                onChange={(e) => setGravity(Number(e.target.value))}
                className="w-20 text-right"
                min="0.1"
                max="30"
                step="0.1"
              />
            </div>
            <Slider
              value={[gravity]}
              onValueChange={([value]) => setGravity(value)}
              min={0.1}
              max={30}
              step={0.1}
              className="cursor-pointer"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">Flight Statistics:</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-white/5 rounded border border-gray-200 dark:border-gray-700">
                Max Height: {maxHeight.toFixed(2)} m
              </div>
              <div className="p-2 bg-white/5 rounded border border-gray-200 dark:border-gray-700">
                Max Distance: {maxDistance.toFixed(2)} m
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          onClick={toggleSimulation}
          className="w-32"
        >
          {isRunning ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Start</>}
        </Button>
        <Button 
          variant="outline" 
          onClick={resetSimulation}
          className="w-32"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
};

export default ProjectileSimulation;
