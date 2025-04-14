
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SimulationTabs from '@/components/SimulationTabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const defaultTab = tabParam || 'projectile';
  
  useEffect(() => {
    // Scroll to top when component mounts and enforce dark mode
    window.scrollTo(0, 0);
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-background text-foreground"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Interactive Physics Simulations
          </motion.h1>
          
          <motion.div variants={itemVariants}>
            <SimulationTabs defaultTab={defaultTab} />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Index;
