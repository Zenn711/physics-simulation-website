
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Atom, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    document.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-2 backdrop-blur-lg bg-gray-900/80 shadow-md' : 'py-4 bg-transparent'
    }`}>
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Atom className={`h-8 w-8 ${scrolled ? 'text-neon-purple' : 'text-primary'} group-hover:animate-pulse-glow transition-colors`} />
          <h1 className={`text-2xl font-display font-bold tracking-tight ${scrolled ? 'text-gradient' : ''}`}>
            Physics Playground
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/simulation" className="font-sans text-gray-200 hover:text-neon-cyan transition-colors">
            Simulations
          </Link>
          
          <a href="#features" className="font-sans text-gray-200 hover:text-neon-cyan transition-colors">
            Features
          </a>
          
          <Link to="/simulation">
            <Button variant="default" className="font-sans bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-white">
              Get Started
            </Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="text-gray-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-gray-800 py-4">
          <div className="container px-4 mx-auto space-y-3">
            <Link 
              to="/simulation" 
              className="font-sans block py-2 text-gray-200 hover:text-neon-cyan"
              onClick={() => setMobileMenuOpen(false)}
            >
              Simulations
            </Link>
            
            <a 
              href="#features" 
              className="font-sans block py-2 text-gray-200 hover:text-neon-cyan"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            
            <Link 
              to="/simulation" 
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full font-sans bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
