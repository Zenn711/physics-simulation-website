
import React, { useRef, useEffect } from 'react';
import { 
  Compass, 
  Activity, 
  Atom, 
  Box, 
  Zap,
  ArrowRight,
  Orbit
} from 'lucide-react';
import FeatureCard from './FeatureCard';
import ScrollReveal from './ScrollReveal';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Compass className="feature-icon" />,
      title: "Projectile Motion",
      description: "Explore the fascinating world of projectile motion across different planetary environments and gravity fields.",
      category: "Physics",
      position: 'left' as const,
      color: "from-neon-cyan to-neon-blue"
    },
    {
      icon: <Activity className="feature-icon" />,
      title: "Pendulum Dynamics",
      description: "Visualize the elegant motion of pendulums and understand the principles of harmonic oscillation.",
      category: "Mechanics",
      position: 'right' as const,
      color: "from-neon-blue to-neon-purple" 
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Spring Force",
      description: "Experiment with compression and tension in spring systems while visualizing energy transfer in real-time.",
      category: "Energy",
      position: 'left' as const,
      color: "from-neon-purple to-neon-cyan"
    },
    {
      icon: <Atom className="feature-icon" />,
      title: "Interactive Learning",
      description: "Adjust parameters and see immediate results, making abstract concepts concrete and tangible.",
      category: "Education",
      position: 'right' as const,
      color: "from-neon-cyan to-neon-blue"
    },
    {
      icon: <Orbit className="feature-icon" />,
      title: "Advanced Simulations",
      description: "Coming soon: wave propagation, fluid dynamics, and electromagnetism visualizations.",
      category: "Coming Soon",
      position: 'left' as const,
      color: "from-neon-blue to-neon-purple"
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollPosition = window.scrollY + window.innerHeight * 0.85;
      const cards = sectionRef.current.querySelectorAll('.feature-card');
      
      cards.forEach((card, index) => {
        const cardPosition = card.getBoundingClientRect().top + window.scrollY;
        
        if (scrollPosition > cardPosition) {
          card.classList.add('feature-card-visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="features" ref={sectionRef} className="py-16 md:py-32 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute -inset-10 bg-gradient-to-b from-soft-blue/5 via-soft-gray/5 to-white/5 dark:from-neon-cyan/5 dark:via-neon-blue/5 dark:to-neon-purple/5 blur-3xl -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <div className="text-center mb-16">
            <span className="uppercase text-xs font-medium tracking-widest text-white/70 mb-2 block font-sans">Discover</span>
            <h2 className="mb-4 font-tech">
              <span className="text-white">Explore Our</span>
              <span className="ml-2 text-neon-cyan">Simulations</span>
            </h2>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Our interactive simulations bring physics concepts to life, allowing you to 
              experiment and understand fundamental principles with ease.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="relative">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{animationDelay: `${index * 150}ms`}}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                category={feature.category}
                position={feature.position}
                color={feature.color}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
