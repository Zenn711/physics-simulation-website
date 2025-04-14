
import React, { useEffect, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { useFluidComparison } from '../../hooks/useFluidComparison';

const FluidComparison: React.FC = () => {
  const compareLaminarRef = useRef<HTMLCanvasElement>(null);
  const compareTurbulentRef = useRef<HTMLCanvasElement>(null);
  
  const { initializeComparisonView, resizeComparisonCanvases } = useFluidComparison({
    laminarRef: compareLaminarRef,
    turbulentRef: compareTurbulentRef
  });

  useEffect(() => {
    resizeComparisonCanvases();
    
    window.addEventListener('resize', resizeComparisonCanvases);
    return () => {
      window.removeEventListener('resize', resizeComparisonCanvases);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="text-center mb-3">
        <Badge variant="outline" className="font-normal">Side-by-side comparison</Badge>
        <p className="text-sm text-muted-foreground mt-1">Observe the key differences between laminar and turbulent flow patterns</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 h-64 md:h-80">
        <div className="relative flex-1 bg-gradient-to-b from-blue-900/30 to-blue-950/40 dark:from-blue-950/80 dark:to-black/90 rounded-lg shadow-md overflow-hidden">
          <canvas 
            ref={compareLaminarRef} 
            className="w-full h-full"
          />
        </div>
        <div className="relative flex-1 bg-gradient-to-b from-blue-900/30 to-blue-950/40 dark:from-blue-950/80 dark:to-black/90 rounded-lg shadow-md overflow-hidden">
          <canvas 
            ref={compareTurbulentRef}
            className="w-full h-full" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Laminar Flow Characteristics</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Smooth, predictable paths</li>
            <li>Symmetric flow patterns</li>
            <li>Minimal mixing between layers</li>
            <li>Lower Reynolds numbers</li>
            <li>Higher viscosity fluids</li>
          </ul>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Turbulent Flow Characteristics</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Chaotic, irregular motion</li>
            <li>Vortex formation in wake</li>
            <li>Enhanced mixing between layers</li>
            <li>Higher Reynolds numbers</li>
            <li>Lower viscosity fluids</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FluidComparison;
