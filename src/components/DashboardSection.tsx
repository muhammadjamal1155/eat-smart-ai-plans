
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, BarChart, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardSection = () => {
  const { user } = useAuth();

  const nutritionTargets = [
    { name: 'Calories', current: 1680, target: 2000, unit: 'kcal', color: 'bg-blue-500' },
    { name: 'Protein', current: 85, target: 120, unit: 'g', color: 'bg-health-500' },
    { name: 'Carbs', current: 180, target: 250, unit: 'g', color: 'bg-orange-500' },
    { name: 'Fats', current: 65, target: 80, unit: 'g', color: 'bg-purple-500' },
  ];

  const recommendedFoods = [
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

  return (
    <section id="dashboard" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Your Personal Dashboard
          </h2>
          <p className="text-xl text-gray-600">
            Track your progress and get personalized recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Nutrition Targets */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="w-5 h-5 text-health-600" />
                  <span>Today's Nutrition Targets</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {nutritionTargets.map((target) => {
                  const percentage = (target.current / target.target) * 100;
                  return (
                    <div key={target.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{target.name}</span>
                        <span className="text-sm text-gray-600">
                          {target.current}/{target.target} {target.unit}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round(percentage)}% complete</span>
                        <span>{target.target - target.current} {target.unit} remaining</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recommended Foods */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Recommended Foods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendedFoods.map((food) => (
                    <div key={food.name} className="bg-gray-50 rounded-lg p-4 card-hover">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-gray-900 mb-2">{food.name}</h4>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{food.calories} cal</span>
                        <span>{food.protein}g protein</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {food.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Stats & Actions */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-health-600" />
                  <span>Profile Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-health-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-health-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-600">Goal: {user?.goal?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Weight Loss'}</p>
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Weight</span>
                    <span className="font-medium">{user?.weight || 68} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height</span>
                    <span className="font-medium">{user?.height || 175} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age</span>
                    <span className="font-medium">{user?.age || 25} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress</span>
                    <div className="flex items-center space-x-1">
                      <ArrowDown className="w-4 h-4 text-health-600" />
                      <span className="font-medium text-health-600">2.5 kg</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6 space-y-4">
                <Button className="w-full btn-primary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate New Meal Plan
                </Button>
                <Button variant="outline" className="w-full btn-secondary">
                  View Progress Report
                </Button>
                <Button variant="outline" className="w-full btn-secondary">
                  Update Goals
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-health-50">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-health-500 rounded-full flex items-center justify-center mx-auto">
                  <ArrowUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-health-900">Great Progress!</h4>
                <p className="text-sm text-health-700">
                  You're 70% closer to your goal this week. Keep it up!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
