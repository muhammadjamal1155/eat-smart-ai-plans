
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Edit3, Trash2 } from 'lucide-react';
import MealSearchDialog from './MealSearchDialog';
import { toast } from '@/hooks/use-toast';
import { getFallbackImage } from '@/lib/utils';

interface Meal {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  cookTime: number;
  time?: string;
  servings: number;
  tags: string[];
  ingredients: string[];
  steps?: string[];
}

interface MealPlanCardProps {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  meal: Meal | null;
  onMealChange: (meal: Meal | null) => void;
  onEdit?: () => void;
  onViewDetails?: () => void;
}

import { useAuth } from '@/hooks/use-auth';
import { analyticsService } from '@/services/analytics';
import { Check, Plus } from 'lucide-react';

const MealPlanCard = ({ mealType, meal, onMealChange, onEdit, onViewDetails }: MealPlanCardProps) => {
  const { user } = useAuth();
  const [isLogging, setIsLogging] = useState(false);

  const handleRemoveMeal = () => {
    onMealChange(null);
    toast({
      title: "Meal Removed",
      description: `${meal?.name || 'Meal'} has been removed from your ${mealType} plan.`,
    });
  };

  const handleLogMeal = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (!meal || !user?.id) {
      if (!user?.id) toast({ title: "Login Required", description: "Please login to log meals.", variant: "destructive" });
      return;
    }

    setIsLogging(true);
    try {
      await analyticsService.logMeal(user.id, {
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        name: meal.name
      });
      toast({
        title: "Meal Logged!",
        description: `${meal.name} added to your daily totals.`,
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to log meal.", variant: "destructive" });
    } finally {
      setIsLogging(false);
    }
  };

  const handleMealSelect = (selectedMeal: Meal) => {
    onMealChange(selectedMeal);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, id: string) => {
    e.currentTarget.src = getFallbackImage(id);
    e.currentTarget.onerror = null;
  };

  if (!meal) {
    return (
      <Card className="h-full border-2 border-dashed border-gray-300 hover:border-health-400 transition-colors">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <h4 className="font-semibold text-foreground capitalize mb-2 text-sm">{mealType}</h4>
            <p className="text-muted-foreground text-sm mb-4">No meal planned</p>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Add Meal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full group hover:scale-[1.02] transition-transform duration-200 ease-out animate-in fade-in slide-in-from-bottom-2">
      <CardContent className="p-4 h-full">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-foreground capitalize text-sm">{mealType}</h4>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-7 w-7 p-0"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveMeal}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive/80"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="relative cursor-pointer" onClick={onViewDetails}>
            <img
              src={meal.image && !meal.image.includes('placeholder') ? meal.image : getFallbackImage(meal.id)}
              alt={meal.name}
              onError={(e) => handleImageError(e, meal.id)}
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">View Details</span>
            </div>
          </div>

          <h5 className="font-medium text-foreground text-sm leading-tight cursor-pointer hover:text-primary" onClick={onViewDetails}>{meal.name}</h5>

          <div className="flex flex-wrap gap-1">
            {meal.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{meal.cookTime} min</span>
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{meal.servings}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
            <div className="truncate">Cal: {meal.calories}</div>
            <div className="truncate">Pro: {meal.protein}g</div>
            <div className="truncate">Carb: {meal.carbs}g</div>
            <div className="truncate">Fat: {meal.fats}g</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-medium text-foreground">Ingredients:</div>
            <div className="text-xs text-muted-foreground leading-tight">
              {meal.ingredients.slice(0, 3).join(', ')}
              {meal.ingredients.length > 3 && '...'}
            </div>
          </div>

          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                className="flex-1 bg-[#C5D86D] text-black hover:bg-[#B5C85D] h-8 text-xs font-medium"
                onClick={onViewDetails}
              >
                View Recipe
              </Button>
            )}
            <Button
              className="flex-1 h-8 text-xs font-medium"
              variant="outline"
              onClick={handleLogMeal}
              disabled={isLogging}
            >
              {isLogging ? <span className="animate-spin">..</span> : <Plus className="w-3 h-3 mr-1" />}
              Log
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanCard;
