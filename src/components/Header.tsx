
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-3 backdrop-blur-lg bg-black/60 shadow-md' : 'py-5 bg-transparent'
    }`}>
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Atom className={`h-7 w-7 ${scrolled ? 'text-neon-purple/90' : 'text-white/90'} group-hover:animate-pulse-glow transition-colors duration-300`} />
          <h1 className={`text-xl font-display font-bold tracking-tight ${scrolled ? 'text-white' : 'text-white/90'} transition-colors duration-300`}>
            Physics Playground
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/simulation" className="font-sans text-sm text-gray-300 hover:text-neon-cyan/90 transition-colors duration-300">
            Simulations
          </Link>
          
          <a href="#features" className="font-sans text-sm text-gray-300 hover:text-neon-cyan/90 transition-colors duration-300">
            Features
          </a>
          
          <Link to="/simulation">
            <Button variant="default" className="font-sans text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 transition-all duration-300">
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
            className="text-gray-300 hover:bg-white/5"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden backdrop-blur-lg bg-black/80 border-t border-gray-800/30 py-4 animate-fade-in">
          <div className="container px-4 mx-auto space-y-4">
            <Link 
              to="/simulation" 
              className="font-sans block py-2 text-gray-300 hover:text-neon-cyan/90 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Simulations
            </Link>
            
            <a 
              href="#features" 
              className="font-sans block py-2 text-gray-300 hover:text-neon-cyan/90 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            
            <Link 
              to="/simulation" 
              className="block py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full font-sans bg-white/10 hover:bg-white/15 text-white border border-white/10">
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
