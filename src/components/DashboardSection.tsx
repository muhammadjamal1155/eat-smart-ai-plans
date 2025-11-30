import React, { memo, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import NutritionChart from './NutritionChart';
import QuickActions from './QuickActions';
import NutritionTargets from './dashboard/NutritionTargets';
import ProfileSummary from './dashboard/ProfileSummary';
import RecommendedFoods from './dashboard/RecommendedFoods';
import AchievementCard from './dashboard/AchievementCard';
import ErrorBoundary from './ErrorBoundary';

const DashboardSection = memo(() => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = React.useState<any>({
    targets: [],
    weeklyData: [],
    comparison: [],
  });

  React.useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedWeekMeals = localStorage.getItem('weekMeals');

    const userProfile = savedProfile ? JSON.parse(savedProfile) : null;
    const weekMeals = savedWeekMeals ? JSON.parse(savedWeekMeals) : {};

    // 1. Targets
    const targetCalories = userProfile?.target_calories || 2000;
    const targetProtein = userProfile?.target_protein || 150;
    const targetCarbs = userProfile?.target_carbs || 250;
    const targetFats = userProfile?.target_fats || 70;

    const targets = [
      { name: 'Calories', current: 0, target: targetCalories, unit: 'kcal', color: 'bg-blue-500' },
      { name: 'Protein', current: 0, target: targetProtein, unit: 'g', color: 'bg-primary' },
      { name: 'Carbs', current: 0, target: targetCarbs, unit: 'g', color: 'bg-orange-500' },
      { name: 'Fats', current: 0, target: targetFats, unit: 'g', color: 'bg-purple-500' },
    ];

    // 2. Weekly Data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekly = days.map(day => {
      const dayMeals = weekMeals[day] || { breakfast: null, lunch: null, dinner: null };
      const meals = [dayMeals.breakfast, dayMeals.lunch, dayMeals.dinner].filter(Boolean);
      const cals = meals.reduce((sum: number, m: any) => sum + m.calories, 0);
      const prot = meals.reduce((sum: number, m: any) => sum + m.protein, 0);
      return { day: day.substring(0, 3), calories: cals, protein: prot };
    });

    // 3. Today's Data (Comparison)
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

    setDashboardData({ targets, weeklyData: weekly, comparison });
    // 4. Dynamic Achievement
    let achievement = {
      title: 'Get Started',
      message: 'Start logging your meals to track progress.',
      progress: 0,
      icon: 'target' as const,
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
          icon: 'trophy' as const,
          action: { label: 'View Insights', onClick: () => window.location.href = '/insights' }
        };
      } else if (ratio < 0.9) {
        achievement = {
          title: 'Fuel Up',
          message: `You're at ${percentage}%. Try a healthy snack to reach your goal.`,
          progress: percentage,
          icon: 'progress' as const,
          action: { label: 'Find Snacks', onClick: () => window.location.href = '/meal-plans' }
        };
      } else {
        achievement = {
          title: 'Watch Calories',
          message: `You're at ${percentage}%. Consider a lighter dinner.`,
          progress: percentage,
          icon: 'target' as const,
          action: { label: 'Adjust Plan', onClick: () => window.location.href = '/meal-plans' }
        };
      }
    }

    // 5. Dynamic Recommendations (Fetch from API)
    const fetchRecommendations = async () => {
      const fallbackFoods = [
        {
          name: 'Grilled Salmon',
          image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80',
          calories: 206,
          protein: 22,
          benefits: ['High Omega-3', 'Heart Healthy']
        },
        {
          name: 'Quinoa Bowl',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
          calories: 168,
          protein: 14,
          benefits: ['Complete Protein', 'Fiber Rich']
        },
        {
          name: 'Greek Yogurt',
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80',
          calories: 130,
          protein: 20,
          benefits: ['Probiotics', 'Calcium']
        },
      ];

      if (!userProfile) {
        setDashboardData((prev: any) => ({ ...prev, recommendedFoods: fallbackFoods }));
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            age: userProfile.age || 30,
            weight: userProfile.weight || 70,
            height: userProfile.height || 170,
            gender: userProfile.gender || 'female',
            goal: userProfile.goal || 'maintenance',
            activity_level: userProfile.activityLevel || 'moderate',
            diet_type: userProfile.dietaryPreference || 'any',
            allergies: userProfile.allergies || []
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.meals && data.meals.length > 0) {
            const mappedMeals = data.meals.slice(0, 3).map((meal: any) => ({
              name: meal.name,
              image: meal.image,
              calories: meal.calories,
              protein: meal.protein,
              benefits: meal.tags ? meal.tags.slice(0, 2) : ['Healthy'],
            }));
            setDashboardData((prev: any) => ({ ...prev, recommendedFoods: mappedMeals }));
          } else {
            setDashboardData((prev: any) => ({ ...prev, recommendedFoods: fallbackFoods }));
          }
        } else {
          console.warn("Recommendation API returned error status:", response.status);
          setDashboardData((prev: any) => ({ ...prev, recommendedFoods: fallbackFoods }));
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        setDashboardData((prev: any) => ({ ...prev, recommendedFoods: fallbackFoods }));
      }
    };

    fetchRecommendations();

    setDashboardData({ targets, weeklyData: weekly, comparison, achievement, recommendedFoods: [] });
  }, []);

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
              <RecommendedFoods foods={dashboardData.recommendedFoods || []} />
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
