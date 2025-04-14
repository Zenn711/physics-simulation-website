
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Import types
import { SimulationParams, SimulationType, HighlightEffect, TabType } from '../types/fluidSimulation';

// Import components
import { FluidLiveSimulation, LiveSimulationInsight } from './fluid/FluidLiveSimulation';
import FluidControls from './fluid/FluidControls';
import FluidInfoCard from './fluid/FluidInfoCard';
import FluidComparison from './fluid/FluidComparison';
import LearnContent from './fluid/FluidLearnContent';

const FluidDynamicsSimulation = () => {
  // Simulation parameters
  const [params, setParams] = useState<SimulationParams>({
    viscosity: 0.1,       // Fluid viscosity [0.01 - 0.5]
    flowSpeed: 1,         // Flow speed [0.1 - 2]
    particleDensity: 200, // Number of particles [50 - 500]
    obstacleSize: 50,     // Size of obstacle [10 - 100]
  });

  const [simulationType, setSimulationType] = useState<SimulationType>('laminar');
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [highlightEffect, setHighlightEffect] = useState<HighlightEffect>('none');
  
  // Audio reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Method to reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    
    // If audio is playing, pause it
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Toggle simulation running state
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
    
    // Handle audio
    if (soundEnabled) {
      if (!isRunning) {
        if (!audioRef.current) {
          const audio = new Audio('/fluid-sound.mp3');
          audio.loop = true;
          audio.volume = 0.3;
          audioRef.current = audio;
        }
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    }
  };

  // Handle simulation type change
  useEffect(() => {
    resetSimulation();
  }, [simulationType]);

  // Handle sound enabled/disabled
  useEffect(() => {
    if (soundEnabled && isRunning) {
      if (!audioRef.current) {
        const audio = new Audio('/fluid-sound.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        audioRef.current = audio;
      }
      audioRef.current.play().catch(e => console.log("Audio play error:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [soundEnabled]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Parameter change handlers
  const handleParamChange = (paramName: keyof SimulationParams, newValue: number[]) => {
    setParams(prev => ({ ...prev, [paramName]: newValue[0] }));
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="w-full flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Fluid Dynamics Simulator</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowInfoPanel(!showInfoPanel)}>
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle info panel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={simulationType} 
            onValueChange={(val: SimulationType) => setSimulationType(val)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Flow Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laminar">Laminar Flow</SelectItem>
              <SelectItem value="turbulent">Turbulent Flow</SelectItem>
              <SelectItem value="diffusion">Dye Diffusion</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={highlightEffect} 
            onValueChange={(val: HighlightEffect) => setHighlightEffect(val)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Visualization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Standard View</SelectItem>
              <SelectItem value="pressure">Pressure Map</SelectItem>
              <SelectItem value="speed">Speed Map</SelectItem>
              <SelectItem value="vorticity">Vorticity Map</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {showInfoPanel && (
        <Card className="w-full mb-4">
          <CardContent className="pt-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium">What are you seeing?</h3>
              <p>
                {simulationType === 'laminar' && 
                  'Laminar flow shows smooth, ordered fluid movement around the obstacle. Notice the symmetric pattern and steady flow lines.'}
                {simulationType === 'turbulent' && 
                  'Turbulent flow exhibits chaotic patterns behind the obstacle. Watch for vortices forming in the wake region.'}
                {simulationType === 'diffusion' && 
                  'Diffusion demonstrates how dye particles spread through a fluid, regardless of the main flow direction.'}
              </p>
              
              <div className="pt-2">
                <p className="font-medium">Current visualization: {highlightEffect === 'none' ? 'Standard View' : `${highlightEffect.charAt(0).toUpperCase() + highlightEffect.slice(1)} Map`}</p>
                <p>
                  {highlightEffect === 'none' && 'Standard view shows the basic flow pattern around the obstacle.'}
                  {highlightEffect === 'pressure' && 'Pressure map highlights areas of high pressure (red) in front of the obstacle and low pressure (blue) behind it.'}
                  {highlightEffect === 'speed' && 'Speed map shows velocity variations with blue indicating slow flow and red showing fast flow.'}
                  {highlightEffect === 'vorticity' && 'Vorticity map reveals rotational motion in the fluid, with different colors for clockwise and counterclockwise rotation.'}
                </p>
              </div>
              
              <div className="pt-2">
                <p><strong>Try this:</strong> Adjust the viscosity slider and observe how it affects the flow pattern. Higher viscosity produces more laminar flow, while lower viscosity tends toward turbulence.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabType)}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="live">Live Simulation</TabsTrigger>
          <TabsTrigger value="compare">Compare Flow Types</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="live" className="w-full">
          <FluidLiveSimulation 
            isRunning={isRunning}
            onPlayPause={toggleSimulation}
            params={params}
            simulationType={simulationType}
            highlightEffect={highlightEffect}
          />
          
          <LiveSimulationInsight 
            isRunning={isRunning}
            highlightEffect={highlightEffect}
            simulationType={simulationType}
          />
        </TabsContent>
        
        <TabsContent value="compare" className="w-full">
          <FluidComparison />
        </TabsContent>
        
        <TabsContent value="learn">
          <LearnContent />
        </TabsContent>
      </Tabs>
      
      {activeTab === 'live' && (
        <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <FluidControls 
                params={params}
                onParamChange={handleParamChange}
                soundEnabled={soundEnabled}
                onSoundToggle={() => setSoundEnabled(!soundEnabled)}
              />
            </CardContent>
          </Card>
          
          <FluidInfoCard />
        </div>
      )}
      
      {activeTab === 'live' && (
        <div className="flex justify-center space-x-4 mt-6">
          <Button 
            onClick={toggleSimulation} 
            variant="outline"
            size="lg"
            className="space-x-2"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? "Pause" : "Play"}</span>
          </Button>
          
          <Button 
            onClick={resetSimulation} 
            variant="outline"
            size="lg"
            className="space-x-2"
          >
            <RefreshCw size={18} />
            <span>Reset</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FluidDynamicsSimulation;
