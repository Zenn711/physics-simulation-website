
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { OrbitParams } from '@/types/orbitSimulation';

interface OrbitControlsProps {
  isSimulating: boolean;
  showSlingshot: boolean;
  onUpdateParams: (params: OrbitParams) => void;
}

const OrbitControls: React.FC<OrbitControlsProps> = ({ 
  isSimulating,
  showSlingshot,
  onUpdateParams
}) => {
  // Planet parameters
  const [planetMass, setPlanetMass] = useState(1.0); // Earth mass ratio
  const [orbitRadius, setOrbitRadius] = useState(1.0); // 1 AU
  const [orbitSpeed, setOrbitSpeed] = useState(1.0); // Earth speed ratio
  
  // Update parent component when parameters change
  useEffect(() => {
    onUpdateParams({
      mass: planetMass,
      distance: orbitRadius,
      velocity: orbitSpeed
    });
  }, [planetMass, orbitRadius, orbitSpeed, onUpdateParams]);

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Orbital Parameters</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Planet Mass (Earth = 1)</Label>
              <span className="text-sm">{planetMass.toFixed(2)}</span>
            </div>
            <Slider
              disabled={isSimulating}
              value={[planetMass]}
              min={0.1}
              max={10}
              step={0.1}
              onValueChange={(value) => setPlanetMass(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Orbit Distance (AU)</Label>
              <span className="text-sm">{orbitRadius.toFixed(2)}</span>
            </div>
            <Slider
              disabled={isSimulating}
              value={[orbitRadius]}
              min={0.3}
              max={5}
              step={0.1}
              onValueChange={(value) => setOrbitRadius(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Orbit Speed (Earth = 1)</Label>
              <span className="text-sm">{orbitSpeed.toFixed(2)}</span>
            </div>
            <Slider
              disabled={isSimulating}
              value={[orbitSpeed]}
              min={0.1}
              max={3}
              step={0.1}
              onValueChange={(value) => setOrbitSpeed(value[0])}
            />
          </div>
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <h4 className="text-sm font-medium mb-3">Advanced Options</h4>
            
            <div className="flex items-center space-x-2 py-2">
              <Switch id="slingshot" checked={showSlingshot} disabled />
              <Label htmlFor="slingshot" className={isSimulating ? "text-gray-500" : ""}>
                Gravitational Slingshot
              </Label>
            </div>
            
            {showSlingshot && (
              <p className="text-xs text-muted-foreground mt-1">
                Reset simulation to change this option
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrbitControls;
