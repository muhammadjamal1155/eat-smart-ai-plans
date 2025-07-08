
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Camera, Target, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const QuickActions = () => {
  const handleAddMeal = () => {
    toast({
      title: "Add Meal",
      description: "Meal logging feature coming soon!",
    });
  };

  const handleScanFood = () => {
    toast({
      title: "Food Scanner",
      description: "Camera food recognition coming soon!",
    });
  };

  const handleSetGoal = () => {
    toast({
      title: "Goal Setting",
      description: "Advanced goal setting coming soon!",
    });
  };

  const handleViewTrends = () => {
    toast({
      title: "Nutrition Trends",
      description: "Detailed analytics coming soon!",
    });
  };

  const quickStats = [
    { label: 'Streak', value: '7 days', color: 'bg-green-100 text-green-800' },
    { label: 'This Week', value: '5/7 goals', color: 'bg-blue-100 text-blue-800' },
    { label: 'Avg Calories', value: '1,850', color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-health-600" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleAddMeal} className="btn-primary h-12">
            <Plus className="w-4 h-4 mr-2" />
            Add Meal
          </Button>
          <Button onClick={handleScanFood} variant="outline" className="h-12">
            <Camera className="w-4 h-4 mr-2" />
            Scan Food
          </Button>
          <Button onClick={handleSetGoal} variant="outline" className="h-12">
            <Target className="w-4 h-4 mr-2" />
            Set Goal
          </Button>
          <Button onClick={handleViewTrends} variant="outline" className="h-12">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trends
          </Button>
        </div>

        <div className="pt-4 border-t space-y-3">
          <h4 className="font-medium text-gray-900">Weekly Stats</h4>
          <div className="space-y-2">
            {quickStats.map((stat) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <Badge className={stat.color}>{stat.value}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
