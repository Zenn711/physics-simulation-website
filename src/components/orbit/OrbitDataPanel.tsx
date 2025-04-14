
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { OrbitData } from '@/types/orbitSimulation';

interface OrbitDataPanelProps {
  data: OrbitData | null;
}

const OrbitDataPanel: React.FC<OrbitDataPanelProps> = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Simulation Data</h3>
          <p className="text-sm text-muted-foreground">Start the simulation to see real-time data</p>
        </CardContent>
      </Card>
    );
  }

  const { gravitationalForce, orbitalPeriod, currentDistance, currentVelocity } = data;
  
  // Find the planet (assuming the second body is always the planet)
  const planet = data.bodies.find(body => body.name === "Planet");
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Real-time Data</h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Current Distance:</div>
            <div className="text-right">{(currentDistance / 1e9).toFixed(2)} million km</div>
            
            <div className="font-medium">Current Velocity:</div>
            <div className="text-right">{(currentVelocity / 1e3).toFixed(2)} km/s</div>
            
            <div className="font-medium">Gravitational Force:</div>
            <div className="text-right">{gravitationalForce.toExponential(2)} N</div>
            
            <div className="font-medium">Orbital Period:</div>
            <div className="text-right">{(orbitalPeriod / (24*3600)).toFixed(1)} days</div>
          </div>
          
          {planet && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <h4 className="text-sm font-medium mb-2">Planet Position</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>X: {(planet.x / 1e9).toFixed(2)} million km</div>
                <div>Y: {(planet.y / 1e9).toFixed(2)} million km</div>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>* Values updated in real-time</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrbitDataPanel;
