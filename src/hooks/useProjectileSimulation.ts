import { useState, useRef, useMemo, useEffect } from 'react';
import { applyProjectileSimulationFix } from '@/utils/projectileSimulationPatch';

interface Environment {
  gravity: number;
  airResistance: number;
  background: string;
}

interface ProjectileState {
  params: {
    angle: number;
    velocity: number;
  };
  isRunning: boolean;
  position: { x: number; y: number };
  time: number;
  trajectory: Array<{ x: number; y: number }>;
  hasLanded: boolean;
  environment: string;
  showTrail: boolean;
  autoScale: boolean;
  viewScale: number;
}

export const useProjectileSimulation = () => {
  // Simulation parameters
  const [params, setParams] = useState({
    angle: 45,
    velocity: 20
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [trajectory, setTrajectory] = useState([{ x: 0, y: 0 }]);
  const [hasLanded, setHasLanded] = useState(false);
  
  // Environment and visual settings
  const [environment, setEnvironment] = useState('earth');
  const environments = useMemo<Record<string, Environment>>(() => ({
    earth: { gravity: 9.8, airResistance: 0.02, background: 'bg-gradient-to-b from-blue-300 to-blue-100 dark:from-blue-900 dark:to-blue-800' },
    moon: { gravity: 1.62, airResistance: 0, background: 'bg-gradient-to-b from-gray-500 to-gray-300 dark:from-gray-800 dark:to-gray-700' },
    mars: { gravity: 3.72, airResistance: 0.01, background: 'bg-gradient-to-b from-red-300 to-red-200 dark:from-red-900 dark:to-red-800' }
  }), []);
  
  // Visual settings
  const [showTrail, setShowTrail] = useState(true);
  const [autoScale, setAutoScale] = useState(true);
  const [viewScale, setViewScale] = useState(1);
  
  // Canvas properties
  const width = 600;
  const height = 300;
  const basescale = 20; // Base pixels per meter
  
  // Animation settings
  const timeStep = 0.05;
  const animationSpeed = 30; // ms
  
  // Animation reference
  const animationRef = useRef<number | null>(null);
  const maxTrajectoryRef = useRef({ maxX: 0, maxY: 0 });

  // Apply fix from patch utility
  useEffect(() => {
    applyProjectileSimulationFix();
  }, []);
  
  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
    setPosition({ x: 0, y: 0 });
    setTrajectory([{ x: 0, y: 0 }]);
    setHasLanded(false);
    
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Handle parameter changes
  const handleAngleChange = (newValue: number[]) => {
    setParams(prev => ({ ...prev, angle: newValue[0] }));
  };
  
  const handleVelocityChange = (newValue: number[]) => {
    setParams(prev => ({ ...prev, velocity: newValue[0] }));
  };
  
  const handleLaunch = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (event && 'preventDefault' in event) {
      event.preventDefault();
    }
    
    setIsRunning(true);
    setHasLanded(false);
    resetSimulation();
  };
  
  // Toggle simulation state
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };
  
  // Calculate maximum trajectory
  useEffect(() => {
    if (autoScale) {
      // Calculate expected range and max height for auto-scaling
      const angleRad = params.angle * Math.PI / 180;
      const currGravity = environments[environment].gravity;
      const maxHeight = (params.velocity * params.velocity * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * currGravity);
      const range = (params.velocity * params.velocity * Math.sin(2 * angleRad)) / currGravity;
      
      maxTrajectoryRef.current = { maxX: range, maxY: maxHeight };
      
      // Calculate suitable scale factor to keep trajectory in view
      const xScale = range > 0 ? (width * 0.8) / (range * basescale) : 1;
      const yScale = maxHeight > 0 ? (height * 0.8) / (maxHeight * basescale) : 1;
      
      // Use the more restrictive scale (smaller value)
      const newScale = Math.min(xScale, yScale, 1);
      setViewScale(newScale > 0 ? 1/newScale : 1);
    }
  }, [params, environment, basescale, width, height, environments, autoScale]);
  
  // Animation logic
  useEffect(() => {
    if (!isRunning || hasLanded) return;

    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    animationRef.current = window.setInterval(() => {
      setTime((prev) => {
        const newTime = prev + timeStep;

        // Calculate projectile motion with environment effects
        const angleRad = params.angle * Math.PI / 180;
        const vx = params.velocity * Math.cos(angleRad);
        const vy = params.velocity * Math.sin(angleRad);
        
        const currGravity = environments[environment].gravity;
        const airResistance = environments[environment].airResistance;
        
        // Apply simple air resistance model
        const x = vx * newTime * (1 - airResistance * newTime);
        const y = vy * newTime * (1 - airResistance * newTime) - 0.5 * currGravity * newTime * newTime;

        // Check if projectile would go below ground in this update
        if (y <= 0) {
          // Calculate exact landing position and time
          // Solving the quadratic equation for time when y = 0
          const a = 0.5 * currGravity;
          const b = -vy * (1 - airResistance * newTime);
          const c = 0;
          
          const discriminant = b * b - 4 * a * c;
          const tLand = (-b - Math.sqrt(discriminant)) / (2 * a);
          
          // Calculate x position at landing time
          const xLand = vx * tLand * (1 - airResistance * tLand);
          
          // Set position exactly at ground level
          setPosition({ x: xLand, y: 0 });
          setHasLanded(true);
          clearInterval(animationRef.current!);
          
          // Add landing position to trajectory if showing trail
          if (showTrail) {
            setTrajectory(prev => [...prev, { x: xLand, y: 0 }]);
          }
          
          return tLand; // Update time to exact landing time
        } else {
          // Normal position update
          const newPosition = { x, y };
          setPosition(newPosition);
          
          if (showTrail) {
            setTrajectory(prev => [...prev, newPosition]);
          }
          
          return newTime;
        }
      });
    }, animationSpeed);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isRunning, params, hasLanded, environment, showTrail, environments, timeStep, animationSpeed]);
  
  // Calculate trajectory metrics
  const angleRad = params.angle * Math.PI / 180;
  const currGravity = environments[environment].gravity;
  const maxHeight = (params.velocity * params.velocity * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * currGravity);
  const range = (params.velocity * params.velocity * Math.sin(2 * angleRad)) / currGravity;
  
  // Calculate scale
  const scale = basescale / viewScale;

  return {
    // State
    params,
    isRunning,
    position,
    time,
    trajectory,
    hasLanded,
    environment,
    showTrail,
    autoScale,
    viewScale,
    
    // Environment data
    environments,
    
    // Derived values
    angleRad,
    maxHeight,
    range,
    scale,
    width,
    height,
    
    // Actions
    setParams,
    setEnvironment,
    setShowTrail,
    setAutoScale,
    resetSimulation,
    toggleSimulation,
    handleAngleChange,
    handleVelocityChange,
    handleLaunch
  };
};

export type { ProjectileState };
