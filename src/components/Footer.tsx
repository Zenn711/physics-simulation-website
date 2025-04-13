
import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12 relative">
      {/* Background gradient effect */}
      <div className="absolute -inset-10 bg-gradient-to-b from-neon-purple/5 to-transparent blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Atom className="h-8 w-8 text-neon-purple" />
              <span className="text-2xl font-bold">Physics Playground</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Interactive physics simulations that make learning engaging and intuitive. 
              Explore complex concepts through hands-on experimentation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-neon-purple transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-neon-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-neon-purple transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-neon-purple transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-bold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/simulation" className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors">
                  Simulations
                </Link>
              </li>
              <li>
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Simulations */}
          <div>
            <h3 className="font-bold mb-4">Simulations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/simulation?tab=projectile" className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors">
                  Projectile Motion
                </Link>
              </li>
              <li>
                <Link to="/simulation?tab=pendulum" className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors">
                  Pendulum
                </Link>
              </li>
              <li>
                <Link to="/simulation?tab=spring" className="text-gray-600 dark:text-gray-300 hover:text-neon-purple dark:hover:text-neon-cyan transition-colors">
                  Spring Force
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Physics Playground. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
