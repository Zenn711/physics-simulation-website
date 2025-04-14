
import React from 'react';
import { useProjectileState } from '@/hooks/useProjectileSimulation';

interface ProjectileCanvasProps {
  width: number;
  height: number;
  environment: string;
  position: { x: number; y: number };
  trajectory: Array<{ x: number; y: number }>;
  showTrail: boolean;
  time: number;
  angleRad: number;
  scale: number;
}

const ProjectileCanvas: React.FC<ProjectileCanvasProps> = ({
  width,
  height,
  environment,
  position,
  trajectory,
  showTrail,
  time,
  angleRad,
  scale
}) => {
  // Helper functions
  const toCanvasX = (x: number) => Math.min(width, (x * scale) % (width * 2));
  const toCanvasY = (y: number) => height - (y * scale);

  // Generate terrain features based on environment
  const generateTerrain = () => {
    if (environment === 'earth') {
      return (
        <>
          <rect x={width - 80} y={height - 30} width="80" height="30" fill="#4b7b2a" />
          <rect x={width - 50} y={height - 40} width="30" height="10" fill="#4b7b2a" />
          
          {/* Trees */}
          <path d="M 530,270 L 540,240 L 550,270 Z" fill="#2d4f16" />
          <rect x={538} y={270} width="5" height="10" fill="#3d341b" />
          
          <path d="M 565,270 L 575,230 L 585,270 Z" fill="#2d4f16" />
          <rect x={572} y={270} width="5" height="10" fill="#3d341b" />
        </>
      );
    } else if (environment === 'moon') {
      return (
        <>
          {/* Moon craters */}
          <circle cx={width - 70} cy={height - 10} r="20" fill="#808080" stroke="#707070" />
          <circle cx={width - 100} cy={height - 20} r="15" fill="#808080" stroke="#707070" />
          <circle cx={width - 40} cy={height - 15} r="10" fill="#808080" stroke="#707070" />
        </>
      );
    } else if (environment === 'mars') {
      return (
        <>
          {/* Mars rocks */}
          <path d="M 520,280 L 530,270 L 545,275 L 540,290 L 525,295 Z" fill="#963a2d" />
          <path d="M 560,270 L 580,265 L 590,280 L 575,290 Z" fill="#963a2d" />
          <circle cx={width - 50} cy={height - 10} r="8" fill="#7a3326" />
        </>
      );
    }
    return null;
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      {/* Background grid */}
      <g opacity="0.2" stroke="currentColor">
        {Array.from({ length: 11 }).map((_, i) => (
          <line 
            key={`v-${i}`} 
            x1={i * (width / 10)} 
            y1="0" 
            x2={i * (width / 10)} 
            y2={height} 
            strokeWidth="1" 
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line 
            key={`h-${i}`} 
            x1="0" 
            y1={i * (height / 6)} 
            x2={width} 
            y2={i * (height / 6)} 
            strokeWidth="1" 
          />
        ))}
      </g>
      
      {/* Terrain */}
      {generateTerrain()}
      
      {/* Ground */}
      <rect x="0" y={height - 20} width={width} height="20" fill={
        environment === 'earth' ? "#8b5e3c" : 
        environment === 'moon' ? "#c2c2c2" : 
        "#d17f64"
      } />
      <line x1="0" y1={height - 20} x2={width} y2={height - 20} strokeWidth="2" stroke="#333333" />
      
      {/* Launcher */}
      <rect x="10" y={height - 40} width="15" height="20" fill="#555555" />
      <line 
        x1="18" 
        y1={height - 40} 
        x2={18 + Math.cos(angleRad) * 40}
        y2={height - 40 - Math.sin(angleRad) * 40} 
        strokeWidth="4" 
        stroke="#777777" 
      />
      
      {/* Projectile trajectory */}
      {showTrail && trajectory.length > 1 && (
        <polyline
          points={trajectory.map(p => `${toCanvasX(p.x)},${toCanvasY(p.y)}`).join(' ')}
          fill="none"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="2"
          strokeDasharray="4"
        />
      )}
      
      {/* Projectile */}
      <circle 
        cx={toCanvasX(position.x)} 
        cy={toCanvasY(position.y)} 
        r="8" 
        fill="red" 
        stroke="white" 
        strokeWidth="2" 
      />
      
      {/* Position readouts */}
      <g className="stats-box">
        <rect x="10" y="10" width="160" height="70" rx="5" fill="rgba(0, 0, 0, 0.5)" />
        <text x="20" y="30" fill="white" fontSize="12">Time: {time.toFixed(2)}s</text>
        <text x="20" y="50" fill="white" fontSize="12">Distance: {position.x.toFixed(2)}m</text>
        <text x="20" y="70" fill="white" fontSize="12">Height: {Math.max(0, position.y.toFixed(2))}m</text>
      </g>
    </svg>
  );
};

export default ProjectileCanvas;
