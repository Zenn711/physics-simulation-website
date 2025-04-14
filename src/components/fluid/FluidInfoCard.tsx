
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const FluidInfoCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Reynolds Number Explained</h3>
          <p className="text-sm text-muted-foreground">
            The Reynolds number (Re) is a dimensionless quantity that predicts flow patterns. It's calculated as:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 my-2 text-center font-mono">
            Re = (ρ × v × L) / μ
          </div>
          <p className="text-sm text-muted-foreground">
            Where ρ is fluid density, v is flow velocity, L is characteristic length, and μ is fluid viscosity.
          </p>
          <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
            <li><strong>Re &lt; 2300</strong>: Laminar flow (smooth, orderly)</li>
            <li><strong>2300 &lt; Re &lt; 4000</strong>: Transitional flow</li>
            <li><strong>Re &gt; 4000</strong>: Turbulent flow (chaotic, with eddies)</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Flow Visualization Methods</h3>
          <p className="text-sm text-muted-foreground mb-2">
            This simulation uses several methods to help you understand fluid behavior:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
              <h4 className="text-sm font-medium">Streamlines</h4>
              <p className="text-xs text-muted-foreground">
                Show the path that fluid particles would follow at any moment in time.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
              <h4 className="text-sm font-medium">Pressure Map</h4>
              <p className="text-xs text-muted-foreground">
                Red and blue regions indicate high and low pressure areas, respectively.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
              <h4 className="text-sm font-medium">Speed Map</h4>
              <p className="text-xs text-muted-foreground">
                Shows velocity magnitude, with blue for slow and red for fast flow.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
              <h4 className="text-sm font-medium">Vorticity Map</h4>
              <p className="text-xs text-muted-foreground">
                Visualizes rotational motion in the fluid.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FluidInfoCard;
