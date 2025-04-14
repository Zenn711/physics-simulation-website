
export type SimulationType = 'laminar' | 'turbulent' | 'diffusion';
export type HighlightEffect = 'none' | 'pressure' | 'speed' | 'vorticity';
export type TabType = 'live' | 'compare' | 'learn';

export interface SimulationParams {
  viscosity: number;       // Fluid viscosity [0.01 - 0.5]
  flowSpeed: number;         // Flow speed [0.1 - 2]
  particleDensity: number; // Number of particles [50 - 500]
  obstacleSize: number;     // Size of obstacle [10 - 100]
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  hue: number;
  pressure?: number; // Estimated pressure at particle location
  speed?: number;    // Particle speed
}
