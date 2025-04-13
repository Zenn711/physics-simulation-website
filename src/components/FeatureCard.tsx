
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

const FeatureCard = ({ icon, title, description, delay = 0, className }: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-6 transition-all hover-scale animate-fade-in-up group",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 text-neon-blue dark:text-neon-cyan group-hover:scale-110 transform transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-text-primary dark:text-white">{title}</h3>
      <p className="text-text-secondary dark:text-gray-300">{description}</p>
    </div>
  );
};

export default FeatureCard;
