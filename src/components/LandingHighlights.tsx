import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, LayoutDashboard, PieChart, ShoppingBag, Sparkles } from 'lucide-react';

const highlights = [
  {
    title: 'Interactive Dashboard',
    description: 'Monitor your progress, macro balance, and hydration goals at a glance.',
    icon: LayoutDashboard,
    link: '/dashboard',
    cta: 'View dashboard',
  },
  {
    title: 'AI Meal Planning',
    description: 'Build weekly plans with smart swaps and automated grocery lists.',
    icon: ShoppingBag,
    link: '/meal-plans',
    cta: 'Plan meals',
  },
  {
    title: 'Insights & Analytics',
    description: 'Translate your data into actionable advice with trend analysis.',
    icon: PieChart,
    link: '/analytics',
    cta: 'Explore analytics',
  },
  {
    title: 'Coaching Intelligence',
    description: 'Let our AI coach highlight next steps tailored to your current streak.',
    icon: Brain,
    link: '/insights',
    cta: 'See insights',
  },
];

const LandingHighlights = () => (
  <section className="relative py-20 animate-fade-in">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14 space-y-4">
        <span className="inline-flex items-center rounded-full bg-forest-100 text-forest-600 dark:bg-forest-900/50 dark:text-forest-200 px-4 py-1 text-sm font-medium">
          <Sparkles className="w-4 h-4 mr-2" />
          Personalized Nutrition OS
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Everything you need to stay on track, organised in dedicated spaces
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore focused experiences for planning meals, reviewing analytics, and working with our AI coach. Hop in where you left off.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {highlights.map(({ title, description, icon: Icon, link, cta }) => (
          <Card key={title} className="glass-panel hover:shadow-large transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-forest-100 text-forest-600 dark:bg-forest-900/60 dark:text-forest-100">
                  <Icon className="h-6 w-6" />
                </span>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              <p className="text-muted-foreground">{description}</p>
              <Button asChild variant="outline" className="border-border/60 hover:bg-forest-100/60 dark:hover:bg-forest-900/30">
                <Link to={link}>{cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default LandingHighlights;
