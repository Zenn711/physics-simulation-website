import React, { useRef, useEffect, useState } from 'react';

interface OrbitVisualizationProps {
  isSimulating: boolean;
  timeSpeed: number;
  showTrails: boolean;
  showVectors: boolean;
  showSlingshot: boolean;
}

// Constants
const G = 6.67430e-11; // Gravitational constant (scaled for simulation)
const PIXELS_PER_UNIT = 1.5;

// Types for celestial bodies
interface CelestialBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: Array<{x: number, y: number}>;
}

const OrbitVisualization: React.FC<OrbitVisualizationProps> = ({ 
  isSimulating, 
  timeSpeed, 
  showTrails, 
  showVectors,
  showSlingshot
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Star and planets
  const [bodies, setBodies] = useState<CelestialBody[]>([
    // Sun
    {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      mass: 1000,
      radius: 20,
      color: '#FDB813',
      trail: []
    },
    // Earth-like planet
    {
      x: 150,
      y: 0,
      vx: 0,
      vy: 2,
      mass: 10,
      radius: 8,
      color: '#3185FC',
      trail: []
    }
  ]);
  
  // Add stars to background
  const [stars, setStars] = useState<Array<{x: number, y: number, radius: number}>>([]);
  
  // Initialize stars
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const newStars = [];
    const numStars = 100;
    
    for (let i = 0; i < numStars; i++) {
      newStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5
      });
    }
    
    setStars(newStars);
  }, []);
  
  // Main simulation loop
  useEffect(() => {
    if (!canvasRef.current || !isSimulating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Update function for physics
    const updatePhysics = () => {
      setBodies(prevBodies => {
        const newBodies = JSON.parse(JSON.stringify(prevBodies));
        
        // Calculate forces between bodies
        for (let i = 0; i < newBodies.length; i++) {
          const body1 = newBodies[i];
          
          // Keep the sun fixed at the center if it's the first body
          if (i === 0) {
            body1.x = 0;
            body1.y = 0;
            body1.vx = 0;
            body1.vy = 0;
            continue;
          }
          
          // Calculate gravitational forces from all other bodies
          let totalFx = 0;
          let totalFy = 0;
          
          for (let j = 0; j < newBodies.length; j++) {
            if (i === j) continue;
            
            const body2 = newBodies[j];
            const dx = body2.x - body1.x;
            const dy = body2.y - body1.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            // Prevent division by zero
            if (distance < 1) continue;
            
            // Calculate gravitational force
            const force = (G * body1.mass * body2.mass) / (distance * distance);
            const angle = Math.atan2(dy, dx);
            
            totalFx += force * Math.cos(angle);
            totalFy += force * Math.sin(angle);
          }
          
          // Apply forces (F = ma -> a = F/m)
          const ax = totalFx / body1.mass;
          const ay = totalFy / body1.mass;
          
          // Update velocity
          body1.vx += ax * timeSpeed;
          body1.vy += ay * timeSpeed;
          
          // Update position
          body1.x += body1.vx * timeSpeed;
          body1.y += body1.vy * timeSpeed;
          
          // Store position in trail
          if (showTrails && body1.trail.length < 100) {
            body1.trail.push({x: body1.x, y: body1.y});
          } else if (showTrails) {
            body1.trail.shift();
            body1.trail.push({x: body1.x, y: body1.y});
          }
        }
        
        return newBodies;
      });
    };
    
    // Animation loop
    const render = () => {
      if (!canvasRef.current) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars in background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw trails first (so they appear behind planets)
      if (showTrails) {
        bodies.forEach(body => {
          if (body.trail.length > 1) {
            ctx.strokeStyle = `${body.color}88`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            
            const firstPoint = body.trail[0];
            ctx.moveTo(centerX + firstPoint.x * PIXELS_PER_UNIT, centerY + firstPoint.y * PIXELS_PER_UNIT);
            
            for (let i = 1; i < body.trail.length; i++) {
              const point = body.trail[i];
              ctx.lineTo(centerX + point.x * PIXELS_PER_UNIT, centerY + point.y * PIXELS_PER_UNIT);
            }
            
            ctx.stroke();
          }
        });
      }
      
      // Draw reference lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
      
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.stroke();
      
      // Draw celestial bodies
      bodies.forEach((body, index) => {
        const x = centerX + body.x * PIXELS_PER_UNIT;
        const y = centerY + body.y * PIXELS_PER_UNIT;
        
        // Draw force vectors if enabled
        if (showVectors && index > 0) {
          const sun = bodies[0];
          const dx = sun.x - body.x;
          const dy = sun.y - body.y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          const angle = Math.atan2(dy, dx);
          
          // Calculate force magnitude for vector scaling
          const force = (G * body.mass * sun.mass) / (distance * distance);
          const vectorLength = Math.log(force) * 5; // Logarithmic scale for visibility
          
          ctx.strokeStyle = 'rgba(255, 100, 100, 0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(angle) * vectorLength,
            y + Math.sin(angle) * vectorLength
          );
          ctx.stroke();
          
          // Draw velocity vector
          ctx.strokeStyle = 'rgba(100, 255, 100, 0.7)';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + body.vx * 5,
            y + body.vy * 5
          );
          ctx.stroke();
        }
        
        // Draw glow effect for the sun
        if (index === 0) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, body.radius * 2);
          gradient.addColorStop(0, body.color);
          gradient.addColorStop(1, 'rgba(253, 184, 19, 0)');
          
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(x, y, body.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw the celestial body
        ctx.beginPath();
        ctx.fillStyle = body.color;
        ctx.arc(x, y, body.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add highlight to planets
        if (index > 0) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.arc(x - body.radius * 0.3, y - body.radius * 0.3, body.radius * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Update physics
      updatePhysics();
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isSimulating, timeSpeed, showTrails, showVectors, showSlingshot, stars]);
  
  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
          
          // Recalculate star positions
          setStars(prevStars => {
            return prevStars.map(() => ({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: Math.random() * 1.5
            }));
          });
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};

export default OrbitVisualization;
