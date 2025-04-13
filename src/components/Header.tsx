
import React from 'react';
import { Atom } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-sm border-b py-4">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Atom className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Physics Playground</h1>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Interactive Physics Simulations
        </div>
      </div>
    </header>
  );
};

export default Header;
