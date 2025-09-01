
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Edit3, Trash2 } from 'lucide-react';
import MealSearchDialog from './MealSearchDialog';
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

interface MealPlanCardProps {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  meal: Meal | null;
  onMealChange: (meal: Meal | null) => void;
}

const MealPlanCard = ({ mealType, meal, onMealChange }: MealPlanCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleRemoveMeal = () => {
    onMealChange(null);
    toast({
      title: "Meal Removed",
      description: `${meal?.name || 'Meal'} has been removed from your ${mealType} plan.`,
    });
  };

  const handleMealSelect = (selectedMeal: Meal) => {
    onMealChange(selectedMeal);
    setIsEditing(false);
  };

  if (!meal) {
    return (
      <Card className="h-full border-2 border-dashed border-gray-300 hover:border-health-400 transition-colors">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <h4 className="font-semibold text-foreground capitalize mb-2 text-sm">{mealType}</h4>
            <p className="text-muted-foreground text-sm mb-4">No meal planned</p>
          </div>
          <MealSearchDialog
            mealType={mealType}
            onSelectMeal={handleMealSelect}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-4 h-full">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-foreground capitalize text-sm">{mealType}</h4>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
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
          
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-32 object-cover rounded-lg"
          />
          
          <h5 className="font-medium text-foreground text-sm leading-tight">{meal.name}</h5>
          
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

          {isEditing && (
            <div className="pt-2 border-t">
              <MealSearchDialog
                mealType={mealType}
                onSelectMeal={handleMealSelect}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanCard;
