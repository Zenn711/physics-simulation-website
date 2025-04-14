
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useProjectileSimulation } from '@/hooks/useProjectileSimulation';
import ProjectileCanvas from '@/components/projectile/ProjectileCanvas';
import ProjectileControls from '@/components/projectile/ProjectileControls';
import ProjectileParameters from '@/components/projectile/ProjectileParameters';
import ProjectileTrajectoryInfo from '@/components/projectile/ProjectileTrajectoryInfo';

function ProjectileSimulation() {
  const {
    params,
    isRunning,
    position,
    time,
    trajectory,
    environment,
    showTrail,
    autoScale,
    environments,
    angleRad,
    maxHeight,
    range,
    scale,
    width,
    height,
    setEnvironment,
    setShowTrail,
    setAutoScale,
    resetSimulation,
    toggleSimulation,
    handleAngleChange,
    handleVelocityChange,
    handleLaunch
  } = useProjectileSimulation();
    
  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="text-xl font-bold mb-4">Projectile Motion Simulator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="md:col-span-2">
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardContent className="p-4">
              {/* Simulation Canvas */}
              <div className={`w-full h-[300px] relative rounded-lg overflow-hidden ${environments[environment].background}`}>
                <ProjectileCanvas 
                  width={width}
                  height={height}
                  environment={environment}
                  position={position}
                  trajectory={trajectory}
                  showTrail={showTrail}
                  time={time}
                  angleRad={angleRad}
                  scale={scale}
                />
              </div>
              
              <ProjectileControls
                isRunning={isRunning}
                toggleSimulation={toggleSimulation}
                resetSimulation={resetSimulation}
                showTrail={showTrail}
                setShowTrail={setShowTrail}
                autoScale={autoScale}
                setAutoScale={setAutoScale}
                environment={environment}
                setEnvironment={setEnvironment}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Launch Parameters</h3>
              
              <ProjectileParameters
                angle={params.angle}
                velocity={params.velocity}
                handleAngleChange={handleAngleChange}
                handleVelocityChange={handleVelocityChange}
                handleLaunch={handleLaunch}
              />
              
              <ProjectileTrajectoryInfo
                maxHeight={maxHeight}
                range={range}
                gravity={environments[environment].gravity}
                airResistance={environments[environment].airResistance}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProjectileSimulation;
