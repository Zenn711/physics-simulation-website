
import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Box, Rocket, Loader, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const Home = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-indigo-950">
      {/* Particle background for dark mode only */}
      {theme === 'dark' && (
        <div className="particle-container fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="particle absolute rounded-full bg-white/20"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse-opacity ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      )}
      
      <header className="w-full bg-white bg-opacity-90 dark:bg-gray-800/90 dark:bg-opacity-90 backdrop-blur-sm shadow-md border-b py-6">
        <div className="container px-4 mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Atom className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Physics Playground</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-300">
              Discover Physics Through Interactive Simulations
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore fundamental physics concepts through engaging, interactive simulations. 
              Adjust parameters in real-time and observe how physical systems behave.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <SimulationCard 
              title="Projectile Motion" 
              description="Explore the trajectory of objects launched into the air and affected by gravity." 
              icon={<Rocket className="h-10 w-10" />} 
              link="/simulation"
              tag="#1"
              color="from-blue-500 to-indigo-600"
            />
            
            <SimulationCard 
              title="Pendulum" 
              description="Discover the periodic motion of a weight suspended from a pivot, swinging under gravity." 
              icon={<Loader className="h-10 w-10" />}
              link="/simulation?tab=pendulum" 
              tag="#2"
              color="from-indigo-500 to-purple-600"
            />
            
            <SimulationCard 
              title="Spring Force" 
              description="Investigate the oscillatory motion of an object attached to a spring." 
              icon={<Box className="h-10 w-10" />}
              link="/simulation?tab=spring" 
              tag="#3"
              color="from-purple-500 to-pink-600"
            />
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/simulation">
              <Button size="lg" className="px-8 shadow-lg hover:shadow-xl transition-shadow">
                Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-white bg-opacity-90 dark:bg-gray-800/90 py-6 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Created for educational purposes. All simulations include simplified physics models.</p>
          <p className="mt-1">© {new Date().getFullYear()} Physics Playground</p>
        </div>
      </footer>
    </div>
  );
};

const SimulationCard = ({ title, description, icon, link, tag, color }) => (
  <Link to={link} className="hover-scale block">
    <Card className="h-full dark:bg-gray-800/60 dark:border-gray-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-br ${color} dark:opacity-90 h-2`} />
      <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-xs font-bold px-2 py-1 rounded-full">
        {tag}
      </div>
      <CardContent className="p-6">
        <div className="mb-4 text-primary dark:text-indigo-400">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
        <div className="mt-4 flex items-center text-primary dark:text-indigo-400 text-sm font-medium">
          Explore <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default Home;
