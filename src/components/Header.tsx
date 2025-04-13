
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Atom, Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
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
      scrolled ? 'py-2 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 shadow-md' : 'py-4 bg-transparent'
    }`}>
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Atom className={`h-8 w-8 ${scrolled ? 'text-neon-purple' : 'text-primary'} group-hover:animate-pulse-glow transition-colors`} />
          <h1 className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-gradient' : ''}`}>
            Physics Playground
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/simulation" className="text-gray-700 dark:text-gray-200 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors">
            Simulations
          </Link>
          
          <a href="#features" className="text-gray-700 dark:text-gray-200 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors">
            Features
          </a>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="text-gray-700 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          
          <Link to="/simulation">
            <Button variant="default" className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-white">
              Get Started
            </Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="mr-2 text-gray-700 dark:text-gray-300"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="text-gray-700 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-gray-100 dark:border-gray-800 py-4">
          <div className="container px-4 mx-auto space-y-3">
            <Link 
              to="/simulation" 
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-neon-purple dark:hover:text-neon-cyan"
              onClick={() => setMobileMenuOpen(false)}
            >
              Simulations
            </Link>
            
            <a 
              href="#features" 
              className="block py-2 text-gray-700 dark:text-gray-200 hover:text-neon-purple dark:hover:text-neon-cyan"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            
            <Link 
              to="/simulation" 
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-white">
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
