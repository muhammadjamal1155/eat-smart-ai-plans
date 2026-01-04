
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';

const LandingCTA = () => (
  <section className="py-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Get Started Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-panel shadow-large overflow-hidden relative border-border/50 h-full flex flex-col">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=2000&q=80"
                alt="Fresh food background"
                className="w-full h-full object-cover opacity-10 dark:opacity-5"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60" />
            </div>
            <CardContent className="relative z-10 p-8 flex flex-col justify-between h-full space-y-8">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Get started</p>
                <h3 className="text-3xl font-bold text-foreground">
                  Start your transformation today
                </h3>
                <p className="text-lg text-muted-foreground">
                  Create your personalized nutrition timeline in minutes. Sync devices, get smart reminders, and automated meal plans.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="btn-primary w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                  <Link to="/register">Create free account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-border/60 hover:bg-background/80 backdrop-blur-sm">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-panel shadow-large overflow-hidden relative border-border/50 h-full flex flex-col bg-primary/5 dark:bg-primary/10">
            <CardContent className="relative z-10 p-8 flex flex-col justify-between h-full space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Users className="w-6 h-6" />
                  </span>
                  <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Community</p>
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  Join 10,000+ Healthy Eaters
                </h3>
                <p className="text-lg text-muted-foreground">
                  Share recipes, get motivation, and track progress with our supportive community. Expert nutritionists host weekly Q&A sessions.
                </p>
              </div>
              <div>
                <Button variant="link" className="text-primary p-0 h-auto font-semibold text-lg group">
                  Join the Community <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  </section>
);

export default LandingCTA;

