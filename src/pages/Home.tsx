
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, Atom, Play, BadgeCheck } from 'lucide-react';

const Home = () => {
  const { theme } = useTheme();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Atom className="h-6 w-6 text-white" />
            <span className="text-xl font-bold">Physics Playground</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/simulation" className="text-white/80 hover:text-white transition-colors">
              Simulations
            </Link>
            <Link to="#features" className="text-white/80 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="#faq" className="text-white/80 hover:text-white transition-colors">
              FAQ
            </Link>
          </div>
          
          <Link to="/simulation">
            <Button variant="outline" className="border-neon-purple text-white hover:bg-neon-purple/20">
              Connect Wallet
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 z-10 mb-12 md:mb-0">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Physics<br />Simulation<br />Platform
              </h1>
              
              <p className="text-lg text-white/70 mb-8 max-w-md">
                Explore interactive physics concepts through immersive, NFT-style simulations designed for hands-on learning.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/simulation">
                  <Button size="lg" className="bg-neon-purple hover:bg-neon-purple/90 text-white">
                    Learn More
                    <ChevronRight className="ml-2" size={18} />
                  </Button>
                </Link>
                
                <Link to="/simulation">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                    <Play className="mr-2" size={18} />
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="relative perspective-800">
                <div className="relative w-full max-w-md mx-auto transform rotate-y-10 rotate-x-5 translate-z-20">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan p-1 shadow-xl shadow-neon-purple/20">
                    <div className="w-full h-full bg-black rounded-xl flex items-center justify-center p-6">
                      <div className="relative">
                        <Atom className="w-24 h-24 text-white animate-pulse" />
                        <div className="absolute inset-0 blur-xl bg-neon-purple/30 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-md">
                    <div className="w-32 h-32 rounded-full bg-neon-cyan/30 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="absolute top-1/4 -right-8 w-40 h-40 transform rotate-y-20 rotate-x-10 translate-z-10">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-neon-blue to-neon-cyan p-0.5 shadow-lg">
                    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center p-4">
                      <span className="text-xl font-bold text-gradient">Projectile</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-1/4 -left-4 w-36 h-36 transform -rotate-y-15 -rotate-x-5 translate-z-5">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink p-0.5 shadow-lg">
                    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center p-4">
                      <span className="text-xl font-bold text-gradient-reverse">Pendulum</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-neon-purple/10 to-transparent -z-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-neon-cyan/10 to-transparent -z-10 blur-3xl"></div>
        </section>
        
        {/* Trusted By Section */}
        <section className="py-16 bg-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">We are trusted by</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {['Solana', 'Sui', 'Digital Fox', 'Opto', 'Bronze'].map((brand) => (
                <Card key={brand} className="bg-black/40 border border-white/10 flex items-center justify-center p-6">
                  <span className="text-lg font-medium text-white/80">{brand}</span>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              <span className="text-gradient">Unique Physics Simulations</span>
            </h2>
            
            <p className="text-lg text-white/70 text-center max-w-2xl mx-auto mb-16">
              A collection of interactive physics simulations with randomly generated attributes and parameters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Projectile Motion",
                  description: "Explore projectile motion across different environments and gravity fields.",
                  color: "from-neon-purple to-neon-blue"
                },
                {
                  title: "Pendulum Dynamics",
                  description: "Visualize harmonic oscillation with adjustable parameters.",
                  color: "from-neon-blue to-neon-cyan"
                },
                {
                  title: "Spring Force",
                  description: "Experiment with compression and tension in spring systems.",
                  color: "from-neon-cyan to-neon-purple"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="glass-card rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-5px]"
                >
                  <div className={`h-40 mb-6 rounded-lg bg-gradient-to-br ${feature.color} p-0.5`}>
                    <div className="w-full h-full rounded-md bg-black flex items-center justify-center">
                      <Atom className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                  
                  <div className="mt-6">
                    <Link to={`/simulation?tab=${feature.title.split(' ')[0].toLowerCase()}`}>
                      <Button variant="outline" className="w-full border-white/10 hover:border-white/20 hover:bg-white/5">
                        Get from DigitalFox
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent -z-10"></div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Atom className="h-6 w-6 text-white" />
              <span className="text-xl font-bold">Physics Playground</span>
            </div>
            
            <div className="flex space-x-8 text-white/70">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/simulation" className="hover:text-white transition-colors">Simulations</Link>
              <Link to="#features" className="hover:text-white transition-colors">Features</Link>
              <Link to="#faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
            <p>© {new Date().getFullYear()} Physics Playground. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
