
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, Clock } from 'lucide-react';

const MealPlanSection = () => {
  const mealPlan = {
    Monday: {
      breakfast: {
        name: "Greek Yogurt Parfait",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80",
        calories: 320,
        protein: 20,
        carbs: 35,
        fats: 8,
        ingredients: ["Greek yogurt", "Berries", "Granola", "Honey"]
      },
      lunch: {
        name: "Quinoa Power Bowl",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80",
        calories: 450,
        protein: 18,
        carbs: 52,
        fats: 16,
        ingredients: ["Quinoa", "Chickpeas", "Avocado", "Mixed greens"]
      },
      dinner: {
        name: "Grilled Salmon",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80",
        calories: 380,
        protein: 28,
        carbs: 25,
        fats: 18,
        ingredients: ["Salmon fillet", "Sweet potato", "Broccoli", "Olive oil"]
      }
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['breakfast', 'lunch', 'dinner'];

  const handleDownloadPlan = () => {
    // Simulate PDF download
    console.log('Downloading meal plan...');
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
          {/* Meal Plan Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-health-500 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>This Week's Meal Plan</span>
                  </CardTitle>
                  <Button variant="secondary" size="sm" onClick={handleDownloadPlan}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
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

                  {days.map((day) => (
                    <TabsContent key={day} value={day} className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        {meals.map((mealType) => {
                          const meal = day === 'Monday' ? mealPlan.Monday[mealType as keyof typeof mealPlan.Monday] : mealPlan.Monday.breakfast;
                          return (
                            <Card key={mealType} className="card-hover">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-900 capitalize">{mealType}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="w-3 h-3 mr-1" />
                                      15 min
                                    </Badge>
                                  </div>
                                  
                                  <img
                                    src={meal.image}
                                    alt={meal.name}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  
                                  <h5 className="font-medium text-gray-900">{meal.name}</h5>
                                  
                                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div>Calories: {meal.calories}</div>
                                    <div>Protein: {meal.protein}g</div>
                                    <div>Carbs: {meal.carbs}g</div>
                                    <div>Fats: {meal.fats}g</div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <div className="text-xs font-medium text-gray-700">Ingredients:</div>
                                    <div className="text-xs text-gray-600">
                                      {meal.ingredients.join(', ')}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                      
                      <div className="bg-health-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Daily Summary</h4>
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-health-600">1,150</div>
                            <div className="text-xs text-gray-600">Total Calories</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-health-600">66g</div>
                            <div className="text-xs text-gray-600">Protein</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-health-600">112g</div>
                            <div className="text-xs text-gray-600">Carbs</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-health-600">42g</div>
                            <div className="text-xs text-gray-600">Fats</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
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

            <Button className="w-full btn-primary">
              Generate New Plan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MealPlanSection;
