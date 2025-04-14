import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  RefreshCw,
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const ProjectileSimulation = () => {
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [isSimulating, setIsSimulating] = useState(false);
  const [projectile, setProjectile] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState<Array<{ x: number, y: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Simulation parameters
  const gravity = 9.81; // Earth's gravity in m/s^2
  const timeScale = 0.1; // Scale down time for simulation speed
  
  // Conversion functions
  const metersToPixels = (meters: number) => meters * 10; // Scale factor
  const pixelsToMeters = (pixels: number) => pixels / 10; // Scale factor
  
  // Initial velocity components
  const initialVelocityX = velocity * Math.cos(angle * Math.PI / 180);
  const initialVelocityY = velocity * Math.sin(angle * Math.PI / 180);
  
  // Function to calculate projectile position at time t
  const calculatePosition = (time: number) => {
    const x = initialVelocityX * time;
    const y = initialVelocityY * time - 0.5 * gravity * time * time;
    return { x, y };
  };
  
  // Reset projectile to initial conditions
  const resetProjectile = () => {
    setProjectile({ x: 0, y: 0 });
    setPath([]);
  };
  
  // Main simulation loop
  useEffect(() => {
    if (!isSimulating || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let startTime: number | null = null;
    let animationFrameId: number | null = null;
    
    const simulate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = (currentTime - startTime) / 1000; // Convert milliseconds to seconds
      
      // Calculate new position
      const newPosition = calculatePosition(elapsedTime * timeScale);
      
      // Convert meters to pixels for canvas
      const x = metersToPixels(newPosition.x);
      const y = canvas.height - metersToPixels(newPosition.y); // Invert y-axis
      
      // Update projectile state
      setProjectile({ x, y });
      setPath(prevPath => [...prevPath, { x, y }]);
      
      // Check if projectile is out of bounds (hit the ground)
      if (y > canvas.height) {
        setIsSimulating(false);
        return;
      }
      
      // Continue simulation
      animationFrameId = requestAnimationFrame(simulate);
    };
    
    // Start the animation loop
    animationFrameId = requestAnimationFrame(simulate);
    
    // Cleanup function to cancel animation frame
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isSimulating, velocity, angle]);
  
  // Handle canvas drawing
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // Draw path
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    path.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    
    // Draw projectile
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }, [projectile, path]);

  // Inside the ProjectileSimulation component
  const handleLaunch = () => {
    if (isSimulating) return;
    
    // Reset any existing simulation
    resetProjectile();
    
    // Validate inputs before launching
    if (angle < 0 || angle > 90) {
      toast({
        title: "Invalid Angle",
        description: "Angle must be between 0 and 90 degrees.",
        variant: "destructive"
      });
      return;
    }
    
    if (velocity <= 0) {
      toast({
        title: "Invalid Velocity",
        description: "Initial velocity must be greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    // Start simulation
    setIsSimulating(true);
  };
  
  const toggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      handleLaunch();
    }
  };
  
  const resetSimulation = () => {
    setIsSimulating(false);
    resetProjectile();
    setPath([]);
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Projectile Motion Simulation</h2>
      
      <div className="space-y-4">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="velocity" className="block text-sm font-medium text-gray-700">
              Initial Velocity (m/s)
            </label>
            <Slider
              id="velocity"
              defaultValue={[velocity]}
              max={50}
              min={5}
              step={1}
              onValueChange={(value) => setVelocity(value[0])}
              disabled={isSimulating}
            />
            <span className="text-sm text-gray-500">Value: {velocity} m/s</span>
          </div>
          
          <div>
            <label htmlFor="angle" className="block text-sm font-medium text-gray-700">
              Launch Angle (degrees)
            </label>
            <Slider
              id="angle"
              defaultValue={[angle]}
              max={90}
              min={0}
              step={1}
              onValueChange={(value) => setAngle(value[0])}
              disabled={isSimulating}
            />
            <span className="text-sm text-gray-500">Value: {angle}°</span>
          </div>
        </div>
        
        {/* Canvas */}
        <div className="w-full h-[400px] bg-gray-100 relative">
          <canvas ref={canvasRef} width="600" height="400" className="absolute inset-0" />
        </div>
        
        {/* Simulation Controls */}
        <div className="flex justify-start gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleSimulation}
            disabled={velocity <= 0 || angle < 0 || angle > 90}
          >
            {isSimulating ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isSimulating ? 'Pause' : 'Simulate'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetSimulation}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectileSimulation;
