
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectileSimulation from './ProjectileSimulation';
import PendulumSimulation from './PendulumSimulation';
import SpringSimulation from './SpringSimulation';

const SimulationTabs = () => {
  return (
    <Tabs defaultValue="projectile" className="w-full">
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
        </TabsList>
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
