
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SimulationTabs from '@/components/SimulationTabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const defaultTab = tabParam || 'projectile';
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left text-gradient">
            Interactive Physics Simulations
          </h1>
          
          <SimulationTabs defaultTab={defaultTab} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
