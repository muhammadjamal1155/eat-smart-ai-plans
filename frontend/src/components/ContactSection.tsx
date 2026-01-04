import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Contact, Mail, MessageSquare, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "Thank you for your feedback. We'll get back to you within 24 hours.",
      });
    }, 2000);
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
  ];

  return (
    <section id="contact" className="py-20 relative w-full overflow-x-hidden animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass-panel shadow-large">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-forest-500" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Your first name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Your last name" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help you..."
                      className="min-h-32"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary text-lg py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-6">
            <Card className="glass-panel shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Contact className="w-5 h-5 text-forest-500" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-forest-500" />
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <div className="text-muted-foreground">muhammadjamal8698320@gmail.com</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-forest-500" />
                  <div>
                    <div className="font-medium text-foreground">Phone</div>
                    <div className="text-muted-foreground">+923225307540</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Contact className="w-5 h-5 text-forest-500" />
                  <div>
                    <div className="font-medium text-foreground">Address</div>
                    <div className="text-muted-foreground">Lahore City<br />Pakistan</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel shadow-medium">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 rounded-lg bg-background/70 dark:bg-background/40 border border-border/60 hover:bg-forest-100/60 dark:hover:bg-forest-900/30 transition-colors duration-200"
                    >
                      <social.icon className="w-5 h-5 text-forest-500" />
                      <span className="text-sm font-medium text-foreground">{social.name}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel shadow-medium">
              <CardContent className="p-6 text-center space-y-3">
                <h4 className="font-semibold text-foreground">Need Immediate Help?</h4>
                <p className="text-sm text-muted-foreground">
                  Check out our comprehensive FAQ section or browse our knowledge base for instant answers.
                </p>
                <Button variant="outline" className="w-full border-border/60 text-forest-500 hover:bg-forest-100/60 dark:hover:bg-forest-900/30">
                  Visit Help Center
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
