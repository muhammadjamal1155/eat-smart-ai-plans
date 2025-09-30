
import { useState } from 'react';
import { Search, Filter, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

interface MealSearchDialogProps {
  onSelectMeal: (meal: Meal) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MealSearchDialog = ({ onSelectMeal, mealType, isOpen, onOpenChange }: MealSearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const sampleMeals: Meal[] = [
    {
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
    {
      id: '2',
      name: 'Avocado Toast',
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=300&q=80',
      calories: 280,
      protein: 12,
      carbs: 30,
      fats: 16,
      cookTime: 10,
      servings: 1,
      tags: ['healthy', 'vegan', 'quick'],
      ingredients: ['Avocado', 'Whole grain bread', 'Tomato', 'Salt', 'Pepper']
    },
    {
      id: '3',
      name: 'Quinoa Power Bowl',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
      calories: 450,
      protein: 18,
      carbs: 52,
      fats: 16,
      cookTime: 25,
      servings: 2,
      tags: ['healthy', 'protein-rich', 'vegan'],
      ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Mixed greens']
    },
    {
      id: '4',
      name: 'Grilled Salmon',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80',
      calories: 380,
      protein: 28,
      carbs: 25,
      fats: 18,
      cookTime: 20,
      servings: 1,
      tags: ['protein-rich', 'healthy', 'keto-friendly'],
      ingredients: ['Salmon fillet', 'Sweet potato', 'Broccoli', 'Olive oil']
    }
  ];

  const filteredMeals = sampleMeals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesFilter = selectedFilter === 'all' || meal.tags.includes(selectedFilter);
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectMeal = (meal: Meal) => {
    onSelectMeal(meal);
    onOpenChange(false);
    toast({
      title: "Meal Added",
      description: `${meal.name} has been added to your ${mealType} plan.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose {mealType} meal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search meals or ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'healthy', 'quick', 'protein-rich', 'vegan'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                >
                  <Filter className="w-4 h-4 mr-1" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredMeals.map((meal) => (
              <Card key={meal.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                      <div className="flex flex-wrap gap-1">
                        {meal.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {meal.cookTime} min
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {meal.servings} serving{meal.servings > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-xs text-gray-600">
                        <div>Cal: {meal.calories}</div>
                        <div>P: {meal.protein}g</div>
                        <div>C: {meal.carbs}g</div>
                        <div>F: {meal.fats}g</div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleSelectMeal(meal)}
                      >
                        Add to Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealSearchDialog;
