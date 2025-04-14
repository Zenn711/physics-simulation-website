
import React, { useRef, useEffect, useState } from 'react';

interface OrbitVisualizationProps {
  isSimulating: boolean;
  timeSpeed: number;
  showTrails: boolean;
  showVectors: boolean;
  showSlingshot: boolean;
}

interface CelestialBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: Array<{x: number, y: number}>;
  name: string;
}

const OrbitVisualization: React.FC<OrbitVisualizationProps> = ({
  isSimulating,
  timeSpeed,
  showTrails,
  showVectors,
  showSlingshot,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(!isSimulating);
  const [bodies, setBodies] = useState<CelestialBody[]>([]);
  
  // Physics constants
  const G = 6.67430e-11; // Gravitational constant
  const scaleFactor = 1e9; // Scale factor to make visuals reasonable
  const timeStep = 3600 * 24; // Time step in seconds (1 day)

  // Initialize the simulation
  useEffect(() => {
    initializeSimulation();
    
    return () => {
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [showSlingshot]);

  // Handle simulation running state
  useEffect(() => {
    setIsPaused(!isSimulating);
  }, [isSimulating]);

  const initializeSimulation = () => {
    // Initialize celestial bodies
    const newBodies: CelestialBody[] = [
      // Star (Sun-like)
      {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        mass: 1.989e30, // Solar mass
        radius: 15,
        color: '#ffcc00',
        trail: [],
        name: 'Star'
      },
      // Planet (Earth-like)
      {
        x: 150e9, // 150 million km
        y: 0,
        vx: 0,
        vy: 29.78e3, // Earth's orbital velocity
        mass: 5.972e24, // Earth mass
        radius: 6,
        color: '#3498db',
        trail: [],
        name: 'Planet'
      }
    ];

    // Add asteroid/comet for slingshot if enabled
    if (showSlingshot) {
      newBodies.push({
        x: -200e9,
        y: -100e9,
        vx: 5e3,
        vy: 20e3,
        mass: 1e16, // Small mass
        radius: 3,
        color: '#7f8c8d',
        trail: [],
        name: 'Comet'
      });
    }

    setBodies(newBodies);

    // Start the animation
    if (requestIdRef.current !== null) {
      cancelAnimationFrame(requestIdRef.current);
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawFrame(ctx, newBodies);
      }
    }
  };

  // Animation loop
  useEffect(() => {
    if (isPaused) {
      return;
    }

    const animate = () => {
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Update positions based on physics
      updatePhysics();
      
      // Draw the updated scene
      drawFrame(ctx, bodies);
      
      // Continue the animation loop
      requestIdRef.current = requestAnimationFrame(animate);
    };

    requestIdRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [isPaused, bodies, timeSpeed, showTrails, showVectors]);

  // Physics update function
  const updatePhysics = () => {
    const scaledTimeStep = timeStep * timeSpeed;
    
    setBodies(prevBodies => {
      // Create a deep copy of the bodies array
      const newBodies = JSON.parse(JSON.stringify(prevBodies));
      
      // Calculate forces between all bodies
      for (let i = 0; i < newBodies.length; i++) {
        let fx = 0;
        let fy = 0;
        
        for (let j = 0; j < newBodies.length; j++) {
          if (i !== j) {
            // Calculate distance between bodies
            const dx = newBodies[j].x - newBodies[i].x;
            const dy = newBodies[j].y - newBodies[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate gravitational force
            const force = G * newBodies[i].mass * newBodies[j].mass / (distance * distance);
            
            // Resolve force into components
            fx += force * dx / distance;
            fy += force * dy / distance;
          }
        }
        
        // Calculate acceleration
        const ax = fx / newBodies[i].mass;
        const ay = fy / newBodies[i].mass;
        
        // Update velocity
        newBodies[i].vx += ax * scaledTimeStep;
        newBodies[i].vy += ay * scaledTimeStep;
        
        // Store current position in trail before updating
        if (showTrails) {
          newBodies[i].trail.push({
            x: newBodies[i].x / scaleFactor,
            y: newBodies[i].y / scaleFactor
          });
          
          // Limit trail length
          if (newBodies[i].trail.length > 500) {
            newBodies[i].trail.shift();
          }
        }
        
        // Update position
        newBodies[i].x += newBodies[i].vx * scaledTimeStep;
        newBodies[i].y += newBodies[i].vy * scaledTimeStep;
      }
      
      return newBodies;
    });
  };

  // Drawing function
  const drawFrame = (ctx: CanvasRenderingContext2D, bodiesToDraw: CelestialBody[]) => {
    if (!canvasRef.current) return;
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background with subtle star field
    ctx.fillStyle = '#0a0a16';
    ctx.fillRect(0, 0, width, height);
    
    // Draw simple star field
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw gravity field visualization (subtle gradient around star)
    const starBody = bodiesToDraw.find(body => body.name === 'Star');
    if (starBody) {
      const starX = centerX + starBody.x / scaleFactor;
      const starY = centerY + starBody.y / scaleFactor;
      
      const gradient = ctx.createRadialGradient(
        starX, starY, starBody.radius,
        starX, starY, 150
      );
      gradient.addColorStop(0, 'rgba(255, 204, 0, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 204, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(starX, starY, 150, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw trails
    if (showTrails) {
      for (const body of bodiesToDraw) {
        if (body.trail.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = `${body.color}70`; // Semi-transparent
          ctx.lineWidth = 1.5;
          
          // Start from the oldest point in the trail
          const startPoint = body.trail[0];
          ctx.moveTo(centerX + startPoint.x, centerY + startPoint.y);
          
          // Connect all points
          for (let i = 1; i < body.trail.length; i++) {
            const point = body.trail[i];
            ctx.lineTo(centerX + point.x, centerY + point.y);
          }
          
          ctx.stroke();
        }
      }
    }
    
    // Draw bodies
    for (const body of bodiesToDraw) {
      const x = centerX + body.x / scaleFactor;
      const y = centerY + body.y / scaleFactor;
      
      // Draw celestial body
      ctx.beginPath();
      ctx.fillStyle = body.color;
      ctx.arc(x, y, body.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect to the star
      if (body.name === 'Star') {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          x, y, body.radius * 0.5,
          x, y, body.radius * 1.5
        );
        gradient.addColorStop(0, body.color);
        gradient.addColorStop(1, 'rgba(255, 204, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(x, y, body.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw velocity vectors
      if (showVectors) {
        const vectorScale = 0.2; // Scale factor for vectors
        const vx = body.vx * vectorScale;
        const vy = body.vy * vectorScale;
        
        // Draw velocity vector
        ctx.beginPath();
        ctx.strokeStyle = '#2ecc71'; // Green for velocity
        ctx.lineWidth = 2;
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx, y + vy);
        
        // Draw arrow head
        const angle = Math.atan2(vy, vx);
        ctx.lineTo(
          x + vx - 10 * Math.cos(angle - Math.PI / 6),
          y + vy - 10 * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x + vx, y + vy);
        ctx.lineTo(
          x + vx - 10 * Math.cos(angle + Math.PI / 6),
          y + vy - 10 * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        
        // Optional: Draw gravitational force vectors for non-star bodies
        if (body.name !== 'Star') {
          // Calculate force direction to the star
          const starBody = bodiesToDraw.find(b => b.name === 'Star');
          if (starBody) {
            const dx = starBody.x - body.x;
            const dy = starBody.y - body.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Normalize and scale
            const forceScale = 50;
            const fx = dx / distance * forceScale;
            const fy = dy / distance * forceScale;
            
            // Draw force vector
            ctx.beginPath();
            ctx.strokeStyle = '#e74c3c'; // Red for gravity
            ctx.lineWidth = 1.5;
            ctx.setLineDash([2, 2]); // Dashed line for force
            ctx.moveTo(x, y);
            ctx.lineTo(x + fx, y + fy);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line style
          }
        }
      }
      
      // Add labels for bodies
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(body.name, x, y - body.radius - 10);
    }
  };

  return (
    <canvas 
      ref={canvasRef}
      width={600}
      height={400}
      className="w-full h-full rounded-md"
    />
  );
};

export default OrbitVisualization;
