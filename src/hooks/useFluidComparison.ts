
import { useRef, useEffect } from 'react';

interface ComparisonRefs {
  laminarRef: React.RefObject<HTMLCanvasElement>;
  turbulentRef: React.RefObject<HTMLCanvasElement>;
}

export const useFluidComparison = ({ laminarRef, turbulentRef }: ComparisonRefs) => {
  const animationRef = useRef<number | null>(null);
  const particlesLaminarRef = useRef<any[]>([]);
  const particlesTurbulentRef = useRef<any[]>([]);
  
  // Initialize comparison view
  const initializeComparisonView = () => {
    if (!laminarRef.current || !turbulentRef.current) return;
    
    // Initialize laminar particles
    particlesLaminarRef.current = createParticles(100, false);
    
    // Initialize turbulent particles
    particlesTurbulentRef.current = createParticles(100, true);
    
    // Start comparison animation
    animateComparison();
  };
  
  // Create particles for comparison
  const createParticles = (count: number, isTurbulent: boolean) => {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      // Create particles across the entire left side for better distribution
      particles.push({
        x: Math.random() * 20, // Start at the left edge
        y: Math.random() * 100,
        vx: 0.7 + Math.random() * 0.5, // Base velocity
        vy: isTurbulent ? (Math.random() - 0.5) * 0.4 : (Math.random() - 0.5) * 0.1,
        age: Math.random() * 100,
        maxAge: 350 + Math.random() * 150, // Increased maxAge to ensure particles travel full width
        hue: 210 + Math.random() * 30,
        turbulent: isTurbulent
      });
    }
    
    return particles;
  };

  // Animation loop for comparison
  const animateComparison = () => {
    if (!laminarRef.current || !turbulentRef.current) return;
    
    // Update and draw laminar flow
    updateAndDrawParticles(
      laminarRef.current,
      particlesLaminarRef.current,
      false
    );
    
    // Update and draw turbulent flow
    updateAndDrawParticles(
      turbulentRef.current,
      particlesTurbulentRef.current,
      true
    );
    
    animationRef.current = requestAnimationFrame(animateComparison);
  };
  
  // Update and draw particles for comparison
  const updateAndDrawParticles = (
    canvas: HTMLCanvasElement,
    particles: any[],
    isTurbulent: boolean
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear with semi-transparent overlay for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'; // Reduced opacity to create longer, more visible trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw obstacle
    const obstacleX = canvas.width / 2;
    const obstacleY = canvas.height / 2;
    const obstacleRadius = 15;
    
    // Draw streamlines
    drawComparisonStreamlines(ctx, canvas.width, canvas.height, obstacleX, obstacleY, obstacleRadius, isTurbulent);
    
    // Draw obstacle
    ctx.beginPath();
    ctx.arc(obstacleX, obstacleY, obstacleRadius, 0, Math.PI * 2);
    ctx.fillStyle = isTurbulent ? '#6a4c93' : '#2a6f97'; 
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Age particles
      p.age += 1;
      
      // Reset aged-out particles
      if (p.age > p.maxAge || p.x > canvas.width) {
        // Reset to left edge with random position
        p.x = Math.random() * 20;
        p.y = Math.random() * canvas.height;
        p.age = 0;
        p.vx = 0.7 + Math.random() * 0.5;
        p.vy = isTurbulent ? (Math.random() - 0.5) * 0.4 : (Math.random() - 0.5) * 0.1;
        continue;
      }
      
      // Calculate distance to obstacle
      const dx = p.x - obstacleX;
      const dy = p.y - obstacleY;
      const distToObstacle = Math.sqrt(dx * dx + dy * dy);
      
      // Handle collision with obstacle
      if (distToObstacle < obstacleRadius + 2) {
        const nx = dx / distToObstacle;
        const ny = dy / distToObstacle;
        
        // Reflect velocity
        const dot = p.vx * nx + p.vy * ny;
        p.vx = p.vx - 2 * dot * nx;
        p.vy = p.vy - 2 * dot * ny;
        
        // Move outside obstacle
        p.x = obstacleX + (obstacleRadius + 2) * nx;
        p.y = obstacleY + (obstacleRadius + 2) * ny;
        
        // Add turbulence if needed
        if (isTurbulent) {
          p.vx += (Math.random() - 0.5) * 0.3;
          p.vy += (Math.random() - 0.5) * 0.3;
        }
      } else {
        // Apply flow effects
        if (isTurbulent) {
          // Turbulent flow effects
          p.vy += (Math.random() - 0.5) * 0.03;
          p.vx += (Math.random() - 0.5) * 0.01;
          
          // Add small forward bias
          if (p.vx < 0.3) p.vx += 0.01;
        } else {
          // Laminar flow effects
          p.vy += (canvas.height / 2 - p.y) * 0.0002;
        }
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Handle boundaries - ONLY reset when completely off screen to the right
        // Don't reset particles that are still visible
        if (p.x < 0) {
          p.x = 0;
          p.vx = Math.abs(p.vx);
        }
        
        if (p.y < 0) {
          p.y = 0;
          p.vy = Math.abs(p.vy);
        }
        
        if (p.y > canvas.height) {
          p.y = canvas.height;
          p.vy = -Math.abs(p.vy);
        }
      }
      
      // Draw particle with stronger visibility
      const alpha = 0.9 - 0.7 * (p.age / p.maxAge); // Higher alpha values for better visibility
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
      
      const normalizedSpeed = Math.min(1, speed / 2);
      const hue = isTurbulent ? 
        ((p.hue + normalizedSpeed * 120) % 360) : // More varied hues for turbulent
        (p.hue - normalizedSpeed * 40);            // Blue to purple for laminar
        
      ctx.strokeStyle = `hsla(${hue}, 80%, 50%, ${alpha})`;
      ctx.lineWidth = 1 + speed;
      ctx.stroke();
    }
  };
  
  // Draw streamlines for comparison view
  const drawComparisonStreamlines = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    obstacleX: number,
    obstacleY: number,
    obstacleRadius: number,
    isTurbulent: boolean
  ) => {
    const gridSize = isTurbulent ? 25 : 20;
    
    for (let x = 20; x < width; x += gridSize) {
      for (let y = 20; y < height; y += gridSize) {
        const dx = x - obstacleX;
        const dy = y - obstacleY;
        const distToObstacle = Math.sqrt(dx * dx + dy * dy);
        
        if (distToObstacle < obstacleRadius + 5) continue;
        
        let vx = 1.0;
        let vy = 0;
        
        if (distToObstacle < obstacleRadius * 3) {
          const influence = Math.max(0, 1 - distToObstacle / (obstacleRadius * 3));
          const nx = dx / distToObstacle;
          const ny = dy / distToObstacle;
          
          if (x < obstacleX) {
            vx -= vx * influence * 0.5;
            vy += ny * influence * (dy < 0 ? -1 : 1);
          } else {
            vx = vx * (1 - influence * 0.3);
            vy += ny * influence * 0.5 * (dy < 0 ? -1 : 1);
            
            if (isTurbulent) {
              vx += (Math.random() - 0.5) * influence * 0.4;
              vy += (Math.random() - 0.5) * influence * 0.4;
            }
          }
        }
        
        // Normalize and scale vector
        const mag = Math.sqrt(vx * vx + vy * vy);
        if (mag > 0) {
          const arrowLength = isTurbulent ? 8 : 10;
          vx = vx / mag * arrowLength;
          vy = vy / mag * arrowLength;
        }
        
        // Draw streamline
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx, y + vy);
        
        const alpha = isTurbulent ? 0.15 : 0.2;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  };
  
  // Resize canvases
  const resizeComparisonCanvases = () => {
    if (!laminarRef.current || !turbulentRef.current) return;
    
    const resizeCanvas = (canvas: HTMLCanvasElement) => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    resizeCanvas(laminarRef.current);
    resizeCanvas(turbulentRef.current);
    
    // Initialize particles if they don't exist yet
    if (particlesLaminarRef.current.length === 0) {
      initializeComparisonView();
    }
  };
  
  // Clean up animation
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return {
    initializeComparisonView,
    resizeComparisonCanvases
  };
};
