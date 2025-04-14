
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw as RefreshCw } from 'lucide-react';

interface ProjectileControlsProps {
  isRunning: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  showTrail: boolean;
  setShowTrail: (show: boolean) => void;
  autoScale: boolean;
  setAutoScale: (auto: boolean) => void;
  environment: string;
  setEnvironment: (env: string) => void;
}

const ProjectileControls: React.FC<ProjectileControlsProps> = ({
  isRunning,
  toggleSimulation,
  resetSimulation,
  showTrail,
  setShowTrail,
  autoScale,
  setAutoScale,
  environment,
  setEnvironment
}) => {
  return (
    <>
      {/* Control buttons */}
      <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={toggleSimulation} 
            variant="outline"
            className="border-gray-700 hover:bg-gray-700"
          >
            {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isRunning ? 'Pause' : 'Play'}
          </Button>
          
          <Button 
            onClick={resetSimulation}
            variant="outline"
            className="border-gray-700 hover:bg-gray-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowTrail(!showTrail)}
            variant={showTrail ? "secondary" : "outline"}
            className={`border-gray-700 ${showTrail ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
          >
            {showTrail ? 'Hide Trail' : 'Show Trail'}
          </Button>
          
          <Button
            onClick={() => setAutoScale(!autoScale)}
            variant={autoScale ? "secondary" : "outline"}
            className={`border-gray-700 ${autoScale ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
          >
            Auto Scale: {autoScale ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>
      
      {/* Environment selector */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <Button 
          onClick={() => setEnvironment('earth')}
          variant={environment === 'earth' ? "secondary" : "outline"}
          className={`border-gray-700 ${environment === 'earth' ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
        >
          Earth
        </Button>
        <Button 
          onClick={() => setEnvironment('moon')}
          variant={environment === 'moon' ? "secondary" : "outline"}
          className={`border-gray-700 ${environment === 'moon' ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
        >
          Moon
        </Button>
        <Button 
          onClick={() => setEnvironment('mars')}
          variant={environment === 'mars' ? "secondary" : "outline"}
          className={`border-gray-700 ${environment === 'mars' ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
        >
          Mars
        </Button>
      </div>
    </>
  );
};

export default ProjectileControls;
