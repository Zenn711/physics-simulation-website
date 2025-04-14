
import { useRef } from 'react';

interface ComparisonProps {
  laminarRef: React.RefObject<HTMLCanvasElement>;
  turbulentRef: React.RefObject<HTMLCanvasElement>;
}

export const useFluidComparison = ({ laminarRef, turbulentRef }: ComparisonProps) => {
  // Initialize comparison views for side-by-side visualization
  const initializeComparisonView = () => {
    if (!laminarRef.current || !turbulentRef.current) return;
    
    const laminarCtx = laminarRef.current.getContext('2d');
    const turbulentCtx = turbulentRef.current.getContext('2d');
    if (!laminarCtx || !turbulentCtx) return;
    
    // Clear canvases
    laminarCtx.clearRect(0, 0, laminarRef.current.width, laminarRef.current.height);
    turbulentCtx.clearRect(0, 0, turbulentRef.current.width, turbulentRef.current.height);
    
    // Draw static comparison images - simplified version for educational purposes
    drawComparisonView(laminarCtx, 'laminar', laminarRef.current.width, laminarRef.current.height);
    drawComparisonView(turbulentCtx, 'turbulent', turbulentRef.current.width, turbulentRef.current.height);
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

  // Resize comparison canvases
  const resizeComparisonCanvases = () => {
    if (laminarRef.current && turbulentRef.current) {
      const compareContainer = laminarRef.current.parentElement;
      if (compareContainer) {
        const halfWidth = compareContainer.clientWidth / 2 - 10; // With some gap
        
        laminarRef.current.width = halfWidth;
        laminarRef.current.height = compareContainer.clientHeight;
        
        turbulentRef.current.width = halfWidth;
        turbulentRef.current.height = compareContainer.clientHeight;
        
        initializeComparisonView();
      }
    }
  };

  return {
    initializeComparisonView,
    resizeComparisonCanvases
  };
};
