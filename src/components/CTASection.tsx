
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
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

  return (
    <div ref={sectionRef} className="py-24 md:py-32 relative">
      {/* Refined background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background-dark blur-xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="relative glass-card rounded-xl overflow-hidden animate-fade-in-up">
          {/* Enhanced background elements */}
          <div className="absolute -right-48 -bottom-48 w-96 h-96 bg-neon-purple/3 rounded-full blur-3xl"></div>
          <div className="absolute -left-48 -top-48 w-96 h-96 bg-neon-cyan/3 rounded-full blur-3xl"></div>
          
          {/* Inner shadow effect */}
          <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
          
          {/* Content with subtle border */}
          <div className="p-12 md:p-16 border border-white/5 rounded-xl backdrop-blur-md bg-gradient-to-br from-black/40 to-black/20">
            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground font-tech tracking-tight">
                Ready to Explore the World of Physics?
              </h2>
              
              <p className="text-lg font-body text-foreground/70 mb-8 leading-relaxed">
                Jump into our interactive simulations and transform the way you learn and understand physics concepts.
              </p>
              
              <div className="pt-4">
                <Link to="/simulation">
                  <Button size="lg" className="group hover-scale bg-white/8 hover:bg-white/12 text-foreground border border-white/10 font-sans transition-all duration-500">
                    Start Exploring
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
