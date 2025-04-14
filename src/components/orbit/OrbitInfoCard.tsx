
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const OrbitInfoCard = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">Orbital Mechanics</h3>
        
        <div className="space-y-4 text-sm">
          <p>
            This simulation demonstrates Newton's law of universal gravitation and Kepler's laws of planetary motion.
          </p>
          
          <div>
            <h4 className="text-md font-medium">Newton's Law of Gravitation:</h4>
            <p className="mt-1 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
              F = G(m₁m₂)/r²
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              The gravitational force between two objects is proportional to their masses and inversely proportional to the square of the distance between them.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-medium">Kepler's Laws:</h4>
            <ol className="list-decimal list-inside space-y-2 mt-1">
              <li>Planets move in elliptical orbits with the sun at one focus</li>
              <li>A line connecting a planet and the sun sweeps out equal areas in equal times</li>
              <li>The square of the orbital period is proportional to the cube of the semi-major axis</li>
            </ol>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-4">
            <h4 className="text-md font-medium">Try This:</h4>
            <ul className="list-disc list-inside space-y-1 mt-1 text-xs">
              <li>Observe how changing the orbit distance affects orbital speed</li>
              <li>Turn on vectors to see gravitational forces and velocity</li>
              <li>Watch how a comet's trajectory changes during a gravitational slingshot</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrbitInfoCard;
