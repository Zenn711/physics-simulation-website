
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  Play,
  Pause,
  RefreshCw,
  FastForward,
  PenTool,
  Sparkles
} from 'lucide-react';

interface SimulationControlsProps {
  isSimulating: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  showTrails: boolean;
  setShowTrails: (show: boolean) => void;
  showVectors: boolean;
  setShowVectors: (show: boolean) => void;
  showSlingshot: boolean;
  setShowSlingshot: (show: boolean) => void;
  timeSpeed: number;
  handleTimeSpeedChange: (value: number[]) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isSimulating,
  toggleSimulation,
  resetSimulation,
  showTrails,
  setShowTrails,
  showVectors,
  setShowVectors,
  showSlingshot,
  setShowSlingshot,
  timeSpeed,
  handleTimeSpeedChange
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={toggleSimulation}
      >
        {isSimulating ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
        {isSimulating ? 'Pause' : 'Play'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={resetSimulation}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Reset
      </Button>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTrails(!showTrails)}
              className={showTrails ? 'bg-secondary/50' : ''}
            >
              <PenTool className="h-4 w-4 mr-1" />
              Trails
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show orbital trails</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowVectors(!showVectors)}
              className={showVectors ? 'bg-secondary/50' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              Vectors
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show force vectors</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSlingshot(!showSlingshot)}
              className={showSlingshot ? 'bg-secondary/50' : ''}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Slingshot
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enable gravitational slingshot effect</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="flex items-center space-x-2 ml-auto">
        <FastForward className="h-4 w-4 text-muted-foreground" />
        <div className="w-24">
          <Slider
            defaultValue={[1]}
            max={5}
            min={0.1}
            step={0.1}
            value={[timeSpeed]}
            onValueChange={handleTimeSpeedChange}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {timeSpeed.toFixed(1)}x
        </span>
      </div>
    </div>
  );
};

export default SimulationControls;
