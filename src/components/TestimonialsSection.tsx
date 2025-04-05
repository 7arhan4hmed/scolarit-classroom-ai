
import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "EduGrade has completely transformed my assessment workflow. What used to take me entire weekends now takes just a couple of hours, and the quality of feedback has actually improved.",
    name: "Sarah Johnson",
    title: "High School English Teacher",
    image: "/placeholder.svg"
  },
  {
    quote: "As a professor with over 200 students, grading was always my biggest challenge. EduGrade has given me back countless hours while providing my students with consistent, detailed feedback.",
    name: "Dr. Michael Chen",
    title: "Associate Professor, Computer Science",
    image: "/placeholder.svg"
  },
  {
    quote: "The personalized feedback EduGrade generates has led to measurable improvements in student performance. It's like having a teaching assistant who never gets tired.",
    name: "Priya Patel",
    title: "Middle School Math Teacher",
    image: "/placeholder.svg"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved By Educators Everywhere
          </h2>
          <p className="text-lg text-muted-foreground">
            See how EduGrade is helping teachers and professors reclaim their time while improving educational outcomes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl border relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-200" />
              <p className="mb-6 relative z-10">{testimonial.quote}</p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
