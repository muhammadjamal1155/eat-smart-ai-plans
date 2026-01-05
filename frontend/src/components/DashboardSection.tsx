import React, { memo, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { analyticsService } from '@/services/analytics';
import NutritionChart from './NutritionChart';
import QuickActions from './QuickActions';
import NutritionTargets from './dashboard/NutritionTargets';
import ProfileSummary from './dashboard/ProfileSummary';
import RecommendedFoods from './dashboard/RecommendedFoods';
import AchievementCard from './dashboard/AchievementCard';
import ErrorBoundary from './ErrorBoundary';

const DashboardSection = memo(() => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [dashboardData, setDashboardData] = React.useState<any>({
    targets: [],
    weeklyData: [],
    comparison: [],
    recommendedFoods: []
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        // 1. Fetch Plan from Backend
        let weekMeals: any = {};
        try {
          const planData = await analyticsService.getPlan(user.id);
          if (planData && planData.plan_data) {
            weekMeals = planData.plan_data;
          }
        } catch (error) {
          console.error("Failed to fetch plan:", error);
          // Fallback to local storage or empty if offline/error
          const savedWeekMeals = localStorage.getItem('weekMeals');
          weekMeals = savedWeekMeals ? JSON.parse(savedWeekMeals) : {};
        }

        // 2. Targets (from user profile)
        const targetCalories = user.nutrition?.calories || 2000;
        const targetProtein = user.nutrition?.protein || 150;
        const targetCarbs = user.nutrition?.carbs || 250;
        const targetFats = user.nutrition?.fats || 70;

        const targets = [
          { name: 'Calories', current: 0, target: targetCalories, unit: 'kcal', color: 'bg-blue-500' },
          { name: 'Protein', current: 0, target: targetProtein, unit: 'g', color: 'bg-primary' },
          { name: 'Carbs', current: 0, target: targetCarbs, unit: 'g', color: 'bg-orange-500' },
          { name: 'Fats', current: 0, target: targetFats, unit: 'g', color: 'bg-purple-500' },
        ];

        // 3. Weekly Data Calculation
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weekly = days.map(day => {
          const dayMeals = weekMeals[day] || { breakfast: null, lunch: null, dinner: null };
          const meals = [dayMeals.breakfast, dayMeals.lunch, dayMeals.dinner].filter(Boolean);
          const cals = meals.reduce((sum: number, m: any) => sum + m.calories, 0);
          const prot = meals.reduce((sum: number, m: any) => sum + m.protein, 0);
          return { day: day.substring(0, 3), calories: cals, protein: prot };
        });

        // 4. Today's Data (Comparison)
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayMeals = weekMeals[today] || { breakfast: null, lunch: null, dinner: null };
        const tMeals = [todayMeals.breakfast, todayMeals.lunch, todayMeals.dinner].filter(Boolean);

        const currentCals = tMeals.reduce((sum: number, m: any) => sum + m.calories, 0);
        const currentProt = tMeals.reduce((sum: number, m: any) => sum + m.protein, 0);
        const currentCarbs = tMeals.reduce((sum: number, m: any) => sum + m.carbs, 0);
        const currentFats = tMeals.reduce((sum: number, m: any) => sum + m.fats, 0);

        // Update current values in targets array
        targets[0].current = currentCals;
        targets[1].current = currentProt;
        targets[2].current = currentCarbs;
        targets[3].current = currentFats;

        const comparison = [
          { nutrient: 'Calories', current: currentCals, target: targetCalories },
          { nutrient: 'Protein', current: currentProt, target: targetProtein },
          { nutrient: 'Carbs', current: currentCarbs, target: targetCarbs },
          { nutrient: 'Fats', current: currentFats, target: targetFats },
        ];

        // 5. Dynamic Achievement
        let achievement: any = {
          title: 'Get Started',
          message: 'Start logging your meals to track progress.',
          progress: 0,
          icon: 'target',
          action: { label: 'Log Meal', onClick: () => window.location.href = '/meal-plans' }
        };

        if (currentCals > 0) {
          const ratio = currentCals / targetCalories;
          const percentage = Math.min(Math.round(ratio * 100), 100);

          if (ratio >= 0.9 && ratio <= 1.1) {
            achievement = {
              title: 'On Track!',
              message: `You've hit ${percentage}% of your calorie goal. Great job!`,
              progress: percentage,
              icon: 'trophy',
              action: { label: 'View Insights', onClick: () => window.location.href = '/insights' }
            };
          } else if (ratio < 0.9) {
            achievement = {
              title: 'Fuel Up',
              message: `You're at ${percentage}%. Try a healthy snack to reach your goal.`,
              progress: percentage,
              icon: 'progress',
              action: { label: 'Find Snacks', onClick: () => window.location.href = '/meal-plans' }
            };
          } else {
            achievement = {
              title: 'Watch Calories',
              message: `You're at ${percentage}%. Consider a lighter dinner.`,
              progress: percentage,
              icon: 'target',
              action: { label: 'Adjust Plan', onClick: () => window.location.href = '/meal-plans' }
            };
          }
        }

        // 6. Dynamic Recommendations (Fetch from API)
        // Use user profile data directly
        const fallbackFoods = [
          {
            name: 'Grilled Salmon',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80',
            calories: 206,
            protein: 22,
            benefits: ['High Omega-3', 'Heart Healthy']
          },
          // ... (rest of fallback foods could be kept or reduced)
        ];

        let recommendedFoods = fallbackFoods;

        try {
          const response = await fetch('http://localhost:5000/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              age: user.age,
              weight: user.weight,
              height: user.height,
              gender: user.gender || 'female',
              goal: user.goal || 'maintenance',
              activity_level: user.lifestyle?.activityLevel || 'moderate',
              diet_type: user.lifestyle?.dietaryPreference || 'any',
              allergies: user.lifestyle?.allergies || []
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.meals && data.meals.length > 0) {
              recommendedFoods = data.meals.slice(0, 3).map((meal: any) => ({
                name: meal.name,
                image: meal.image,
                calories: meal.calories,
                protein: meal.protein,
                benefits: meal.tags ? meal.tags.slice(0, 2) : ['Healthy'],
              }));
            }
          }
        } catch (err) {
          console.warn("Using fallback recommendations due to API error");
        }

        setDashboardData({ targets, weeklyData: weekly, comparison, achievement, recommendedFoods });

      } catch (error) {
        console.error("Dashboard data load failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  return (
    <ErrorBoundary>
      <section id="dashboard" className="scroll-mt-24 md:scroll-mt-28 py-20 relative transition-colors duration-300 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground">
              Your Personal Dashboard
            </h2>
            <p className="text-xl text-muted-foreground">
              Track your progress and get personalized recommendations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Nutrition Targets */}
              <NutritionTargets targets={dashboardData.targets} />

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Chart unavailable</div>}>
                  <NutritionChart
                    type="line"
                    data={dashboardData.weeklyData}
                    title="Weekly Progress"
                  />
                </ErrorBoundary>
                <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Chart unavailable</div>}>
                  <NutritionChart
                    type="bar"
                    data={dashboardData.comparison}
                    title="Today vs Targets"
                  />
                </ErrorBoundary>
              </div>

              {/* Recommended Foods */}
              <RecommendedFoods foods={dashboardData.recommendedFoods || []} isLoading={isLoading} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Profile Summary */}
              <ProfileSummary user={user} />

              {/* Quick Actions */}
              <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Quick actions unavailable</div>}>
                <QuickActions />
              </ErrorBoundary>

              {/* Achievement Card */}
              <AchievementCard achievement={dashboardData.achievement} />
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
});

DashboardSection.displayName = 'DashboardSection';

export default DashboardSection;
