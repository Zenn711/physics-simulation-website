
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  className?: string;
  category?: string;
  position?: 'left' | 'right';
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0, 
  className,
  category = "Feature",
  position = 'left'
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "w-full mb-12 md:mb-20 relative",
        position === 'right' ? 'md:ml-auto' : 'md:mr-auto',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className={cn(
        "glass-card border-none overflow-hidden transition-all duration-500",
        "hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1",
        position === 'right' ? 'md:ml-auto' : 'md:mr-auto',
        "bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/30 dark:to-gray-900/10"
      )}>
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden">
          {/* Left position icon styling */}
          {position === 'left' && (
            <div className="text-neon-blue dark:text-neon-cyan text-4xl md:text-5xl relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 rounded-full"></div>
              <div className="relative z-10 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                {icon}
              </div>
            </div>
          )}
          
          <div className={cn(
            "flex-1",
            position === 'right' ? 'text-right' : 'text-left'
          )}>
            <div className="uppercase text-xs font-medium tracking-wider text-neon-blue dark:text-neon-cyan mb-1 opacity-80">{category}</div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-text-primary dark:text-white">{title}</h3>
            <p className="text-text-secondary dark:text-gray-300">{description}</p>
          </div>
          
          {/* Right position icon styling */}
          {position === 'right' && (
            <div className="text-neon-blue dark:text-neon-cyan text-4xl md:text-5xl relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 rounded-full"></div>
              <div className="relative z-10 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                {icon}
              </div>
            </div>
          )}
          
          {/* Decorative element */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-cyan opacity-30"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCard;
