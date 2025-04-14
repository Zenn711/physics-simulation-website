
import React from 'react';

interface ProjectileTrajectoryInfoProps {
  maxHeight: number;
  range: number;
  gravity: number;
  airResistance: number;
}

const ProjectileTrajectoryInfo: React.FC<ProjectileTrajectoryInfoProps> = ({
  maxHeight,
  range,
  gravity,
  airResistance
}) => {
  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-md font-medium">Trajectory Info</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md">
          <p className="text-sm font-medium">Max Height</p>
          <p className="text-lg font-bold">{maxHeight.toFixed(2)} m</p>
        </div>
        <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md">
          <p className="text-sm font-medium">Range</p>
          <p className="text-lg font-bold">{range.toFixed(2)} m</p>
        </div>
        <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md">
          <p className="text-sm font-medium">Gravity</p>
          <p className="text-lg font-bold">{gravity} m/s²</p>
        </div>
        <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md">
          <p className="text-sm font-medium">Air Resistance</p>
          <p className="text-lg font-bold">{airResistance}</p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-800 rounded-md">
        <p className="text-sm font-medium mb-1">Optimal angle for max range: 45°</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          (without air resistance)
        </p>
      </div>
    </div>
  );
};

export default ProjectileTrajectoryInfo;
