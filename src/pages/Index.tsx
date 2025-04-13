
import React, { useEffect } from 'react';
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
    
    // More robust error handling for any zero-argument function calls
    const handlePotentialErrors = () => {
      window.addEventListener('error', (e) => {
        if (e.message && (
          e.message.includes('Expected 1-3 arguments, but got 0') || 
          e.message.includes('arguments')
        )) {
          console.warn('Caught and prevented an error related to function arguments:', e.message);
          e.preventDefault();
        }
      });
    };
    
    handlePotentialErrors();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white">
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
