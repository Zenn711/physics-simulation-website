
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: 'lift' | 'glow' | 'border' | 'scale' | 'none';
  animateOnMount?: boolean;
  delay?: number;
}

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay * 0.1,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, hoverEffect = 'none', animateOnMount = true, delay = 0, ...props }, ref) => {
    const hoverEffectClass = React.useMemo(() => {
      switch (hoverEffect) {
        case 'lift':
          return 'transition-transform duration-300 hover:-translate-y-2';
        case 'glow':
          return 'transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]';
        case 'border':
          return 'transition-colors duration-300 hover:border-primary';
        case 'scale':
          return 'transition-transform duration-300 hover:scale-[1.02]';
        default:
          return '';
      }
    }, [hoverEffect]);

    if (animateOnMount) {
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          custom={delay}
        >
          <Card 
            className={cn(hoverEffectClass, className)}
            ref={ref}
            {...props}
          >
            {children}
          </Card>
        </motion.div>
      );
    }

    return (
      <Card 
        className={cn(hoverEffectClass, className)}
        ref={ref}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export { AnimatedCard };
