
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <div className="py-16 md:py-24 relative">
      {/* Background gradient and effects */}
      <div className="absolute -inset-10 bg-gradient-to-b from-neon-cyan/10 via-neon-blue/10 to-neon-purple/10 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="relative glass-card rounded-xl p-8 md:p-12 from-neon-purple to-neon-cyan overflow-hidden">
          {/* Background elements */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient animate-fade-in-up">
              Ready to Explore the World of Physics?
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Jump into our interactive simulations and transform the way you learn and understand physics concepts.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Link to="/simulation">
                <Button size="lg" className="group bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-white animate-pulse-glow">
                  Start Exploring
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
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
