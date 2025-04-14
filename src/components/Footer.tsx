
import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800/50 pt-16 pb-10 relative">
      {/* Subtle background gradient effect */}
      <div className="absolute -inset-10 bg-gradient-to-b from-neon-purple/3 to-transparent blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and description */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Atom className="h-7 w-7 text-neon-purple/80" />
              <span className="text-xl font-display font-bold tracking-tight">Physics Playground</span>
            </div>
            <p className="text-gray-400 font-body text-sm leading-relaxed max-w-md">
              Interactive physics simulations that make learning engaging and intuitive. 
              Explore complex concepts through hands-on experimentation in an immersive environment.
            </p>
            <div className="flex space-x-5 pt-2">
              <a href="#" className="text-gray-500 hover:text-neon-purple/80 transition-colors duration-300">
                <Github size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-neon-cyan/80 transition-colors duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-neon-blue/80 transition-colors duration-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-white/80 transition-colors duration-300">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-heading font-bold mb-5 text-sm tracking-wider uppercase text-gray-300">Explore</h3>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/simulation" className="text-gray-400 hover:text-neon-cyan/90 transition-colors inline-block">
                  Simulations
                </Link>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-neon-cyan/90 transition-colors inline-block">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-cyan/90 transition-colors inline-block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-cyan/90 transition-colors inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Simulations */}
          <div>
            <h3 className="font-heading font-bold mb-5 text-sm tracking-wider uppercase text-gray-300">Simulations</h3>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/simulation?tab=projectile" className="text-gray-400 hover:text-neon-cyan/90 transition-colors inline-block">
                  Projectile Motion
                </Link>
              </li>
              <li>
                <Link to="/simulation?tab=pendulum" className="text-gray-400 hover:text-neon-cyan/90 transition-colors inline-block">
                  Pendulum
                </Link>
              </li>
              <li>
                <Link to="/simulation?tab=spring" className="text-gray-400 hover:text-neon-cyan/90 transition-colors inline-block">
                  Spring Force
                </Link>
              </li>
              <li>
                <Link to="/simulation?tab=wave" className="text-gray-400 hover:text-neon-cyan/90 transition-colors inline-block">
                  Wave Propagation
                </Link>
              </li>
              <li>
                <Link to="/simulation?tab=fluid" className="text-gray-400 hover:text-neon-cyan/90 transition-colors inline-block">
                  Fluid Dynamics
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800/30 mt-12 pt-8 text-center text-gray-500 text-xs font-body">
          <p>© {new Date().getFullYear()} Physics Playground. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
