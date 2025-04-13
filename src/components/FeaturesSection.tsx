
import React from 'react';
import { Compass, Activity, Atom, Box, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';
import ScrollReveal from './ScrollReveal';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Compass className="w-12 h-12" />,
      title: "Projectile Motion",
      description: "Explore the fascinating world of projectile motion across different planetary environments and gravity fields.",
      category: "Physics",
      position: 'left' as const
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: "Pendulum Dynamics",
      description: "Visualize the elegant motion of pendulums and understand the principles of harmonic oscillation.",
      category: "Mechanics",
      position: 'right' as const
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Spring Force",
      description: "Experiment with compression and tension in spring systems while visualizing energy transfer in real-time.",
      category: "Energy",
      position: 'left' as const
    },
    {
      icon: <Atom className="w-12 h-12" />,
      title: "Interactive Learning",
      description: "Adjust parameters and see immediate results, making abstract concepts concrete and tangible.",
      category: "Education",
      position: 'right' as const
    },
    {
      icon: <Box className="w-12 h-12" />,
      title: "Advanced Simulations",
      description: "Coming soon: wave propagation, fluid dynamics, and electromagnetism visualizations.",
      category: "Coming Soon",
      position: 'left' as const
    }
  ];

  return (
    <div id="features" className="py-16 md:py-32 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute -inset-10 bg-gradient-to-b from-soft-blue/5 via-soft-gray/5 to-white/5 dark:from-neon-cyan/5 dark:via-neon-blue/5 dark:to-neon-purple/5 blur-3xl -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-text-primary dark:text-white">Explore Our</span>
            <span className="ml-2 bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">Simulations</span>
          </h2>
          
          <p className="text-lg text-text-secondary dark:text-gray-300 text-center max-w-2xl mx-auto mb-16">
            Our interactive simulations bring physics concepts to life, allowing you to 
            experiment and understand fundamental principles with ease.
          </p>
        </ScrollReveal>
        
        <div className="md:w-11/12 lg:w-10/12 mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal 
              key={index} 
              animation={feature.position === 'left' ? 'slide-in' : 'fade-in'} 
              delay={index * 100}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                category={feature.category}
                position={feature.position}
                className={`md:w-${feature.position === 'left' ? '9/12' : '9/12'}`}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
