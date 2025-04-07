
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does SCOLARIT integrate with my existing LMS?",
    answer: "SCOLARIT seamlessly integrates with Google Classroom, Canvas, Moodle, Blackboard and other major learning management systems through our secure API connections. Simply authorize the connection, and you can import your classes, assignments, and student data with just a few clicks."
  },
  {
    question: "Is my students' data secure with SCOLARIT?",
    answer: "Absolutely. We take data security seriously. SCOLARIT is FERPA compliant and employs enterprise-grade encryption. All data is stored securely, and we never share student information with third parties or use it to train our AI models without explicit permission."
  },
  {
    question: "How accurate is the AI grading system?",
    answer: "Our AI grading system has been trained on thousands of educator-graded assignments and achieves over 95% accuracy compared to human grading. You maintain full control and can always review and adjust grades before finalizing them."
  },
  {
    question: "Can I customize grading criteria for different assignments?",
    answer: "Yes! SCOLARIT allows you to create and save custom rubrics with specific criteria and point values. You can reuse these rubrics across multiple assignments and classes or create new ones for special projects."
  },
  {
    question: "What type of feedback does SCOLARIT provide to students?",
    answer: "SCOLARIT provides detailed, constructive feedback that highlights strengths, areas for improvement, and specific suggestions. Teachers can customize the feedback style and focus areas to align with their teaching approach."
  },
  {
    question: "Is there a trial period available?",
    answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial, and you can cancel anytime."
  },
];

const FaqSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-600/5 to-purple-500/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-blue-600/20">
                <AccordionTrigger className="text-left font-medium text-lg py-4 hover:text-rgb(37, 99, 235)">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600">
              Still have questions? <a href="/contact" className="text-rgb(37, 99, 235) hover:text-rgb(139, 92, 246) font-medium">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
