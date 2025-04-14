
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

export interface OrbitData {
  gravitationalForce: number;
  orbitalPeriod: number;
  currentDistance: number;
  currentVelocity: number;
  bodies: CelestialBody[];
}
