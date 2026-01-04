import { useEffect, useState } from 'react';
import AIRecommendations from './AIRecommendations';
import GroceryListGenerator from './GroceryListGenerator';
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Target, Utensils } from 'lucide-react';

const InsightsSection = () => {
  const [stats, setStats] = useState({
    mealsPlanned: 0,
    goal: 'Not Set',
    score: 85 // Mock score for now
  });

  useEffect(() => {
    const savedMeals = localStorage.getItem('weekMeals');
    const savedProfile = localStorage.getItem('userProfile');

    let count = 0;
    if (savedMeals) {
      const meals = JSON.parse(savedMeals);
      Object.values(meals).forEach((day: any) => {
        ['breakfast', 'lunch', 'dinner'].forEach(type => {
          if (day[type]) count++;
        });
      });
    }

    let goal = 'General Health';
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile.goal) goal = profile.goal.replace('-', ' ');
    }

    setStats({
      mealsPlanned: count,
      goal: goal.charAt(0).toUpperCase() + goal.slice(1),
      score: count > 15 ? 92 : 78 // Dynamic mock score
    });
  }, []);

  return (
    <section
      id="insights"
      className="relative scroll-mt-24 md:scroll-mt-28 pt-28 pb-12 bg-gradient-to-br from-forest-50/50 via-background to-background dark:from-forest-900/20 dark:via-background dark:to-background w-full overflow-x-hidden animate-fade-in"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Your Weekly Nutritional Pulse
          </h2>

          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-forest-200/50 dark:border-forest-800/50 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Meals Planned</p>
                  <p className="text-2xl font-bold">{stats.mealsPlanned} <span className="text-xs text-muted-foreground font-normal">/ 21</span></p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-forest-200/50 dark:border-forest-800/50 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Current Goal</p>
                  <p className="text-2xl font-bold capitalize">{stats.goal}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-forest-200/50 dark:border-forest-800/50 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">NutriScore</p>
                  <p className="text-2xl font-bold">{stats.score} <span className="text-xs text-muted-foreground font-normal">/ 100</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <AIRecommendations />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <GroceryListGenerator />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
