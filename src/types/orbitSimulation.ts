
export interface OrbitParams {
  mass: number;
  distance: number;
  velocity: number;
}

export interface CelestialBody {
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
