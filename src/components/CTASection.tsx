
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
    <div ref={sectionRef} className="py-16 md:py-24 relative">
      {/* Background gradient - toned down */}
      <div className="absolute -inset-10 bg-gradient-to-b from-background/5 via-background/10 to-background-dark/5 blur-xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="relative glass-card rounded-xl p-8 md:p-12 overflow-hidden animate-fade-in-up">
          {/* Background elements - more subtle */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center stagger">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground font-tech">
              Ready to Explore the World of Physics?
            </h2>
            
            <p className="text-lg font-body text-foreground/80 mb-8">
              Jump into our interactive simulations and transform the way you learn and understand physics concepts.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/simulation">
                <Button size="lg" className="group hover-scale bg-white/10 hover:bg-white/15 text-foreground font-sans">
                  Start Exploring
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
