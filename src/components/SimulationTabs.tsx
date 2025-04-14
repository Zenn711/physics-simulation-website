
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendulumSimulation from './PendulumSimulation';
import SpringSimulation from './SpringSimulation';
import WavePropagationSimulation from './WavePropagationSimulation';
import ProjectileSimulation from './ProjectileSimulation';
import FluidDynamicsSimulation from './FluidDynamicsSimulation';
import OrbitGravitySimulation from './OrbitGravitySimulation';
import { motion } from 'framer-motion';

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
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
      <div className="border-b mb-4 relative overflow-x-auto pb-0.5">
        <TabsList className="flex w-full justify-start h-auto p-0 bg-transparent border-b scrollbar-thin">
          <TabsTrigger
            value="projectile"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary 
                       data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none
                       transition-all duration-200 hover:text-primary/80"
          >
            Projectile Motion
          </TabsTrigger>
          <TabsTrigger
            value="pendulum"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary 
                       data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none
                       transition-all duration-200 hover:text-primary/80"
          >
            Pendulum
          </TabsTrigger>
          <TabsTrigger
            value="spring"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary 
                       data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none
                       transition-all duration-200 hover:text-primary/80"
          >
            Spring Force
          </TabsTrigger>
          <TabsTrigger
            value="wave"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary 
                       data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none
                       transition-all duration-200 hover:text-primary/80"
          >
            Wave Propagation
          </TabsTrigger>
          <TabsTrigger
            value="fluid"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary 
                       data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none
                       transition-all duration-200 hover:text-primary/80"
          >
            Fluid Dynamics
          </TabsTrigger>
          <TabsTrigger
            value="orbit"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary 
                       data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none
                       transition-all duration-200 hover:text-primary/80"
          >
            Orbit & Gravity
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Add motion wrapper to each TabsContent for animations */}
      <TabsContent value="projectile" className="mt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          key="projectile"
        >
          <ProjectileSimulation />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="pendulum" className="mt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          key="pendulum"
        >
          <PendulumSimulation />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="spring" className="mt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          key="spring"
        >
          <SpringSimulation />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="wave" className="mt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          key="wave"
        >
          <WavePropagationSimulation />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="fluid" className="mt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          key="fluid"
        >
          <FluidDynamicsSimulation />
        </motion.div>
      </TabsContent>
      
      <TabsContent value="orbit" className="mt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          key="orbit"
        >
          <OrbitGravitySimulation />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};

export default SimulationTabs;
