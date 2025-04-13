
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectileSimulation from './ProjectileSimulation';
import PendulumSimulation from './PendulumSimulation';
import SpringSimulation from './SpringSimulation';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import SoundToggle from '@/components/SoundToggle';

const SimulationTabs = ({ defaultTab = 'projectile' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchParams, setSearchParams] = useSearchParams();
  const { soundEnabled, toggleSound } = useSoundEffects();

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="border-b mb-4 flex justify-between items-center">
        <TabsList className="flex justify-start h-auto p-0 bg-transparent border-b">
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
        </TabsList>
        <SoundToggle soundEnabled={soundEnabled} toggleSound={toggleSound} />
      </div>

      <TabsContent value="projectile" className="mt-0">
        <ProjectileSimulation />
      </TabsContent>
      
      <TabsContent value="pendulum" className="mt-0">
        <PendulumSimulation />
      </TabsContent>
      
      <TabsContent value="spring" className="mt-0">
        <SpringSimulation />
      </TabsContent>
    </Tabs>
  );
};

export default SimulationTabs;
