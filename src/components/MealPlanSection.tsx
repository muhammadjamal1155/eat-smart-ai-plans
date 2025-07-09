
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, Shuffle, ShoppingCart } from 'lucide-react';
import MealPlanCard from './MealPlanCard';
import { toast } from '@/hooks/use-toast';

interface Meal {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  cookTime: number;
  servings: number;
  tags: string[];
  ingredients: string[];
}

interface DayMeals {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
}

const MealPlanSection = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [weekMeals, setWeekMeals] = useState<Record<string, DayMeals>>({
    Monday: {
      breakfast: {
        id: '1',
        name: 'Greek Yogurt Parfait',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80',
        calories: 320,
        protein: 20,
        carbs: 35,
        fats: 8,
        cookTime: 5,
        servings: 1,
        tags: ['healthy', 'quick', 'vegetarian'],
        ingredients: ['Greek yogurt', 'Berries', 'Granola', 'Honey']
      },
      lunch: null,
      dinner: null
    },
    Tuesday: { breakfast: null, lunch: null, dinner: null },
    Wednesday: { breakfast: null, lunch: null, dinner: null },
    Thursday: { breakfast: null, lunch: null, dinner: null },
    Friday: { breakfast: null, lunch: null, dinner: null },
    Saturday: { breakfast: null, lunch: null, dinner: null },
    Sunday: { breakfast: null, lunch: null, dinner: null }
  });

  const handleMealChange = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner', meal: Meal | null) => {
    setWeekMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: meal
      }
    }));
  };

  const calculateDailySummary = (dayMeals: DayMeals) => {
    const meals = [dayMeals.breakfast, dayMeals.lunch, dayMeals.dinner].filter(Boolean) as Meal[];
    return meals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.calories,
        protein: total.protein + meal.protein,
        carbs: total.carbs + meal.carbs,
        fats: total.fats + meal.fats
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const handleDownloadPlan = () => {
    toast({
      title: "Download Started",
      description: "Your meal plan PDF is being generated...",
    });
  };

  const handleGenerateNewPlan = () => {
    toast({
      title: "New Plan Generated",
      description: "AI has created a new personalized meal plan for you!",
    });
  };

  const handleGenerateShoppingList = () => {
    toast({
      title: "Shopping List Ready",
      description: "Your grocery list has been generated based on your meal plan.",
    });
  };

  return (
    <section id="meal-plans" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Your Personalized Meal Plans
          </h2>
          <p className="text-xl text-gray-600">
            AI-generated meal plans tailored to your goals and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-health-500 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>This Week's Meal Plan</span>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={handleGenerateShoppingList}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Shopping List
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleDownloadPlan}>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="Monday" className="w-full">
                  <TabsList className="grid grid-cols-7 mb-6">
                    {days.map((day) => (
                      <TabsTrigger key={day} value={day} className="text-xs">
                        {day.slice(0, 3)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {days.map((day) => {
                    const dayMeals = weekMeals[day];
                    const summary = calculateDailySummary(dayMeals);
                    
                    return (
                      <TabsContent key={day} value={day} className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          <MealPlanCard
                            mealType="breakfast"
                            meal={dayMeals.breakfast}
                            onMealChange={(meal) => handleMealChange(day, 'breakfast', meal)}
                          />
                          <MealPlanCard
                            mealType="lunch"
                            meal={dayMeals.lunch}
                            onMealChange={(meal) => handleMealChange(day, 'lunch', meal)}
                          />
                          <MealPlanCard
                            mealType="dinner"
                            meal={dayMeals.dinner}
                            onMealChange={(meal) => handleMealChange(day, 'dinner', meal)}
                          />
                        </div>
                        
                        <div className="bg-health-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Daily Summary</h4>
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-health-600">{summary.calories}</div>
                              <div className="text-xs text-gray-600">Total Calories</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-health-600">{summary.protein}g</div>
                              <div className="text-xs text-gray-600">Protein</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-health-600">{summary.carbs}g</div>
                              <div className="text-xs text-gray-600">Carbs</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-health-600">{summary.fats}g</div>
                              <div className="text-xs text-gray-600">Fats</div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Calorie Target</span>
                    <span className="font-medium">8,050 kcal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Protein Goal</span>
                    <span className="font-medium">462g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fiber Target</span>
                    <span className="font-medium">175g</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-blue-50">
              <CardContent className="p-6 space-y-3">
                <h4 className="font-semibold text-blue-900">Meal Prep Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Prep quinoa in batches</li>
                  <li>• Pre-cut vegetables Sunday</li>
                  <li>• Marinate proteins overnight</li>
                  <li>• Use glass containers for storage</li>
                </ul>
              </CardContent>
            </Card>

            <Button className="w-full btn-primary" onClick={handleGenerateNewPlan}>
              <Shuffle className="w-4 h-4 mr-2" />
              Generate New Plan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MealPlanSection;
