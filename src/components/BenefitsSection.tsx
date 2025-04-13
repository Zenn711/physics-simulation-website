
import React from 'react';
import { Brain, Lightbulb, GraduationCap, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import ScrollReveal from './ScrollReveal';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

const Benefit = ({ icon, title, description, color, delay = 0 }: BenefitProps) => (
  <div 
    className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br ${color} bg-opacity-10`}>
      <div className="text-white">{icon}</div>
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-white/70 flex-grow">{description}</p>
  </div>
);

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Brain size={24} />,
      title: "Enhanced Understanding",
      description: "Visualize abstract concepts to build intuitive understanding of physics principles that textbooks alone can't provide.",
      color: "from-neon-cyan/20 to-neon-blue/20",
      delay: 100
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Interactive Learning",
      description: "Learn by doing with hands-on experiments that let you manipulate variables and see immediate results.",
      color: "from-neon-blue/20 to-neon-purple/20",
      delay: 200
    },
    {
      icon: <GraduationCap size={24} />,
      title: "Educational Growth",
      description: "Progress from basic concepts to complex principles at your own pace with incrementally challenging simulations.",
      color: "from-neon-purple/20 to-neon-cyan/20",
      delay: 300
    },
    {
      icon: <Gauge size={24} />,
      title: "Real-Time Feedback",
      description: "Immediately see how changing parameters affects outcomes, allowing for rapid experimentation and learning.",
      color: "from-neon-cyan/20 to-neon-blue/20",
      delay: 400
    }
  ];

  return (
    <section className="py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-950/50 pointer-events-none"></div>
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <div className="text-center mb-8">
            <span className="uppercase text-xs font-medium tracking-widest text-white/70 mb-2 block font-sans">Why Use Our Platform</span>
            <h2 className="mb-4 font-tech">
              <span className="text-white">Learning</span>
              <span className="ml-2 text-neon-cyan">Benefits</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Our physics simulations provide unique advantages that enhance the educational experience.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} animation="fade-in" delay={benefit.delay}>
              <Benefit
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                color={benefit.color}
                delay={benefit.delay}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
