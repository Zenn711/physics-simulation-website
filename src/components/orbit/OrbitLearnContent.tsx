
import React from 'react';

const OrbitLearnContent = () => {
  return (
    <div className="space-y-6 p-2">
      <section>
        <h3 className="text-xl font-bold mb-3">Understanding Orbital Mechanics</h3>
        <p className="mb-4">
          Orbital mechanics is the application of physics to predict the motion of satellites, 
          spacecraft, planets, and other objects in space. At its core are Newton's laws of 
          motion and his law of universal gravitation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Key Concepts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Gravitational attraction between masses</li>
              <li>Conservation of energy and angular momentum</li>
              <li>Elliptical orbits</li>
              <li>Escape velocity</li>
              <li>Orbital transfers and maneuvers</li>
            </ul>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Orbital Elements</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Semi-major axis:</strong> Half the longest diameter of an elliptical orbit</li>
              <li><strong>Eccentricity:</strong> Measure of how much an orbit deviates from a perfect circle</li>
              <li><strong>Inclination:</strong> Angular distance of the orbital plane from the reference plane</li>
              <li><strong>Period:</strong> Time taken to complete one orbit</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h3 className="text-xl font-bold mb-3">Kepler's Laws of Planetary Motion</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg">First Law: The Law of Orbits</h4>
            <p className="mb-2">
              All planets move in elliptical orbits, with the sun at one focus.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <p className="italic text-sm">
                Unlike circles, which have one center point, ellipses have two foci. 
                For planetary orbits, the sun is located at one focus, while the other focus is empty.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg">Second Law: The Law of Equal Areas</h4>
            <p className="mb-2">
              A line joining a planet and the sun sweeps out equal areas during equal intervals of time.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <p className="italic text-sm">
                This means planets move faster when they are closer to the sun and slower when they are farther away.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg">Third Law: The Law of Periods</h4>
            <p className="mb-2">
              The square of the orbital period is proportional to the cube of the semi-major axis of the orbit.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <p className="italic text-sm">
                Mathematically: P² ∝ a³, where P is the orbital period and a is the semi-major axis.
                This relationship applies to all orbiting bodies throughout the universe.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h3 className="text-xl font-bold mb-3">Gravitational Slingshot Effect</h3>
        <p className="mb-4">
          The gravitational slingshot (or gravity assist) is a technique that uses the relative movement 
          and gravity of a planet to alter the path and speed of a spacecraft. This technique allows spacecraft 
          to gain or lose energy without using propellant.
        </p>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">How It Works</h4>
          <p className="text-sm mb-2">
            As a smaller object approaches a larger one, the larger object's gravity pulls the smaller one toward it, 
            increasing its speed. As the smaller object moves away, it maintains most of this increased velocity.
          </p>
          <p className="text-sm mb-2">
            From the perspective of the larger body, the smaller object simply changes direction. 
            But from an external reference frame, the smaller object has gained energy and speed.
          </p>
          <p className="text-sm">
            This technique has been used by numerous space missions including Voyager, Cassini, and New Horizons 
            to reach distant planets without requiring enormous amounts of fuel.
          </p>
        </div>
      </section>
    </div>
  );
};

export default OrbitLearnContent;
