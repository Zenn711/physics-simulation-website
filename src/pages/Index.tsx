
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import SimulationTabs from '@/components/SimulationTabs';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Set the correct tab based on URL parameter
  useEffect(() => {
    if (tabParam) {
      const validTabs = ['projectile', 'pendulum', 'spring'];
      if (validTabs.includes(tabParam)) {
        // The tab will be set in SimulationTabs component
      }
    }
  }, [tabParam]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="p-6 shadow-md dark:bg-gray-800/80 dark:border-gray-700/50">
          <h2 className="text-2xl font-bold mb-4">Physics Playground</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Explore and learn physics concepts through interactive simulations. Change parameters and see how they affect the physical system in real-time.
          </p>
          
          <div className="mt-8">
            <SimulationTabs defaultTab={tabParam || 'projectile'} />
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
