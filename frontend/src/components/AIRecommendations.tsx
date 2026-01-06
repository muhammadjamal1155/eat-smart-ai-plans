
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, TrendingUp, Clock, Target, Lightbulb } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/api';

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

    try {
      const savedProfile = localStorage.getItem('userProfile');
      const savedMeals = localStorage.getItem('weekMeals');

      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      const meals = savedMeals ? JSON.parse(savedMeals) : {};

      const response = await fetch(getApiUrl('/insights/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, meals })
      });

      if (!response.ok) throw new Error('Failed to analyze insights');

      const data = await response.json();

      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
        toast({
          title: "New Insights Generated!",
          description: "Your personal nutritionist has analyzed your plan.",
        });
      }

    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not connect to the AI nutritionist.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecommendationAction = (recommendation: Recommendation) => {
    // Dynamic handling based on recommendation type or text content
    const actionLower = recommendation.actionText.toLowerCase();

    if (actionLower.includes('meal') || actionLower.includes('plan') || recommendation.type === 'meal') {
      toast({
        title: "Redirecting to Meal Plans",
        description: "Opening your meal planner...",
      });
      window.location.href = '/meal-plans';
      return;
    }

    if (actionLower.includes('track') || actionLower.includes('water') || actionLower.includes('reminder') || recommendation.type === 'habit') {
      toast({
        title: "Habit Tracking",
        description: "Opening hydration & habit tracker...",
      });
      // Ideally this would go to a specific tracker page, defaulting to meal plans or dashboard for now
      window.location.href = '/meal-plans';
      return;
    }

    if (actionLower.includes('goal') || actionLower.includes('calor') || recommendation.type === 'goal') {
      toast({
        title: "Redirecting to Profile",
        description: "Let's review your goals.",
      });
      window.location.href = '/#nutrition-form';
      return;
    }

    if (actionLower.includes('grocery') || actionLower.includes('food') || recommendation.type === 'nutrition') {
      toast({
        title: "Redirecting to Groceries",
        description: "Checking your grocery list...",
      });
      // Scroll to grocery section if on same page, or redirect
      const grocerySection = document.getElementById('grocery-list');
      if (grocerySection) {
        grocerySection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback if we split pages later
        window.location.href = '/insights';
      }
      return;
    }

    // Default fallback
    toast({
      title: "Action Started",
      description: `Navigating to help you with: ${recommendation.title}`,
    });
    window.location.href = '/meal-plans';
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
    <Card className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm transition-colors overflow-hidden h-[650px] flex flex-col">
      <CardHeader className="border-b border-border/70 pb-4 bg-muted/20">
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
            {isGenerating ? 'Analyzing...' : 'Refresh Insights'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="group relative flex flex-col justify-between p-5 border border-border/70 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-300 hover:shadow-md hover:border-forest-200 dark:hover:border-forest-800 h-full"
            >
              <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl opacity-80 ${rec.impact === 'high' ? 'bg-red-500' :
                rec.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground group-hover:text-forest-600 group-hover:bg-forest-50 dark:group-hover:bg-forest-900/20 transition-colors">
                    {getTypeIcon(rec.type)}
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
                    {rec.category}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
                    {rec.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {rec.description}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="w-full justify-between group-hover:bg-primary/5 group-hover:text-primary transition-colors text-xs"
                onClick={() => handleRecommendationAction(rec)}
              >
                <span className="truncate mr-2">{rec.actionText}</span>
                <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
