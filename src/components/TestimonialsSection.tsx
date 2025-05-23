
import React, { useState, useEffect, useRef } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ScrollReveal from './ScrollReveal';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

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

  const [api, setApi] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto rotation
  useEffect(() => {
    if (!api) {
      return;
    }

    const startAutoRotate = () => {
      intervalRef.current = setInterval(() => {
        api.scrollNext();
      }, 4000);
    };

    const stopAutoRotate = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    startAutoRotate();

    // Clean up the interval when the component unmounts
    return () => {
      stopAutoRotate();
    };
  }, [api]);

  return (
    <div className="py-10 md:py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute -inset-10 bg-gradient-to-b from-neon-blue/5 via-neon-purple/5 to-neon-cyan/5 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <div className="text-center mb-8">
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
        
        <div className="relative mx-auto max-w-5xl">
          <Carousel 
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/3 pl-4">
                  <div className="h-full">
                    <Testimonial
                      quote={testimonial.quote}
                      name={testimonial.name}
                      role={testimonial.role}
                      stars={testimonial.stars}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-end pt-6 gap-2">
              <CarouselPrevious className="static transform-none rounded-full bg-white/5 hover:bg-white/10 border border-white/10" />
              <CarouselNext className="static transform-none rounded-full bg-white/5 hover:bg-white/10 border border-white/10" />
            </div>
          </Carousel>
          
          {/* Mobile Controls */}
          <div className="flex justify-center md:hidden mt-6 space-x-2">
            <button 
              onClick={() => api?.scrollPrev()}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <button 
              onClick={() => api?.scrollNext()}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
