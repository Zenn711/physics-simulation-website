
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Atom, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const layer1 = containerRef.current.querySelector('.layer-1');
      const layer2 = containerRef.current.querySelector('.layer-2');
      const layer3 = containerRef.current.querySelector('.layer-3');
      
      if (layer1) layer1.setAttribute('style', `transform: translate3d(${x * -15}px, ${y * -15}px, 50px)`);
      if (layer2) layer2.setAttribute('style', `transform: translate3d(${x * -30}px, ${y * -30}px, 100px)`);
      if (layer3) layer3.setAttribute('style', `transform: translate3d(${x * -45}px, ${y * -45}px, 150px)`);
    };
    
    // Create floating particles
    if (particlesRef.current) {
      const createParticle = () => {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position, size and color
        const size = Math.random() * 6 + 2;
        const posX = Math.random() * window.innerWidth;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.bottom = '0';
        particle.style.animationDelay = `${delay}s`;
        
        // Random color from our theme
        const colors = ['#06b6d4', '#3b82f6', '#9333ea'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        particlesRef.current?.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          particle.remove();
        }, 8000);
      };
      
      // Create particles periodically
      const particleInterval = setInterval(() => {
        createParticle();
      }, 1000);
      
      // Initial particles
      for (let i = 0; i < 10; i++) {
        setTimeout(createParticle, i * 300);
      }
      
      document.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        clearInterval(particleInterval);
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="parallax relative overflow-hidden">
      {/* Background gradient and effects */}
      <div className="absolute -inset-10 bg-gradient-to-b from-soft-blue/5 via-soft-gray/5 to-white/5 dark:from-neon-blue/5 dark:via-neon-cyan/5 dark:to-neon-purple/5 blur-3xl -z-10"></div>
      
      {/* Floating particles container */}
      <div ref={particlesRef} className="particles"></div>
      
      {/* Animated orbital rings */}
      <div className="absolute -z-10 w-full h-full overflow-hidden">
        <div className="orbital absolute w-[800px] h-[800px] rounded-full border border-neon-blue/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="orbital absolute w-[600px] h-[600px] rounded-full border border-neon-cyan/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '15s' }}></div>
        <div className="orbital absolute w-[400px] h-[400px] rounded-full border border-soft-blue/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '10s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="md:w-1/2 z-10 stagger">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 layer-1 text-text-primary dark:text-white">
            Explore Interactive
            <br />
            <span className="text-neon-blue">Physics Simulations</span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary dark:text-gray-300 mb-8 max-w-md layer-1">
            Discover the fundamentals of physics through immersive, interactive experiences designed for hands-on learning.
          </p>
          
          <div className="flex flex-wrap gap-4 layer-1">
            <Link to="/simulation">
              <Button size="lg" className="group hover-scale bg-gradient-to-r from-neon-blue to-neon-cyan hover:from-neon-cyan hover:to-neon-blue text-white animate-pulse-glow relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={18} />
                </span>
              </Button>
            </Link>
            
            <Link to="/simulation">
              <Button variant="outline" size="lg" className="border-neon-blue dark:border-neon-cyan group hover-scale">
                <Play className="mr-2 transition-transform duration-300 group-hover:scale-110" size={18} />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 relative flex justify-center">
          {/* Main circular orb with glow */}
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 backdrop-blur-md animate-pulse-glow flex items-center justify-center layer-2">
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-cyan/30 blur-md"></div>
            <Atom className="w-24 h-24 text-white animate-float layer-3" />
          </div>
          
          {/* Small orbiting particles */}
          <div className="absolute w-full h-full left-0 top-0">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-3 h-3 rounded-full bg-neon-cyan animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.7
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
