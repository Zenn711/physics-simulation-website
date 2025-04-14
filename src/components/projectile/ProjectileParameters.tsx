
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ProjectileParametersProps {
  angle: number;
  velocity: number;
  handleAngleChange: (newValue: number[]) => void;
  handleVelocityChange: (newValue: number[]) => void;
  handleLaunch: (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void;
}

const ProjectileParameters: React.FC<ProjectileParametersProps> = ({
  angle,
  velocity,
  handleAngleChange,
  handleVelocityChange,
  handleLaunch
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Launch Angle</span>
          <span>{angle}°</span>
        </div>
        <Slider
          defaultValue={[45]}
          min={0}
          max={90}
          step={1}
          value={[angle]}
          onValueChange={handleAngleChange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Initial Velocity</span>
          <span>{velocity} m/s</span>
        </div>
        <Slider
          defaultValue={[20]}
          min={5}
          max={50}
          step={1}
          value={[velocity]}
          onValueChange={handleVelocityChange}
        />
      </div>
      
      <Button onClick={handleLaunch} className="w-full">
        Launch
      </Button>
    </div>
  );
};

export default ProjectileParameters;
