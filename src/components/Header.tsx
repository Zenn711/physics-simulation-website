
import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-sm border-b py-4 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Atom className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Physics Playground</h1>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
            Interactive Physics Simulations
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="text-gray-700 dark:text-gray-300"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
