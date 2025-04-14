
import React, { useRef, useEffect } from 'react';
import { Play, Pause, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFluidSimulation } from '../../hooks/useFluidSimulation';
import { SimulationParams, SimulationType, HighlightEffect } from '../../types/fluidSimulation';

interface FluidLiveSimulationProps {
  isRunning: boolean;
  onPlayPause: () => void;
  params: SimulationParams;
  simulationType: SimulationType;
  highlightEffect: HighlightEffect;
}

const FluidLiveSimulation: React.FC<FluidLiveSimulationProps> = ({
  isRunning,
  onPlayPause,
  params,
  simulationType,
  highlightEffect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { 
    initializeParticles,
    resetSimulation,
    resizeCanvas,
    animate,
    animationRef
  } = useFluidSimulation(canvasRef, params, simulationType, isRunning, highlightEffect);

  // Initialize canvas when component mounts
  useEffect(() => {
    if (!canvasRef.current) return;
    
    resizeCanvas();
    initializeParticles();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Start/stop animation when isRunning changes
  useEffect(() => {
    if (isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [isRunning]);
  
  // Update when parameters change
  useEffect(() => {
    // If changing particle density, need to reinitialize
    if (params.particleDensity) {
      initializeParticles();
    }
  }, [params]);

  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg shadow-lg overflow-hidden bg-gradient-to-b from-blue-900/30 to-blue-950/40 dark:from-blue-950/80 dark:to-black/90">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {/* Informative overlay */}
      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
          <div className="text-center p-4 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-2">
              {simulationType === 'laminar' && 'Laminar Flow'}
              {simulationType === 'turbulent' && 'Turbulent Flow'}
              {simulationType === 'diffusion' && 'Dye Diffusion'}
            </h3>
            <p className="text-sm text-white/80 max-w-md">
              {simulationType === 'laminar' && 'Smooth, orderly flow with fluid moving in parallel layers.'}
              {simulationType === 'turbulent' && 'Chaotic flow with irregular fluctuations and eddies.'}
              {simulationType === 'diffusion' && 'Observe how dye particles spread through a fluid over time.'}
            </p>
            <Button 
              onClick={onPlayPause}
              variant="outline"
              className="mt-4 bg-white/20 hover:bg-white/30 border-white/40 text-white"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Simulation
            </Button>
          </div>
        </div>
      )}
      
      {/* Parameter explanations when using different highlight modes */}
      {isRunning && highlightEffect !== 'none' && (
        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs p-2 rounded">
          {highlightEffect === 'pressure' && 
            <p>Blue = Low Pressure, Red = High Pressure</p>}
          {highlightEffect === 'speed' && 
            <p>Blue = Slow Flow, Red = Fast Flow</p>}
          {highlightEffect === 'vorticity' && 
            <p>Green = Clockwise, Purple = Counterclockwise</p>}
        </div>
      )}
    </div>
  );
};

const LiveSimulationInsight: React.FC<{
  isRunning: boolean;
  highlightEffect: HighlightEffect;
  simulationType: SimulationType;
}> = ({ isRunning, highlightEffect, simulationType }) => {
  if (!isRunning) return null;
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-3">
      <div className="flex items-start">
        <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm">
          {highlightEffect === 'none' && simulationType === 'laminar' && 
            'Notice how the streamlines bend smoothly around the obstacle, maintaining their ordered pattern.'}
          {highlightEffect === 'none' && simulationType === 'turbulent' && 
            'Observe the irregular eddies forming behind the obstacle, creating a turbulent wake region.'}
          {highlightEffect === 'none' && simulationType === 'diffusion' && 
            'Watch how the dye particles disperse over time, slowly spreading throughout the fluid domain.'}
          {highlightEffect === 'pressure' && 
            'Pressure is highest at the front of the obstacle (stagnation point) where flow velocity approaches zero.'}
          {highlightEffect === 'speed' && 
            'Flow speed increases as fluid moves around the sides of the obstacle, then slows in the wake region.'}
          {highlightEffect === 'vorticity' && 
            'Vortices form in the wake region as flow separates from the obstacle, creating areas of rotation.'}
        </p>
      </div>
    </div>
  );
};

export { FluidLiveSimulation, LiveSimulationInsight };
