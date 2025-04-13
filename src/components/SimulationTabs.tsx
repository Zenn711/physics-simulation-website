
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendulumSimulation from './PendulumSimulation';
import SpringSimulation from './SpringSimulation';
import WavePropagationSimulation from './WavePropagationSimulation';

// Create a wrapper component since the original is read-only
const ProjectileSimulationWrapper = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/20 mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <circle cx="12" cy="12" r="10"/>
          <path d="m8 12 2 2 4-4"/>
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2">Projectile Motion Simulation</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        This simulation is currently being upgraded with new features.
      </p>
      <div className="w-full max-w-md p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-sm">Check back soon for the improved version with more interactive controls and enhanced visualizations.</p>
      </div>
    </div>
  );
};

const SimulationTabs = ({ defaultTab = 'projectile' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="border-b mb-4">
        <TabsList className="flex w-full justify-start h-auto p-0 bg-transparent border-b">
          <TabsTrigger
            value="projectile"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none"
          >
            Projectile Motion
          </TabsTrigger>
          <TabsTrigger
            value="pendulum"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none"
          >
            Pendulum
          </TabsTrigger>
          <TabsTrigger
            value="spring"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none"
          >
            Spring Force
          </TabsTrigger>
          <TabsTrigger
            value="wave"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none"
          >
            Wave Propagation
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="projectile" className="mt-0">
        <ProjectileSimulationWrapper />
      </TabsContent>
      
      <TabsContent value="pendulum" className="mt-0">
        <PendulumSimulation />
      </TabsContent>
      
      <TabsContent value="spring" className="mt-0">
        <SpringSimulation />
      </TabsContent>
      
      <TabsContent value="wave" className="mt-0">
        <WavePropagationSimulation />
      </TabsContent>
    </Tabs>
  );
};

export default SimulationTabs;
