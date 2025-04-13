
import React, { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Home = () => {
  const { theme } = useTheme();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Particle background for dark mode only */}
      {theme === 'dark' && (
        <div className="particle-container fixed inset-0 pointer-events-none overflow-hidden opacity-40">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="particle absolute rounded-full bg-white/20"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse-opacity ${Math.random() * 3 + 2}s ease-in-out infinite, float ${Math.random() * 15 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      )}
      
      <Header />
      
      <main className="flex-1 pt-20">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
