
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface OrbitControlsProps {
  isSimulating: boolean;
  showSlingshot: boolean;
}

const OrbitControls: React.FC<OrbitControlsProps> = ({ isSimulating, showSlingshot }) => {
  const [sunMass, setSunMass] = useState(100);
  const [planetMass, setPlanetMass] = useState(10);
  const [initialDistance, setInitialDistance] = useState(150);
  const [initialVelocity, setInitialVelocity] = useState(2);
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Simulation Controls</h3>
      
      <div className="space-y-4">
        {/* Sun Mass Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="sun-mass" className="text-sm font-medium mr-2">
                Star Mass
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjusts the mass of the central star</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm text-muted-foreground">
              {sunMass} units
            </span>
          </div>
          <Slider
            id="sun-mass"
            defaultValue={[100]}
            max={200}
            min={10}
            step={5}
            value={[sunMass]}
            onValueChange={(value) => setSunMass(value[0])}
            disabled={isSimulating}
          />
        </div>
        
        {/* Planet Mass Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="planet-mass" className="text-sm font-medium mr-2">
                Planet Mass
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adjusts the mass of the orbiting planet</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm text-muted-foreground">
              {planetMass} units
            </span>
          </div>
          <Slider
            id="planet-mass"
            defaultValue={[10]}
            max={50}
            min={1}
            step={1}
            value={[planetMass]}
            onValueChange={(value) => setPlanetMass(value[0])}
            disabled={isSimulating}
          />
        </div>
        
        {/* Initial Distance Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="initial-distance" className="text-sm font-medium mr-2">
                Orbital Distance
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sets the initial distance between bodies</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm text-muted-foreground">
              {initialDistance} units
            </span>
          </div>
          <Slider
            id="initial-distance"
            defaultValue={[150]}
            max={250}
            min={50}
            step={5}
            value={[initialDistance]}
            onValueChange={(value) => setInitialDistance(value[0])}
            disabled={isSimulating}
          />
        </div>
        
        {/* Initial Velocity Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="initial-velocity" className="text-sm font-medium mr-2">
                Initial Velocity
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sets the initial velocity of the orbiting body</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm text-muted-foreground">
              {initialVelocity.toFixed(1)} units
            </span>
          </div>
          <Slider
            id="initial-velocity"
            defaultValue={[2]}
            max={5}
            min={0.5}
            step={0.1}
            value={[initialVelocity]}
            onValueChange={(value) => setInitialVelocity(value[0])}
            disabled={isSimulating}
          />
        </div>
        
        {/* Slingshot Configuration - only shown when slingshot is enabled */}
        {showSlingshot && (
          <div className="space-y-2 pt-2 border-t border-gray-800">
            <h4 className="text-sm font-medium">Slingshot Configuration</h4>
            <div className="text-xs text-muted-foreground">
              Adjust planet parameters to create gravity assist maneuvers
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrbitControls;
