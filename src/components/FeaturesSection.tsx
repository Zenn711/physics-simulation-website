
import React, { useEffect, useRef } from 'react';
import { Compass, Activity, Atom, Box, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const features = [
    {
      icon: <Compass className="w-10 h-10" />,
      title: "Projectile Motion",
      description: "Explore the fascinating world of projectile motion across different planetary environments and gravity fields.",
      delay: 100
    },
    {
      icon: <Activity className="w-10 h-10" />,
      title: "Pendulum Dynamics",
      description: "Visualize the elegant motion of pendulums and understand the principles of harmonic oscillation.",
      delay: 200
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Spring Force",
      description: "Experiment with compression and tension in spring systems while visualizing energy transfer in real-time.",
      delay: 300
    },
    {
      icon: <Atom className="w-10 h-10" />,
      title: "Interactive Learning",
      description: "Adjust parameters and see immediate results, making abstract concepts concrete and tangible.",
      delay: 400
    },
    {
      icon: <Box className="w-10 h-10" />,
      title: "Advanced Simulations",
      description: "Coming soon: wave propagation, fluid dynamics, and electromagnetism visualizations.",
      delay: 500
    }
  ];

  return (
    <div ref={sectionRef} id="features" className="py-16 md:py-24 relative">
      {/* Background gradient effect */}
      <div className="absolute -inset-10 bg-gradient-to-b from-soft-blue/5 via-soft-gray/5 to-white/5 dark:from-neon-cyan/5 dark:via-neon-blue/5 dark:to-neon-purple/5 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center animate-fade-in">
          <span className="text-text-primary dark:text-white">Explore Our Simulations</span>
        </h2>
        
        <p className="text-lg text-text-secondary dark:text-gray-300 text-center max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Our interactive simulations bring physics concepts to life, allowing you to 
          experiment and understand fundamental principles with ease.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
              className={index % 2 === 0 ? "from-neon-blue to-neon-cyan" : "from-neon-blue to-neon-cyan"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
