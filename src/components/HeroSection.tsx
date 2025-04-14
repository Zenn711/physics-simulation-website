
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<SVGSVGElement>(null);
  
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
      
      // Initialize wave paths
      if (waveRef.current) {
        const updateWavePaths = () => {
          const wave1 = waveRef.current?.querySelector('.wave1');
          const wave2 = waveRef.current?.querySelector('.wave2');
          const wave3 = waveRef.current?.querySelector('.wave3');
          
          if (wave1) {
            wave1.setAttribute('d', "M 0 60 C 150 30, 350 30, 500 60 C 650 90, 850 90, 1000 60 L 1000 200 L 0 200 Z");
          }
          if (wave2) {
            wave2.setAttribute('d', "M 0 70 C 150 40, 350 40, 500 70 C 650 100, 850 100, 1000 70 L 1000 200 L 0 200 Z");
          }
          if (wave3) {
            wave3.setAttribute('d', "M 0 80 C 150 50, 350 50, 500 80 C 650 110, 850 110, 1000 80 L 1000 200 L 0 200 Z");
          }
        };
        
        updateWavePaths();
      }
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div ref={containerRef} className="parallax relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Animated stars background */}
      <div ref={starsRef} className="stars-container absolute inset-0 z-0"></div>
      
      {/* Enhanced background elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated particle field */}
        <div className="absolute inset-0 particle-field">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        {/* Orbital rings - more subtle */}
        <div className="absolute w-full h-full overflow-hidden">
          <div className="orbital-enhanced absolute w-[800px] h-[800px] rounded-full border border-neon-blue/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="orbital-enhanced absolute w-[600px] h-[600px] rounded-full border border-neon-purple/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '15s' }}></div>
          <div className="orbital-enhanced absolute w-[400px] h-[400px] rounded-full border border-neon-cyan/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '10s' }}></div>
        </div>

        {/* Refined waveform background */}
        <svg ref={waveRef} className="absolute bottom-0 w-full h-60" preserveAspectRatio="none" viewBox="0 0 1000 200">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.03)" />
              <stop offset="50%" stopColor="rgba(125, 211, 252, 0.05)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.03)" />
            </linearGradient>
          </defs>
          <path className="wave wave1" fill="url(#waveGradient)" />
          <path className="wave wave2" fill="url(#waveGradient)" style={{ opacity: 0.7 }} />
          <path className="wave wave3" fill="url(#waveGradient)" style={{ opacity: 0.4 }} />
        </svg>
      </div>

      {/* Subtle background gradient effects */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-[130px]"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center text-center">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-3">
            <span className="uppercase text-xs font-medium tracking-[0.2em] text-white/70 font-sans inline-block py-1 px-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              Explore Physics
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="font-tech text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight tracking-tight">
            <span className="block bg-gradient-to-r from-white via-white/90 to-neon-cyan/90 bg-clip-text text-transparent pb-2">
              Interactive
            </span>
            <span className="block bg-gradient-to-r from-neon-cyan/90 via-white/90 to-white bg-clip-text text-transparent">
              Physics Simulations
            </span>
            
            {/* Subtle decorative elements */}
            <div className="inline-flex items-center justify-center">
              <span className="absolute w-2 h-2 bg-neon-cyan/50 rounded-full animate-pulse"></span>
              <span className="absolute w-32 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent"></span>
            </div>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-body leading-relaxed"
          >
            Discover the fundamentals of physics through immersive, interactive 
            experiences designed for hands-on learning.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-5 justify-center">
            <Link to="/simulation">
              <Button 
                size="lg" 
                className="group relative overflow-hidden border-0 bg-gradient-to-br from-neon-purple/80 to-neon-cyan/80 hover:from-neon-cyan/80 hover:to-neon-purple/80 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-neon-purple/10"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={18} />
                </span>
                <span className="absolute inset-0 bg-white/5 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>
              </Button>
            </Link>
            
            <Link to="/simulation">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/10 text-white group relative overflow-hidden hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-300"
              >
                <Play className="mr-2 transition-transform duration-300 group-hover:scale-110" size={18} />
                Try Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Floating physics elements - more subtle */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating physics formulas and symbols */}
          <div className="absolute top-[15%] left-[10%] text-white/5 text-xl rotate-12 font-mono">E=mc²</div>
          <div className="absolute top-[25%] right-[15%] text-white/5 text-xl -rotate-6 font-mono">F=ma</div>
          <div className="absolute bottom-[20%] left-[20%] text-white/5 text-xl rotate-3 font-mono">V=IR</div>
          <div className="absolute bottom-[30%] right-[25%] text-white/5 text-xl -rotate-9 font-mono">PV=nRT</div>
          
          {/* Geometric elements */}
          <div className="absolute top-[30%] left-[25%] w-12 h-12 border border-white/3 rounded-full"></div>
          <div className="absolute bottom-[40%] right-[10%] w-16 h-16 border border-white/3 rotate-45 transform"></div>
        </div>
      </div>
      
      {/* Refined scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce opacity-70 hover:opacity-100 transition-opacity">
        <div className="w-8 h-12 rounded-full border-2 border-white/10 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/30 rounded-full animate-scroll-down"></div>
        </div>
        <span className="text-white/40 text-xs mt-2">Scroll Down</span>
      </div>
    </div>
  );
};

export default HeroSection;
