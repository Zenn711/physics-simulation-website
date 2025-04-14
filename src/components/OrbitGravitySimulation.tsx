
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Info, 
  FastForward, 
  Globe,
  Sparkles,
  PenTool
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import OrbitControls from './orbit/OrbitControls';
import OrbitInfoCard from './orbit/OrbitInfoCard';
import OrbitVisualization from './orbit/OrbitVisualization';
import OrbitLearnContent from './orbit/OrbitLearnContent';
import OrbitDataPanel from './orbit/OrbitDataPanel';
import { OrbitParams, OrbitData } from '@/types/orbitSimulation';

const OrbitGravitySimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [showTrails, setShowTrails] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showSlingshot, setShowSlingshot] = useState(false);
  const [activeView, setActiveView] = useState<'simulation' | 'learn'>('simulation');
  const [orbitParams, setOrbitParams] = useState<OrbitParams>({
    mass: 1.0,
    distance: 1.0,
    velocity: 1.0
  });
  const [orbitData, setOrbitData] = useState<OrbitData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Handle play/pause
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  // Reset simulation
  const resetSimulation = () => {
    setIsSimulating(false);
    setOrbitData(null);
    // Reset happens in OrbitVisualization when parameters change
  };

  // Update time speed
  const handleTimeSpeedChange = (value: number[]) => {
    setTimeSpeed(value[0]);
  };

  // Update orbit parameters
  const handleUpdateParams = (params: OrbitParams) => {
    setOrbitParams(params);
  };

  // Handle orbit data updates
  const handleDataUpdate = (data: OrbitData) => {
    setOrbitData(data);
  };

  // Handle slingshot toggle
  const handleToggleSlingshot = () => {
    if (!isSimulating) {
      setShowSlingshot(!showSlingshot);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Simulation Area */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Orbit & Gravity Simulation</h3>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('simulation')}
                  className={activeView === 'simulation' ? 'bg-secondary' : ''}
                >
                  <Globe className="mr-1 h-4 w-4" />
                  Simulation
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveView('learn')}
                  className={activeView === 'learn' ? 'bg-secondary' : ''}
                >
                  <Info className="mr-1 h-4 w-4" />
                  Learn
                </Button>
              </div>
            </div>
            
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
                    orbitParams={orbitParams}
                    onDataUpdate={handleDataUpdate}
                  />
                </div>
                
                {/* Controls */}
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
                          onClick={handleToggleSlingshot}
                          disabled={isSimulating}
                          className={showSlingshot ? 'bg-secondary/50' : ''}
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          Slingshot
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isSimulating ? 'Pause to enable slingshot' : 'Enable gravitational slingshot effect'}</p>
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
                onUpdateParams={handleUpdateParams}
              />
              <OrbitDataPanel data={orbitData} />
              <OrbitInfoCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrbitGravitySimulation;
