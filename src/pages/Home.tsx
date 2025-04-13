
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
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
        
        <FeaturesSection />
        
        <ScrollReveal animation="fade-in" delay={100}>
          <CTASection />
        </ScrollReveal>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
