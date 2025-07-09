
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
            <h4 className="font-semibold text-gray-900 capitalize mb-2">{mealType}</h4>
            <p className="text-gray-500 text-sm mb-4">No meal planned</p>
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
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-gray-900 capitalize">{mealType}</h4>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveMeal}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-32 object-cover rounded-lg"
          />
          
          <h5 className="font-medium text-gray-900">{meal.name}</h5>
          
          <div className="flex flex-wrap gap-1">
            {meal.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {meal.cookTime} min
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {meal.servings}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>Calories: {meal.calories}</div>
            <div>Protein: {meal.protein}g</div>
            <div>Carbs: {meal.carbs}g</div>
            <div>Fats: {meal.fats}g</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-700">Ingredients:</div>
            <div className="text-xs text-gray-600">
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
