import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Flame, LineChart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPreview = () => (
  <section className="py-20 overflow-hidden">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-panel shadow-medium overflow-hidden h-full border-border/50">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                <LineChart className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Upcoming focus</h3>
                <p className="text-sm text-muted-foreground">Re-align macros for training week</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Daily calories', value: '2,050 kcal', delta: '+150 kcal' },
                { label: 'Protein target', value: '130 g', delta: '+15 g' },
                { label: 'Water reminders', value: '6x', delta: 'sync to watch' },
              ].map(({ label, value, delta }) => (
                <div key={label} className="rounded-xl border border-border/60 bg-background/60 dark:bg-background/40 p-4 hover:bg-accent/50 transition-colors">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
                  <p className="text-xs text-primary mt-1">{delta}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Draft generated from your latest check-in.
              </span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-panel shadow-medium overflow-hidden relative h-full border-border/50">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-200">
                <Flame className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Today’s boost</h3>
                <p className="text-sm text-muted-foreground">Stay within ±5% of macro targets</p>
              </div>
            </div>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                <span>Swap afternoon snack for Greek yogurt + berries (+11g protein)</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                <span>Book 20-min mobility session after dinner, refuel with 300ml electrolyte mix.</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                <span>Schedule tomorrow’s grocery pick-up; list updates automatically from meal plan.</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground/80 pt-2 border-t border-border/50">
              All previews use demo data—sign in to see recommendations generated from your journey.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </section>
);

export default LandingPreview;
