
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Droplet, Wind, Grid3X3, MoveHorizontal, HelpCircle } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { SimulationParams } from '../../types/fluidSimulation';

interface ParameterControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number[]) => void;
  tooltip: string;
  icon: React.ReactNode;
}

const ParameterControl = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  tooltip,
  icon
}: ParameterControlProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span>{icon}</span>
        <span>{label}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <span className="font-mono">{value.toFixed(2)}</span>
    </div>
    <Slider
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={onChange}
    />
  </div>
);

interface FluidControlsProps {
  params: SimulationParams;
  onParamChange: (paramName: keyof SimulationParams, value: number[]) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

const FluidControls: React.FC<FluidControlsProps> = ({ 
  params, 
  onParamChange,
  soundEnabled,
  onSoundToggle
}) => {
  return (
    <div className="space-y-4">
      <ParameterControl
        label="Viscosity"
        value={params.viscosity}
        min={0.01}
        max={0.5}
        step={0.01}
        onChange={(value) => onParamChange('viscosity', value)}
        tooltip="Controls fluid thickness. Higher values make the fluid move more slowly and stay laminar."
        icon={<Droplet className="h-4 w-4" />}
      />
      
      <ParameterControl
        label="Flow Speed"
        value={params.flowSpeed}
        min={0.1}
        max={2}
        step={0.1}
        onChange={(value) => onParamChange('flowSpeed', value)}
        tooltip="Controls how fast the fluid flows from left to right. Higher speeds tend to produce turbulence."
        icon={<Wind className="h-4 w-4" />}
      />
      
      <ParameterControl
        label="Particle Density"
        value={params.particleDensity}
        min={50}
        max={500}
        step={10}
        onChange={(value) => onParamChange('particleDensity', value)}
        tooltip="Number of particles used to visualize the flow. More particles give a clearer picture but may slow performance."
        icon={<Grid3X3 className="h-4 w-4" />}
      />
      
      <ParameterControl
        label="Obstacle Size"
        value={params.obstacleSize}
        min={10}
        max={100}
        step={5}
        onChange={(value) => onParamChange('obstacleSize', value)}
        tooltip="Size of the circular obstacle. Larger obstacles create more significant flow disturbances."
        icon={<MoveHorizontal className="h-4 w-4" />}
      />
      
      <div className="flex items-center justify-between mt-2">
        <span>Sound Effects</span>
        <button
          className={`px-3 py-1 text-sm rounded-md ${soundEnabled ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={onSoundToggle}
        >
          {soundEnabled ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
};

export default FluidControls;
