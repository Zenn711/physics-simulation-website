
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, Activity, Zap, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollReveal from './ScrollReveal';

interface SimPreviewProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  animationDelay: number;
  tabValue: string;
}

const SimulationPreview = ({ icon, title, color, animationDelay, tabValue }: SimPreviewProps) => {
  return (
    <Link 
      to={`/simulation?tab=${tabValue}`} 
      className="block h-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: animationDelay * 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden h-full hover:border-white/20 transition-all group"
      >
        <div 
          className={`p-4 flex flex-col items-center justify-center text-center h-full space-y-3 relative`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">{icon}</div>
          </div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br from-white/5 to-white/0 transition-opacity pointer-events-none"></div>
          <p className="text-xs text-white/70">Try it now</p>
        </div>
      </motion.div>
    </Link>
  );
};

const SimulationPreviewSection = () => {
  const simulations = [
    {
      icon: <Compass size={20} />,
      title: "Projectile Motion",
      color: "from-neon-cyan to-neon-blue",
      animationDelay: 1,
      tabValue: "projectile"
    },
    {
      icon: <Activity size={20} />,
      title: "Pendulum Dynamics",
      color: "from-neon-blue to-neon-purple",
      animationDelay: 2,
      tabValue: "pendulum"
    },
    {
      icon: <Zap size={20} />,
      title: "Spring Force",
      color: "from-neon-purple to-neon-cyan",
      animationDelay: 3,
      tabValue: "spring"
    },
    {
      icon: <Waves size={20} />,
      title: "Wave Propagation",
      color: "from-neon-cyan to-neon-blue",
      animationDelay: 4,
      tabValue: "wave"
    }
  ];

  return (
    <section className="py-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-gray-900/50 pointer-events-none"></div>
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <div className="text-center mb-6">
            <span className="uppercase text-xs font-medium tracking-widest text-white/70 mb-2 block font-sans">Jump Right In</span>
            <h2 className="mb-4 font-tech">
              <span className="text-white">Try Our</span>
              <span className="ml-2 text-neon-cyan">Simulations</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Experience interactive physics concepts through our carefully designed simulations
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {simulations.map((sim, index) => (
            <SimulationPreview
              key={index}
              icon={sim.icon}
              title={sim.title}
              color={sim.color}
              animationDelay={sim.animationDelay}
              tabValue={sim.tabValue}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/simulation">
            <Button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white">
              Explore All Simulations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SimulationPreviewSection;
