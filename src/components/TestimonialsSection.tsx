
import React, { useState, useEffect, useRef } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ScrollReveal from './ScrollReveal';

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  stars: number;
  delay?: number;
}

const Testimonial = ({ quote, name, role, stars, delay = 0 }: TestimonialProps) => (
  <div 
    className="glass-card rounded-xl p-6 backdrop-blur-md bg-white/5 border border-white/10 flex flex-col h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < stars ? 'fill-neon-purple text-neon-purple' : 'text-gray-300'}`} 
        />
      ))}
    </div>
    <p className="text-gray-300 mb-4 italic flex-grow">{quote}</p>
    <div>
      <p className="font-bold text-white">{name}</p>
      <p className="text-sm text-gray-400">{role}</p>
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
    },
    {
      quote: "The wave propagation simulation finally helped me understand interference patterns in a way textbooks never could.",
      name: "Emily Wilson",
      role: "Science Teacher",
      stars: 5,
      delay: 400
    },
    {
      quote: "I use these simulations to supplement my classroom teaching. My students' test scores have improved dramatically.",
      name: "Prof. James Liu",
      role: "University Lecturer",
      stars: 5,
      delay: 500
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const visibleItems = 3;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => 
      prev + 1 >= testimonials.length - visibleItems + 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => 
      prev - 1 < 0 ? testimonials.length - visibleItems : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  return (
    <div className="py-12 md:py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute -inset-10 bg-gradient-to-b from-neon-blue/5 via-neon-purple/5 to-neon-cyan/5 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <div className="text-center mb-10">
            <span className="uppercase text-xs font-medium tracking-widest text-white/70 mb-2 block font-sans">Testimonials</span>
            <h2 className="font-tech mb-4">
              <span className="text-white">What Our</span>
              <span className="ml-2 text-neon-cyan">Users Say</span>
            </h2>
            
            <p className="text-white/80 max-w-2xl mx-auto">
              Discover how our interactive physics simulations have helped students and educators alike.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="relative">
          {/* Carousel controls */}
          <div className="flex justify-end mb-6 space-x-2">
            <button 
              onClick={prevSlide} 
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <button 
              onClick={nextSlide} 
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight size={20} className="text-white" />
            </button>
          </div>
          
          {/* Testimonial carousel */}
          <div className="overflow-hidden">
            <div 
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-[calc(100%/3-16px)] flex-shrink-0">
                  <Testimonial
                    quote={testimonial.quote}
                    name={testimonial.name}
                    role={testimonial.role}
                    stars={testimonial.stars}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(testimonials.length - visibleItems + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(i);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === currentIndex ? "bg-neon-cyan w-6" : "bg-white/30"
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
