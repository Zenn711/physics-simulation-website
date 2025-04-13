
import React from 'react';
import { Atom, Sliders, Play, BarChart } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: number;
  delay?: number;
}

const Step = ({ icon, title, description, stepNumber, delay = 0 }: StepProps) => (
  <div 
    className="relative flex flex-col items-center text-center"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="mb-4 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center relative hover-scale">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan opacity-10 blur-sm"></div>
      <div className="text-white">{icon}</div>
    </div>
    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-cyan/20 backdrop-blur-md flex items-center justify-center border border-neon-cyan/30 text-neon-cyan text-xs font-bold">
      {stepNumber}
    </div>
    <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
    <p className="text-white/70 text-sm max-w-xs">{description}</p>
  </div>
);

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Atom size={32} />,
      title: "Choose a Simulation",
      description: "Select from various physics simulations designed to demonstrate key concepts in mechanics and wave theory.",
      stepNumber: 1,
      delay: 100
    },
    {
      icon: <Sliders size={32} />,
      title: "Adjust Parameters",
      description: "Manipulate variables like gravity, amplitude, or frequency to see how they affect the simulation in real-time.",
      stepNumber: 2,
      delay: 200
    },
    {
      icon: <Play size={32} />,
      title: "Observe & Learn",
      description: "Watch how the simulation responds to your inputs and develop an intuitive understanding of physical principles.",
      stepNumber: 3,
      delay: 300
    },
    {
      icon: <BarChart size={32} />,
      title: "Analyze Results",
      description: "Review detailed data and visualizations to deepen your understanding of the underlying physics concepts.",
      stepNumber: 4,
      delay: 400
    }
  ];

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-gray-900/50 pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <div className="text-center mb-12">
            <span className="uppercase text-xs font-medium tracking-widest text-white/70 mb-2 block font-sans">Easy to Use</span>
            <h2 className="mb-4 font-tech">
              <span className="text-white">How It</span>
              <span className="ml-2 text-neon-cyan">Works</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Our physics simulations make complex concepts accessible through an intuitive, interactive experience.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ScrollReveal key={index} animation="fade-in" delay={step.delay}>
              <Step
                icon={step.icon}
                title={step.title}
                description={step.description}
                stepNumber={step.stepNumber}
                delay={step.delay}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Connected line between steps (visible on larger screens) */}
        <div className="hidden lg:block absolute top-36 left-1/2 -translate-x-1/2 w-[calc(100%-300px)] h-0.5 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent"></div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
