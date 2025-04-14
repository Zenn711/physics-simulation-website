
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import OrbitControls from './orbit/OrbitControls';
import OrbitInfoCard from './orbit/OrbitInfoCard';
import OrbitVisualization from './orbit/OrbitVisualization';
import OrbitLearnContent from './orbit/OrbitLearnContent';
import SimulationControls from './orbit/SimulationControls';
import ViewSwitcher from './orbit/ViewSwitcher';

const OrbitGravitySimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [showTrails, setShowTrails] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showSlingshot, setShowSlingshot] = useState(false);
  const [activeView, setActiveView] = useState<'simulation' | 'learn'>('simulation');
  
  // Handle play/pause
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  // Reset simulation
  const resetSimulation = () => {
    setIsSimulating(false);
    // Reset logic will be implemented in OrbitVisualization
  };

  // Update time speed
  const handleTimeSpeedChange = (value: number[]) => {
    setTimeSpeed(value[0]);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Simulation Area */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-4">
            <ViewSwitcher 
              activeView={activeView}
              setActiveView={setActiveView}
            />
            
            {activeView === 'simulation' ? (
              <>
                {/* Canvas container with fixed aspect ratio */}
                <div className="relative w-full h-[400px] bg-black rounded-md overflow-hidden physics-canvas border border-white/10">
                  <OrbitVisualization 
                    isSimulating={isSimulating}
                    timeSpeed={timeSpeed}
                    showTrails={showTrails}
                    showVectors={showVectors}
                    showSlingshot={showSlingshot}
                  />
                </div>
                
                {/* Controls */}
                <SimulationControls
                  isSimulating={isSimulating}
                  toggleSimulation={toggleSimulation}
                  resetSimulation={resetSimulation}
                  showTrails={showTrails}
                  setShowTrails={setShowTrails}
                  showVectors={showVectors}
                  setShowVectors={setShowVectors}
                  showSlingshot={showSlingshot}
                  setShowSlingshot={setShowSlingshot}
                  timeSpeed={timeSpeed}
                  handleTimeSpeedChange={handleTimeSpeedChange}
                />
              </>
            ) : (
              <OrbitLearnContent />
            )}
          </Card>
        </div>
        
        {/* Controls & Info Panel */}
        <div className="md:col-span-1 space-y-4">
          {activeView === 'simulation' && (
            <>
              <OrbitControls
                isSimulating={isSimulating}
                showSlingshot={showSlingshot}
              />
              <OrbitInfoCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrbitGravitySimulation;
