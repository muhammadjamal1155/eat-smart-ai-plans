import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingCTA = () => (
  <section className="py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="glass-panel shadow-large overflow-hidden">
        <CardContent className="px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-forest-500 dark:text-forest-200">Get started</p>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              Create your personalised nutrition timeline in minutes
            </h3>
            <p className="text-lg text-muted-foreground">
              Answer a short intake, sync your devices, and our AI will map daily targets, smart reminders, and meal suggestions automatically.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="btn-primary px-8 py-4">
              <Link to="/register">Create free account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-4 border-border/60 hover:bg-forest-100/60 dark:hover:bg-forest-900/30">
              <Link to="/login">I already have access</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
);

export default LandingCTA;
