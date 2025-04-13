
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
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <ScrollReveal animation="fade-in">
          <FeaturesSection />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-in" delay={100}>
          <CTASection />
        </ScrollReveal>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
