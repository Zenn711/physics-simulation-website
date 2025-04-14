
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  className?: string;
  category?: string;
  position?: 'left' | 'center' | 'right';
  color?: string;
  simulationType?: string;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0, 
  className,
  category = "Feature",
  position = 'left',
  color = "from-gray-300 to-white",
  simulationType = "projectile"
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "w-full relative h-full",
        position === 'left' ? 'ml-0 md:mr-auto' : 
        position === 'right' ? 'mr-0 md:ml-auto' : 
        'mx-auto',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card 
        className={cn(
          "feature-card-inner backdrop-blur-lg overflow-hidden transition-all duration-500",
          "border border-white/10 hover:border-white/20",
          "bg-white/5 dark:bg-gray-900/20",
          "w-full h-full", 
          "transform hover:-translate-y-2 hover:shadow-[0_5px_15px_-5px_rgba(255,255,255,0.1)]",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-5 flex flex-row gap-4 items-start relative overflow-hidden h-full">
          {/* Left position icon styling */}
          {(position === 'left' || position === 'center') && (
            <div className="feature-icon-container">
              <div className={`feature-icon-glow bg-gradient-to-r ${color}`}></div>
              <div className="feature-icon-wrapper">
                {icon}
              </div>
            </div>
          )}
          
          <div className={cn(
            "flex-1 z-10",
            position === 'right' ? 'text-right' : 
            position === 'center' ? 'text-center' : 
            'text-left'
          )}>
            <div className={`uppercase text-xs font-medium font-sans tracking-widest mb-1 text-white/70`}>{category}</div>
            <h3 className="text-lg md:text-xl font-heading font-bold mb-2 text-white">{title}</h3>
            <p className="text-sm text-white/70 mb-3 font-body">{description}</p>
            
            <Link 
              to={`/simulation?tab=${simulationType}`} 
              className={cn(
                "inline-flex items-center text-sm font-medium font-sans",
                "text-white/70 hover:text-white",
                "transition-all duration-300 group",
                position === 'right' ? 'flex-row-reverse' : 
                position === 'center' ? 'justify-center' : 
                'flex-row'
              )}
            >
              Learn more 
              <ChevronRight 
                size={16} 
                className={cn(
                  "transition-transform duration-300",
                  position === 'right' ? 'mr-1 group-hover:-translate-x-1' : 
                  position === 'center' ? 'ml-1 group-hover:translate-x-1' : 
                  'ml-1 group-hover:translate-x-1'
                )}
              />
            </Link>
          </div>
          
          {/* Right position icon styling */}
          {position === 'right' && (
            <div className="feature-icon-container">
              <div className={`feature-icon-glow bg-gradient-to-r ${color}`}></div>
              <div className="feature-icon-wrapper">
                {icon}
              </div>
            </div>
          )}
          
          {/* Background accent - more subtle */}
          <div 
            className={`absolute ${
              position === 'left' ? '-left-20' : 
              position === 'right' ? '-right-20' : 
              'left-1/2 -translate-x-1/2'
            } ${isHovered ? 'opacity-10' : 'opacity-5'} -z-10 transition-opacity duration-500 w-64 h-64 rounded-full bg-white blur-xl`}
          ></div>
          
          {/* Line accent - more subtle */}
          <div 
            className={`absolute bottom-0 left-0 h-0.5 bg-white/20 transition-all duration-700 ease-out ${isHovered ? 'w-full' : 'w-12'}`}
          ></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCard;
