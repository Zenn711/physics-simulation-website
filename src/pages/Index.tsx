
import React from 'react';
import Header from '@/components/Header';
import SimulationTabs from '@/components/SimulationTabs';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Welcome to Physics Playground</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Explore and learn physics concepts through interactive simulations. Change parameters and see how they affect the physical system in real-time.
          </p>
          
          <div className="mt-8">
            <SimulationTabs />
          </div>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Created for educational purposes. All simulations include simplified physics models.</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
