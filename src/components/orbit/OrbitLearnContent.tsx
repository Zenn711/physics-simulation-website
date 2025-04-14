
import React from 'react';
import { ExternalLink } from 'lucide-react';

const OrbitLearnContent = () => {
  return (
    <div className="space-y-6 max-h-[400px] overflow-y-auto p-2">
      <section>
        <h3 className="text-xl font-semibold mb-3 text-primary">Orbital Mechanics & Gravitational Forces</h3>
        <p className="text-muted-foreground">
          Orbital mechanics is the application of physics to predict the motion of spacecraft, planets, and other celestial bodies.
          It's based on Newton's laws of motion and universal gravitation.
        </p>
      </section>
      
      <section>
        <h4 className="text-lg font-medium mb-2">Newton's Law of Universal Gravitation</h4>
        <div className="bg-black/30 p-4 rounded-md border border-white/10 text-center mb-4">
          <p className="text-white font-mono text-lg">F = G × (m₁ × m₂) / r²</p>
        </div>
        <p className="text-muted-foreground">
          This equation states that the gravitational force between two bodies is directly proportional to the product of their masses
          and inversely proportional to the square of the distance between them.
        </p>
        <ul className="list-disc list-inside text-muted-foreground mt-2">
          <li>F = Gravitational force</li>
          <li>G = Gravitational constant</li>
          <li>m₁, m₂ = Masses of the two objects</li>
          <li>r = Distance between the centers of the masses</li>
        </ul>
      </section>
      
      <section>
        <h4 className="text-lg font-medium mb-2">Kepler's Laws of Planetary Motion</h4>
        <ol className="space-y-3 mt-2">
          <li className="p-3 bg-black/20 rounded-md border border-white/5">
            <strong className="text-primary">First Law (Law of Ellipses):</strong>
            <p className="text-muted-foreground mt-1">
              The orbit of each planet is an ellipse with the Sun at one of the two foci.
            </p>
          </li>
          <li className="p-3 bg-black/20 rounded-md border border-white/5">
            <strong className="text-primary">Second Law (Law of Equal Areas):</strong>
            <p className="text-muted-foreground mt-1">
              A line joining a planet and the Sun sweeps out equal areas during equal intervals of time.
            </p>
          </li>
          <li className="p-3 bg-black/20 rounded-md border border-white/5">
            <strong className="text-primary">Third Law (Law of Harmonies):</strong>
            <p className="text-muted-foreground mt-1">
              The square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit.
            </p>
          </li>
        </ol>
      </section>
      
      <section>
        <h4 className="text-lg font-medium mb-2">Key Orbital Concepts</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-black/20 rounded-md border border-white/5">
            <strong className="text-primary">Perihelion & Aphelion:</strong>
            <p className="text-muted-foreground mt-1">
              The points of closest and farthest approach to the Sun in an orbit.
            </p>
          </div>
          <div className="p-3 bg-black/20 rounded-md border border-white/5">
            <strong className="text-primary">Escape Velocity:</strong>
            <p className="text-muted-foreground mt-1">
              The minimum speed needed for an object to escape the gravitational influence of a body.
            </p>
          </div>
          <div className="p-3 bg-black/20 rounded-md border border-white/5">
            <strong className="text-primary">Gravitational Slingshot:</strong>
            <p className="text-muted-foreground mt-1">
              A technique using a planet's gravity to alter a spacecraft's trajectory and speed.
            </p>
          </div>
          <div className="p-3 bg-black/20 rounded-md border border-white/5">
            <strong className="text-primary">Orbital Eccentricity:</strong>
            <p className="text-muted-foreground mt-1">
              A measure of how circular or elliptical an orbit is (0 = circular, 1 = parabolic).
            </p>
          </div>
        </div>
      </section>
      
      <section className="pt-4 border-t border-gray-800">
        <h4 className="text-lg font-medium mb-2">Further Learning</h4>
        <div className="flex flex-col space-y-2">
          <a 
            href="https://en.wikipedia.org/wiki/Orbital_mechanics" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neon-blue hover:text-neon-cyan flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Orbital Mechanics (Wikipedia)
          </a>
          <a 
            href="https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neon-blue hover:text-neon-cyan flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Kepler's Laws of Planetary Motion (Wikipedia)
          </a>
          <a 
            href="https://solarsystem.nasa.gov/basics/primer/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neon-blue hover:text-neon-cyan flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Solar System Basics (NASA)
          </a>
        </div>
      </section>
    </div>
  );
};

export default OrbitLearnContent;
