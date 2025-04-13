
import React, { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-in' | 'slide-in' | 'scale-in';
  delay?: number;
  threshold?: number;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  animation = 'fade-in', 
  delay = 0,
  threshold = 0.1,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animated');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const element = elementRef.current;
    
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [delay, threshold]);

  return (
    <div 
      ref={elementRef} 
      className={`opacity-0 ${className}`}
      style={{
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        transform: animation === 'fade-in' ? 'translateY(20px)' : 
                  animation === 'slide-in' ? 'translateX(-20px)' : 
                  animation === 'scale-in' ? 'scale(0.95)' : 'none'
      }}
      data-animation={animation}
    >
      <style>
        {`
        .animated {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) scale(1) !important;
        }
        `}
      </style>
      {children}
    </div>
  );
};

export default ScrollReveal;
