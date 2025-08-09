
import React, { memo, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NutritionChart from './NutritionChart';
import QuickActions from './QuickActions';
import NutritionTargets from './dashboard/NutritionTargets';
import ProfileSummary from './dashboard/ProfileSummary';
import RecommendedFoods from './dashboard/RecommendedFoods';
import AchievementCard from './dashboard/AchievementCard';
import ErrorBoundary from './ErrorBoundary';

const DashboardSection = memo(() => {
  const { user } = useAuth();

  const nutritionTargets = useMemo(() => [
    { name: 'Calories', current: 1680, target: 2000, unit: 'kcal', color: 'bg-blue-500' },
    { name: 'Protein', current: 85, target: 120, unit: 'g', color: 'bg-primary' },
    { name: 'Carbs', current: 180, target: 250, unit: 'g', color: 'bg-orange-500' },
    { name: 'Fats', current: 65, target: 80, unit: 'g', color: 'bg-purple-500' },
  ], []);

  const weeklyData = useMemo(() => [
    { day: 'Mon', calories: 1800, protein: 95 },
    { day: 'Tue', calories: 1650, protein: 88 },
    { day: 'Wed', calories: 1900, protein: 102 },
    { day: 'Thu', calories: 1750, protein: 91 },
    { day: 'Fri', calories: 1680, protein: 85 },
    { day: 'Sat', calories: 1820, protein: 98 },
    { day: 'Sun', calories: 1720, protein: 89 },
  ], []);

  const nutritionComparison = useMemo(() => [
    { nutrient: 'Calories', current: 1680, target: 2000 },
    { nutrient: 'Protein', current: 85, target: 120 },
    { nutrient: 'Carbs', current: 180, target: 250 },
    { nutrient: 'Fats', current: 65, target: 80 },
  ], []);

  const recommendedFoods = useMemo(() => [
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
  ], []);

  return (
    <ErrorBoundary>
      <section id="dashboard" className="scroll-mt-24 md:scroll-mt-28 py-20 bg-background transition-colors duration-300">
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
              <NutritionTargets targets={nutritionTargets} />

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Chart unavailable</div>}>
                  <NutritionChart 
                    type="line" 
                    data={weeklyData} 
                    title="Weekly Progress" 
                  />
                </ErrorBoundary>
                <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Chart unavailable</div>}>
                  <NutritionChart 
                    type="bar" 
                    data={nutritionComparison} 
                    title="Today vs Targets" 
                  />
                </ErrorBoundary>
              </div>

              {/* Recommended Foods */}
              <RecommendedFoods foods={recommendedFoods} />
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
              <AchievementCard />
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
});

DashboardSection.displayName = 'DashboardSection';

export default DashboardSection;
