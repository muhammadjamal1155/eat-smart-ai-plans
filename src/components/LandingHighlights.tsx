import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, LayoutDashboard, PieChart, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const LandingHighlights = () => (
  <section className="relative py-20 overflow-hidden">
    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center mb-14 space-y-4">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center rounded-full bg-forest-100 text-forest-600 dark:bg-forest-900/50 dark:text-forest-200 px-4 py-1 text-sm font-medium"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Personalized Nutrition OS
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-foreground"
        >
          Everything you need to stay on track
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Explore focused experiences for planning meals, reviewing analytics, and working with our AI coach.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-2"
      >
        {highlights.map(({ title, description, icon: Icon, link, cta }) => (
          <motion.div key={title} variants={item} className="h-full">
            <Card className="glass-panel hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-left flex-1 flex flex-col justify-between">
                <p className="text-muted-foreground">{description}</p>
                <Button asChild variant="ghost" className="group p-0 hover:bg-transparent hover:text-primary w-fit">
                  <Link to={link} className="flex items-center">
                    {cta} <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default LandingHighlights;
