
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Atom, 
  Beaker, 
  Brain, 
  Compass, 
  Rocket, 
  Loader2, 
  Package2, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Lightbulb,
  Gauge,
  Waves,
  Volume2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import FeatureCard from '@/components/FeatureCard';
import SimulationCard from '@/components/SimulationCard';
import SoundToggle from '@/components/SoundToggle';

const Home = () => {
  const { theme } = useTheme();
  const { soundEnabled, toggleSound } = useSoundEffects();
  
  // Set up enhanced particle effect for dark mode
  useEffect(() => {
    if (theme === 'dark') {
      const createParticle = () => {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        const brightness = Math.random() * 50 + 50;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.top = `${posY}%`;
        particle.style.left = `${posX}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.background = `rgba(${brightness}, ${brightness + 20}, ${brightness + 40}, ${Math.random() * 0.5 + 0.5})`;
        particle.style.boxShadow = `0 0 ${size * 2}px ${size}px rgba(${brightness}, ${brightness + 20}, ${brightness + 40}, 0.3)`;
        
        const container = document.querySelector('.particle-container');
        if (container) {
          container.appendChild(particle);
          
          // Remove particle after animation completes
          setTimeout(() => {
            particle.remove();
          }, duration * 1000 + delay * 1000);
        }
      };
      
      // Create initial set of particles
      for (let i = 0; i < 60; i++) {
        createParticle();
      }
      
      // Create new particles periodically
      const particleInterval = setInterval(() => {
        if (document.querySelector('.particle-container')) {
          createParticle();
        } else {
          clearInterval(particleInterval);
        }
      }, 1000);
      
      return () => {
        clearInterval(particleInterval);
      };
    }
  }, [theme]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-indigo-950">
      {/* Particle background for dark mode only */}
      {theme === 'dark' && (
        <div className="particle-container fixed inset-0 pointer-events-none overflow-hidden">
          {/* Dynamic particles will be added here by the useEffect */}
        </div>
      )}
      
      <header className="w-full bg-white bg-opacity-90 dark:bg-gray-800/90 dark:bg-opacity-90 backdrop-blur-sm shadow-md border-b py-6">
        <div className="container px-4 mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Atom className="h-10 w-10 text-cyan-500" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight">Physics Playground</h1>
          </div>
          <div className="flex items-center space-x-2">
            <SoundToggle soundEnabled={soundEnabled} toggleSound={toggleSound} />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-16 bg-white dark:bg-gray-800/60 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 dark:from-cyan-700/20 dark:to-indigo-700/10"></div>
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative">
            <div className="flex flex-col justify-center">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-indigo-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Explore the Laws of Physics Through Interactive Simulations
              </motion.h2>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Our interactive simulations bring physics concepts to life, allowing you to explore, experiment, and understand fundamental principles through hands-on learning experiences.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/simulation">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                    Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </a>
              </motion.div>
            </div>
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl opacity-20 dark:opacity-30"></div>
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
                  <div className="rounded-full bg-cyan-100 dark:bg-cyan-900/40 p-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                      <Atom className="h-32 w-32 text-cyan-500 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Features Section */}
        <div id="features" className="mb-16">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-indigo-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Our Simulations?
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our physics playground offers powerful educational tools designed to make learning physics intuitive and engaging.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Brain className="h-8 w-8" />}
              title="Visual Learning"
              description="Convert abstract concepts into visual experiences that enhance understanding and retention."
            />
            <FeatureCard 
              icon={<Lightbulb className="h-8 w-8" />}
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
            <motion.h2 
              className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-indigo-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Available Simulations
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Explore physics concepts through our interactive simulations. More coming soon!
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <SimulationCard 
              title="Projectile Motion" 
              description="Explore the trajectory of objects launched into the air and affected by gravity." 
              icon={<Rocket className="h-10 w-10" />} 
              link="/simulation"
              tag="#1"
              color="from-cyan-500 to-blue-600"
              features={[
                "Adjustable launch angle and velocity",
                "Different planetary environments",
                "Real-time trajectory visualization"
              ]}
            />
            
            <SimulationCard 
              title="Pendulum" 
              description="Discover the periodic motion of a weight suspended from a pivot, swinging under gravity." 
              icon={<Waves className="h-10 w-10" />}
              link="/simulation?tab=pendulum" 
              tag="#2"
              color="from-blue-500 to-indigo-600"
              features={[
                "Adjustable length and mass",
                "Energy visualization",
                "Damping effects"
              ]}
            />
            
            <SimulationCard 
              title="Spring Force" 
              description="Investigate the oscillatory motion of an object attached to a spring." 
              icon={<Gauge className="h-10 w-10" />}
              link="/simulation?tab=spring" 
              tag="#3"
              color="from-indigo-500 to-purple-600"
              features={[
                "Adjustable spring constant",
                "Oscillation graphing",
                "Energy conversion visualization"
              ]}
            />
          </div>
        </div>
        
        {/* Added new features section */}
        <motion.div 
          className="mb-16 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800/50 dark:to-indigo-900/30 rounded-xl p-8 shadow-lg overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
          
          <h2 className="text-2xl font-bold mb-6 relative z-10 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-300">
            New Features in Our Physics Playground
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <Card className="bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-cyan-100 dark:bg-cyan-900/60 p-3 rounded-full mb-3">
                  <Sparkles className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-medium mb-1">Interactive Animations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dynamic visual effects that respond to user input</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-blue-100 dark:bg-blue-900/60 p-3 rounded-full mb-3">
                  <Volume2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium mb-1">Sound Effects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Audio feedback for a more immersive experience</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/60 p-3 rounded-full mb-3">
                  <Compass className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-medium mb-1">Multiple Environments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Explore physics on Earth, Moon, and Mars</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-purple-100 dark:bg-purple-900/60 p-3 rounded-full mb-3">
                  <Package2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium mb-1">Data Visualization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time graphs and measurements</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          className="text-center bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800/50 dark:to-indigo-900/30 rounded-xl p-8 md:p-12 shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-300">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6 relative z-10">
            Jump right in to any of our interactive simulations and see physics in action.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative z-10"
          >
            <Link to="/simulation">
              <Button size="lg" className="px-8 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
      
      <footer className="bg-white bg-opacity-90 dark:bg-gray-800/90 py-6 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Atom className="h-6 w-6 text-cyan-500" />
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

export default Home;
