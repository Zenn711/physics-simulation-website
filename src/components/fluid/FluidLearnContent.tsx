
import React from 'react';

const LearnContent: React.FC = () => (
  <div className="p-4 space-y-6 text-left">
    <div>
      <h3 className="text-lg font-medium mb-2">Key Fluid Dynamics Concepts</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Reynolds Number</strong>: A dimensionless quantity that helps predict flow patterns. 
          Low Reynolds numbers result in laminar flow, while high values lead to turbulent flow.
        </li>
        <li>
          <strong>Bernoulli's Principle</strong>: When the speed of a fluid increases, its pressure decreases.
          This explains why there's high pressure in front of an obstacle and low pressure behind it.
        </li>
        <li>
          <strong>Viscosity</strong>: The "thickness" of a fluid that resists deformation. 
          Higher viscosity fluids (like honey) flow more slowly than lower viscosity fluids (like water).
        </li>
        <li>
          <strong>Vortices</strong>: Spinning regions of fluid that form when flow separates from a surface.
          In turbulent flow, these create the characteristic "vortex street" pattern behind obstacles.
        </li>
      </ul>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-2">Flow Regimes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
          <h4 className="text-md font-medium">Laminar Flow</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Smooth, orderly flow where fluid particles move in parallel layers with minimal mixing.
            Occurs at low Reynolds numbers (low speed, high viscosity).
            Streamlines are smooth and predictable.
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
          <h4 className="text-md font-medium">Turbulent Flow</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Chaotic, irregular flow with significant mixing between layers.
            Occurs at high Reynolds numbers (high speed, low viscosity).
            Forms eddies and vortices, especially in the wake region behind obstacles.
          </p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-2">Visual Elements in the Simulation</h3>
      <div className="space-y-2">
        <div className="flex items-start space-x-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-red-500 mt-1"></div>
          <p className="text-sm">Red areas indicate high pressure, typically in front of the obstacle where fluid "piles up".</p>
        </div>
        <div className="flex items-start space-x-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-blue-500 mt-1"></div>
          <p className="text-sm">Blue areas indicate low pressure, typically behind the obstacle in the wake region.</p>
        </div>
        <div className="flex items-start space-x-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-purple-500 mt-1"></div>
          <p className="text-sm">Purple and green areas in the vorticity view indicate counterclockwise and clockwise rotation.</p>
        </div>
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 flex items-center justify-center border border-white">
            <div className="w-2 h-0.5 bg-white"></div>
          </div>
          <p className="text-sm">Streamlines show the direction fluid would flow at each point, helping visualize the overall pattern.</p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-2">Real-World Examples</h3>
      <div className="space-y-1 text-sm">
        <p>• <strong>Aerodynamics</strong>: Car and airplane designs minimize drag by controlling flow separation.</p>
        <p>• <strong>Weather</strong>: High and low pressure systems create wind patterns in Earth's atmosphere.</p>
        <p>• <strong>Blood Flow</strong>: Blood exhibits both laminar and turbulent flow in different parts of circulatory system.</p>
        <p>• <strong>River Systems</strong>: Obstacles in rivers create complex flow patterns including eddies and vortices.</p>
      </div>
    </div>
    
    <div className="pt-2 border-t">
      <p className="text-sm text-muted-foreground italic">
        Try different highlight modes in the live simulation to see pressure gradients, speed variations, and vorticity patterns around the obstacle.
      </p>
    </div>
  </div>
);

export default LearnContent;
