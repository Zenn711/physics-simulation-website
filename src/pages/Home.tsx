
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import BenefitsSection from '../components/BenefitsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import SimulationPreviewSection from '../components/SimulationPreviewSection';
import CTASection from '../components/CTASection';
import ScrollReveal from '../components/ScrollReveal';

const Home = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Add dark class to html element for dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <HowItWorksSection />
        
        <FeaturesSection />
        
        <BenefitsSection />
        
        <SimulationPreviewSection />
        
        <TestimonialsSection />
        
        <ScrollReveal animation="fade-in" delay={100}>
          <CTASection />
        </ScrollReveal>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
