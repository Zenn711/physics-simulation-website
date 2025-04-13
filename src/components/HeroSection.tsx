
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Atom, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
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
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="parallax relative overflow-hidden">
      {/* Background gradient and effects */}
      <div className="absolute -inset-10 bg-gradient-to-b from-neon-purple/5 via-neon-blue/5 to-neon-cyan/5 blur-3xl -z-10"></div>
      
      {/* Animated orbital rings */}
      <div className="absolute -z-10 w-full h-full overflow-hidden">
        <div className="orbital absolute w-[800px] h-[800px] rounded-full border border-neon-purple/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="orbital absolute w-[600px] h-[600px] rounded-full border border-neon-cyan/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '15s' }}></div>
        <div className="orbital absolute w-[400px] h-[400px] rounded-full border border-neon-blue/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '10s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="md:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 layer-1">
            <span className="text-gradient">Explore Interactive</span>
            <br />
            <span className="text-gradient-reverse">Physics Simulations</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md layer-1">
            Discover the fundamentals of physics through immersive, interactive experiences designed for hands-on learning.
          </p>
          
          <div className="flex flex-wrap gap-4 layer-1">
            <Link to="/simulation">
              <Button size="lg" className="group bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-white">
                Get Started
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Link>
            
            <Link to="/simulation">
              <Button variant="outline" size="lg" className="border-neon-purple dark:border-neon-cyan group">
                <Play className="mr-2 group-hover:scale-110 transition-transform" size={18} />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 relative flex justify-center">
          {/* Main circular orb with glow */}
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 backdrop-blur-md animate-pulse-glow flex items-center justify-center layer-2">
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-purple/40 to-neon-cyan/40 blur-md"></div>
            <Atom className="w-24 h-24 text-white animate-float layer-3" />
          </div>
          
          {/* Small orbiting particles */}
          <div className="absolute w-full h-full left-0 top-0">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-3 h-3 rounded-full bg-neon-purple animate-pulse"
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
