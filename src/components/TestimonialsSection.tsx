
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  stars: number;
  delay?: number;
}

const Testimonial = ({ quote, name, role, stars, delay = 0 }: TestimonialProps) => (
  <div 
    className="glass-card rounded-xl p-6 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-5 h-5 ${i < stars ? 'fill-neon-purple text-neon-purple' : 'text-gray-300'}`} 
        />
      ))}
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-4 italic">{quote}</p>
    <div>
      <p className="font-bold">{name}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "These simulations helped me visualize concepts I've been struggling with for years. It's like having a physics lab in my browser!",
      name: "Alex Johnson",
      role: "Physics Student",
      stars: 5,
      delay: 100
    },
    {
      quote: "As an educator, I've found these interactive tools invaluable for explaining complex physics principles to my students.",
      name: "Dr. Sarah Chen",
      role: "Physics Professor",
      stars: 5,
      delay: 200
    },
    {
      quote: "The ability to manipulate variables in real-time and see the effects has significantly improved my understanding of physics.",
      name: "Michael Rodriguez",
      role: "Engineering Student",
      stars: 4,
      delay: 300
    }
  ];

  return (
    <div className="py-16 md:py-24 relative">
      {/* Background gradient */}
      <div className="absolute -inset-10 bg-gradient-to-b from-neon-blue/5 via-neon-purple/5 to-neon-cyan/5 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gradient">
          What Our Users Say
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12">
          Discover how our interactive physics simulations have helped students and educators alike.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              stars={testimonial.stars}
              delay={testimonial.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
