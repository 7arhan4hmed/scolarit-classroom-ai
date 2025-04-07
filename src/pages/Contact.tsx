
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSending(false);
      toast({
        title: "Message Sent",
        description: "Thank you! We've received your message and will get back to you shortly.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-blue-600/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Contact Us</h1>
              <p className="text-lg text-gray-600">
                Have questions about SCOLARIT? Our team is here to help!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-xl border border-blue-600/20 p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 blue-purple-gradient rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-600 mb-4">Drop us a line anytime</p>
                <a href="mailto:support@scolarit.com" className="text-rgb(37, 99, 235) font-medium hover:text-rgb(139, 92, 246)">
                  support@scolarit.com
                </a>
              </div>

              <div className="bg-white rounded-xl border border-blue-600/20 p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 blue-purple-gradient rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                <p className="text-gray-600 mb-4">Mon-Fri, 9am-5pm EST</p>
                <a href="tel:+1-800-SCOLARIT" className="text-rgb(37, 99, 235) font-medium hover:text-rgb(139, 92, 246)">
                  +1-800-SCOLARIT
                </a>
              </div>

              <div className="bg-white rounded-xl border border-blue-600/20 p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 blue-purple-gradient rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Office</h3>
                <p className="text-gray-600 mb-4">Visit our headquarters</p>
                <address className="text-rgb(37, 99, 235) font-medium not-italic">
                  123 Education Lane<br />
                  San Francisco, CA 94105
                </address>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-blue-600/20 p-8 shadow-sm max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Select value={formData.subject} onValueChange={handleSubjectChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="demo">Request a Demo</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                      className="min-h-32 w-full"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={sending}
                  className="w-full md:w-auto blue-purple-gradient hover:opacity-90"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-text">Our Integration Partners</h2>
              <p className="text-lg text-gray-600">
                SCOLARIT seamlessly connects with all major learning management systems
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center items-center max-w-4xl mx-auto">
              {/* These would be actual logos in a real implementation */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white text-xl font-bold">G</span>
                </div>
                <span className="font-medium">Google Classroom</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white text-xl font-bold">C</span>
                </div>
                <span className="font-medium">Canvas</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-orange-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white text-xl font-bold">M</span>
                </div>
                <span className="font-medium">Moodle</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white text-xl font-bold">B</span>
                </div>
                <span className="font-medium">Blackboard</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
