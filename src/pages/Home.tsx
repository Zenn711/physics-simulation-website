
import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Beaker, BookOpen, Box, Brain, Compass, Rocket, Loader, ArrowRight, CheckCircle } from 'lucide-react';
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
                animation: `pulse-opacity ${Math.random() * 3 + 2}s ease-in-out infinite, float ${Math.random() * 15 + 10}s linear infinite`,
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
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-16 bg-white dark:bg-gray-800/60 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 dark:from-indigo-700/20 dark:to-purple-700/10"></div>
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-300">
                Explore the Laws of Physics Through Interactive Simulations
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our interactive simulations bring physics concepts to life, allowing you to explore, experiment, and understand fundamental principles through hands-on learning experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/simulation">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                    Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 dark:opacity-30"></div>
                <img 
                  src="/physics-illustration.svg" 
                  alt="Physics Illustration" 
                  className="relative z-10 w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                    const fallbackEl = document.getElementById('illustration-fallback');
                    if (fallbackEl) fallbackEl.style.display = 'block';
                  }}
                />
                <div id="illustration-fallback" style={{ display: 'none' }} className="relative z-10 flex items-center justify-center">
                  <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 p-8">
                    <Atom className="h-32 w-32 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div id="features" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Simulations?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our physics playground offers powerful educational tools designed to make learning physics intuitive and engaging.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Brain className="h-8 w-8" />}
              title="Visual Learning"
              description="Convert abstract concepts into visual experiences that enhance understanding and retention."
            />
            <FeatureCard 
              icon={<Compass className="h-8 w-8" />}
              title="Parameter Exploration"
              description="Adjust variables in real-time to understand how different factors affect physical systems."
            />
            <FeatureCard 
              icon={<Beaker className="h-8 w-8" />}
              title="Scientific Experimentation"
              description="Test hypotheses by changing conditions and observing the outcomes in a controlled environment."
            />
          </div>
        </div>
      
        {/* Simulations Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Available Simulations</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore physics concepts through our interactive simulations. More coming soon!
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
              features={[
                "Adjustable launch angle and velocity",
                "Different planetary environments",
                "Real-time trajectory visualization"
              ]}
            />
            
            <SimulationCard 
              title="Pendulum" 
              description="Discover the periodic motion of a weight suspended from a pivot, swinging under gravity." 
              icon={<Loader className="h-10 w-10" />}
              link="/simulation?tab=pendulum" 
              tag="#2"
              color="from-indigo-500 to-purple-600"
              features={[
                "Adjustable length and mass",
                "Energy visualization",
                "Damping effects"
              ]}
            />
            
            <SimulationCard 
              title="Spring Force" 
              description="Investigate the oscillatory motion of an object attached to a spring." 
              icon={<Box className="h-10 w-10" />}
              link="/simulation?tab=spring" 
              tag="#3"
              color="from-purple-500 to-pink-600"
              features={[
                "Adjustable spring constant",
                "Oscillation graphing",
                "Energy conversion visualization"
              ]}
            />
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-8 md:p-12 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Jump right in to any of our interactive simulations and see physics in action.
          </p>
          <Link to="/simulation">
            <Button size="lg" className="px-8 shadow-lg hover:shadow-xl transition-shadow">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
      
      <footer className="bg-white bg-opacity-90 dark:bg-gray-800/90 py-6 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Atom className="h-6 w-6 text-primary" />
            <p className="font-medium">Physics Playground</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created for educational purposes. All simulations include simplified physics models.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
            © {new Date().getFullYear()} Physics Playground
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800/60 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="text-primary dark:text-indigo-400 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const SimulationCard = ({ title, description, icon, link, tag, color, features }) => (
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
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
        
        {features && features.length > 0 && (
          <ul className="space-y-1 mb-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-auto flex items-center text-primary dark:text-indigo-400 text-sm font-medium">
          Explore <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default Home;
