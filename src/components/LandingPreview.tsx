import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Flame, LineChart, Sparkles } from 'lucide-react';

const LandingPreview = () => (
  <section className="py-14">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="glass-panel shadow-medium overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-forest-100 text-forest-600 dark:bg-forest-900/60 dark:text-forest-100">
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
              <div key={label} className="rounded-xl border border-border/60 bg-background/60 dark:bg-background/40 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
                <p className="text-xs text-forest-500 dark:text-forest-200 mt-1">{delta}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-forest-500" />
              Draft generated from your latest check-in.
            </span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel shadow-medium overflow-hidden relative">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-forest-100 text-forest-600 dark:bg-forest-900/60 dark:text-forest-100">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Today’s boost</h3>
              <p className="text-sm text-muted-foreground">Stay within ±5% of macro targets</p>
            </div>
          </div>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-forest-500" />
              Swap afternoon snack for Greek yogurt + berries (+11g protein)
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-forest-500" />
              Book 20-min mobility session after dinner, refuel with 300ml electrolyte mix.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-forest-500" />
              Schedule tomorrow’s grocery pick-up; list updates automatically from meal plan.
            </li>
          </ul>
          <p className="text-xs text-muted-foreground/80">
            All previews use demo data—sign in to see recommendations generated from your journey.
          </p>
        </CardContent>
      </Card>
    </div>
  </section>
);

export default LandingPreview;
