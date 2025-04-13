
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Atom, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  
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
    
    // Create animated stars
    if (starsRef.current) {
      const createStar = () => {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position, size and opacity
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100; // %
        const posY = Math.random() * 100; // %
        const delay = Math.random() * 5;
        const duration = 3 + Math.random() * 7;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.opacity = `${Math.random() * 0.8 + 0.2}`;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;
        
        starsRef.current?.appendChild(star);
      };
      
      // Create initial stars
      for (let i = 0; i < 100; i++) {
        createStar();
      }
      
      document.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="parallax relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated stars background */}
      <div ref={starsRef} className="stars-container absolute inset-0 z-0"></div>
      
      {/* Background gradient effects */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px]"></div>
      
      {/* Animated orbital rings */}
      <div className="absolute -z-10 w-full h-full overflow-hidden">
        <div className="orbital absolute w-[800px] h-[800px] rounded-full border border-neon-blue/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="orbital absolute w-[600px] h-[600px] rounded-full border border-neon-cyan/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '15s' }}></div>
        <div className="orbital absolute w-[400px] h-[400px] rounded-full border border-soft-blue/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '10s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
        <div className="md:w-1/2 z-10">
          <div className="reveal-stagger">
            <span className="uppercase text-xs font-medium tracking-widest text-white/70 mb-2 block">Explore Physics</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 layer-1 text-white leading-tight">
              Interactive
              <br />
              <span className="text-neon-cyan">Physics Simulations</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-md layer-1">
              Discover the fundamentals of physics through immersive, interactive experiences designed for hands-on learning.
            </p>
            
            <div className="flex flex-wrap gap-4 layer-1">
              <Link to="/simulation">
                <Button size="lg" className="group hover-scale bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white relative overflow-hidden glow-button">
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={18} />
                  </span>
                </Button>
              </Link>
              
              <Link to="/simulation">
                <Button variant="outline" size="lg" className="border-white/20 text-white group hover-scale glow-on-hover">
                  <Play className="mr-2 transition-transform duration-300 group-hover:scale-110" size={18} />
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 relative flex justify-center">
          {/* Main circular orb with glow */}
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-neon-blue/10 to-neon-cyan/10 backdrop-blur-md animate-pulse-glow flex items-center justify-center layer-2">
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 blur-md"></div>
            <div className="absolute inset-0 rounded-full border border-white/10"></div>
            <Atom className="w-24 h-24 text-white animate-float layer-3" />
          </div>
          
          {/* Orbiting particles */}
          <div className="absolute w-full h-full left-0 top-0">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-3 h-3 rounded-full bg-neon-cyan animate-orbit-particle"
                style={{
                  '--orbit-delay': `${i * 0.5}s`,
                  '--orbit-duration': `${8 + i}s`,
                  '--orbit-size': `${120 + i * 20}px`
                } as React.CSSProperties}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
