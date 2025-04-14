
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const OrbitInfoCard = () => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Orbital Physics</h3>
      
      <div className="space-y-4 text-sm">
        <div className="space-y-1">
          <h4 className="font-medium flex items-center">
            Kepler's Laws
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Three laws describing orbital motion discovered by Johannes Kepler</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>
          <p className="text-muted-foreground">
            Planets move in elliptical orbits with the sun at one focus.
          </p>
        </div>
        
        <div className="space-y-1">
          <h4 className="font-medium flex items-center">
            Orbital Terms
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Special points in an orbit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Perihelion: Closest approach to the sun</li>
            <li>Aphelion: Furthest distance from the sun</li>
            <li>Escape Velocity: Speed needed to escape gravity</li>
          </ul>
        </div>
        
        <div className="space-y-1">
          <h4 className="font-medium flex items-center">
            Newton's Law of Gravitation
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>F = G(m₁m₂)/r²</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>
          <p className="text-muted-foreground">
            Gravity is proportional to the product of masses and inversely proportional to distance squared.
          </p>
        </div>
        
        <div className="pt-2 border-t border-gray-800">
          <div className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Try different initial velocities to see how they affect orbital shapes.
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrbitInfoCard;
