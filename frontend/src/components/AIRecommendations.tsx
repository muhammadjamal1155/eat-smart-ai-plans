
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, TrendingUp, Clock, Target, Lightbulb } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Recommendation {
  id: string;
  type: 'meal' | 'nutrition' | 'habit' | 'goal';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionText: string;
}

const AIRecommendations = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      type: 'meal',
      title: 'Add More Protein at Breakfast',
      description: 'Based on your current intake, adding 15g more protein at breakfast could help you reach your daily goals.',
      impact: 'high',
      category: 'Nutrition',
      actionText: 'View Protein-Rich Meals'
    },
    {
      id: '2',
      type: 'nutrition',
      title: 'Increase Fiber Intake',
      description: 'You\'re currently getting 18g of fiber daily. Aim for 25-30g to improve digestive health.',
      impact: 'medium',
      category: 'Health',
      actionText: 'Find High-Fiber Foods'
    },
    {
      id: '3',
      type: 'habit',
      title: 'Meal Prep Sunday',
      description: 'Preparing meals in advance could save you 2 hours per week and improve consistency.',
      impact: 'high',
      category: 'Efficiency',
      actionText: 'Create Prep Plan'
    },
    {
      id: '4',
      type: 'goal',
      title: 'Hydration Reminder',
      description: 'Drinking more water before meals can help with satiety and weight management.',
      impact: 'medium',
      category: 'Wellness',
      actionText: 'Set Reminders'
    }
  ]);

  const generateNewRecommendations = async () => {
    setIsGenerating(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newRecommendations: Recommendation[] = [];

    try {
      const savedProfile = localStorage.getItem('userProfile');
      const savedMeals = localStorage.getItem('weekMeals');

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);

        // Goal based recommendation
        if (profile.goal) {
          const goalText = profile.goal.replace('-', ' ');
          newRecommendations.push({
            id: 'rec-goal',
            type: 'goal',
            title: `Focus on ${goalText}`,
            description: `Your current plan is optimized for ${goalText}. Stick to your daily calorie target of ${Math.round(profile.target_calories)} kcal.`,
            impact: 'high',
            category: 'Wellness',
            actionText: 'View Goal Details'
          });
        }

        // Hydration recommendation
        if (profile.waterIntake) {
          newRecommendations.push({
            id: 'rec-water',
            type: 'habit',
            title: 'Hydration Goal',
            description: `Don't forget to drink ${profile.waterIntake}L of water daily to support your metabolism and energy levels.`,
            impact: 'medium',
            category: 'Health',
            actionText: 'Set Reminders'
          });
        }
      }

      if (savedMeals) {
        const weekMeals = JSON.parse(savedMeals);
        let totalMeals = 0;
        let uniqueIngredients = new Set();

        Object.values(weekMeals).forEach((day: any) => {
          ['breakfast', 'lunch', 'dinner'].forEach(type => {
            if (day[type]) {
              totalMeals++;
              if (day[type].ingredients) {
                day[type].ingredients.forEach((ing: string) => uniqueIngredients.add(ing));
              }
            }
          });
        });

        if (totalMeals < 15) {
          newRecommendations.push({
            id: 'rec-plan',
            type: 'meal',
            title: 'Complete Your Week',
            description: `You have only planned ${totalMeals} meals. Try to plan at least 15 meals for a complete week.`,
            impact: 'high',
            category: 'Efficiency',
            actionText: 'Go to Meal Planner'
          });
        } else {
          newRecommendations.push({
            id: 'rec-variety',
            type: 'nutrition',
            title: 'Great Variety!',
            description: `You have a diverse menu with over ${uniqueIngredients.size} different ingredients this week.`,
            impact: 'low',
            category: 'Nutrition',
            actionText: 'View Grocery List'
          });
        }
      }

      if (newRecommendations.length === 0) {
        newRecommendations.push({
          id: 'rec-default',
          type: 'goal',
          title: 'Get Started',
          description: 'Complete your nutrition profile and add meals to your plan to get personalized insights.',
          impact: 'high',
          category: 'Getting Started',
          actionText: 'Update Profile'
        });
      }

    } catch (error) {
      console.error("Error generating recommendations:", error);
    }

    setRecommendations(prev => [...newRecommendations, ...prev.slice(0, 2)]); // Keep some old ones
    setIsGenerating(false);

    toast({
      title: "New Recommendations Generated!",
      description: "AI has analyzed your recent data and created personalized suggestions.",
    });
  };

  const handleRecommendationAction = (recommendation: Recommendation) => {
    switch (recommendation.actionText) {
      case 'View Protein-Rich Meals':
      case 'Find High-Fiber Foods':
      case 'View Goal Details':
      case 'Go to Meal Planner':
        toast({
          title: "Redirecting to Meal Plans",
          description: `Searching for ${recommendation.actionText.toLowerCase().replace('view ', '').replace('find ', '')}...`,
        });
        window.location.href = '/meal-plans'; // Navigate to meal plans page
        break;
      case 'Create Prep Plan':
        toast({
          title: "Redirecting to Meal Plans",
          description: "Start building your prep plan!",
        });
        window.location.href = '/meal-plans'; // Navigate to meal plans page
        break;
      case 'Set Reminders':
        toast({
          title: "Navigating to Reminders",
          description: "Reminder functionality is coming soon!",
        });
        window.location.href = '/reminders';
        break;
      case 'Update Profile':
        window.location.href = '/#nutrition-form';
        break;
      default:
        toast({
          title: "Action Started",
          description: `Working on: ${recommendation.title}`,
        });
        break;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-destructive/15 text-destructive border-destructive/30';
      case 'medium':
        return 'bg-warning/15 text-warning border-warning/30';
      case 'low':
        return 'bg-success/15 text-success border-success/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Target className="w-4 h-4" />;
      case 'nutrition': return <TrendingUp className="w-4 h-4" />;
      case 'habit': return <Clock className="w-4 h-4" />;
      case 'goal': return <Lightbulb className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <Card className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm transition-colors">
      <CardHeader className="border-b border-border/70 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-forest-500" />
            <span>AI Recommendations</span>
          </CardTitle>
          <Button
            onClick={generateNewRecommendations}
            disabled={isGenerating}
            size="sm"
            className="btn-primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="border border-border/70 rounded-lg bg-background/60 dark:bg-background/40 p-3 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {getTypeIcon(rec.type)}
                  <h4 className="font-semibold text-foreground text-sm truncate">{rec.title}</h4>
                </div>
                <Badge
                  variant="outline"
                  className={`${getImpactColor(rec.impact)} text-xs whitespace-nowrap backdrop-blur-sm`}
                >
                  {rec.impact}
                </Badge>
              </div>

              <div className="flex justify-end">
                <Badge
                  variant="secondary"
                  className="text-xs bg-forest-100 text-forest-700 dark:bg-forest-900/60 dark:text-forest-100 border border-border/60"
                >
                  {rec.category}
                </Badge>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-3 mt-3">{rec.description}</p>

            <Button
              size="sm"
              variant="outline"
              className="w-full border-border/70 hover:bg-forest-100/60 dark:hover:bg-forest-900/30"
              onClick={() => handleRecommendationAction(rec)}
            >
              {rec.actionText}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
