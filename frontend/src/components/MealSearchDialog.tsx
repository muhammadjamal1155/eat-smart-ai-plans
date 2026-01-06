
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/api';

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

interface MealSearchDialogProps {
  onSelectMeal: (meal: Meal) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MealSearchDialog = ({ onSelectMeal, mealType, isOpen, onOpenChange }: MealSearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      try {
        if (selectedFilter === 'recommended') {
          // Try to get saved recommendations first to ensure consistency with Nutrition Form
          const savedRecommendations = localStorage.getItem('recommendedMeals');
          if (savedRecommendations) {
            try {
              setMeals(JSON.parse(savedRecommendations));
              setIsLoading(false);
              return;
            } catch (e) {
              console.error("Failed to parse saved recommendations", e);
              localStorage.removeItem('recommendedMeals');
            }
          }

          const userProfileStr = localStorage.getItem('userProfile');
          if (userProfileStr) {
            const userProfile = JSON.parse(userProfileStr);
            const response = await fetch(getApiUrl('/recommend'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                age: userProfile.age,
                weight: userProfile.weight, // Ensure units are handled if needed, assuming kg from form
                height: userProfile.height, // Assuming cm
                gender: userProfile.gender,
                goal: userProfile.goal,
                activity_level: userProfile.activityLevel,
                diet_type: userProfile.dietType,
                allergies: userProfile.foodAllergies ? userProfile.foodAllergies.split(',') : []
              }),
            });
            if (response.ok) {
              const data = await response.json();
              setMeals(data.meals || []);
            }
          } else {
            setMeals([]); // No profile, no recommendations
            toast({
              title: "Profile Missing",
              description: "Please fill out the Nutrition Form to get recommendations.",
              variant: "destructive"
            });
          }
        } else {
          // Pass selected tags to backend logic (except 'all' is handled as default/empty there)
          const tagParam = selectedFilter !== 'all' ? `&tag=${selectedFilter}` : '';
          const response = await fetch(getApiUrl(`/meals?query=${searchTerm}${tagParam}`));
          if (response.ok) {
            const data = await response.json();
            setMeals(data);
          }
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      if (isOpen) {
        fetchMeals();
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm, isOpen, selectedFilter]);

  const filteredMeals = meals;

  const handleSelectMeal = (meal: Meal) => {
    onSelectMeal(meal);
    onOpenChange(false);
    toast({
      title: "Meal Added",
      description: `${meal.name} has been added to your ${mealType} plan.`,
    });
  };

  const handleGetRecommendations = () => {
    onOpenChange(false);
    navigate('/nutrition-form');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Choose {mealType} meal</span>
            <Button variant="outline" size="sm" onClick={handleGetRecommendations} className="mr-8">
              Get AI Recommendations
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
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
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'recommended', 'healthy', 'quick', 'protein', 'vegan', 'gluten-free'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="whitespace-nowrap"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="col-span-2 text-center py-8 text-muted-foreground">Loading meals...</div>
            ) : filteredMeals.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                {selectedFilter === 'recommended'
                  ? "No recommendations found. Please complete your nutrition profile first."
                  : "No meals found. Try a different search."}
              </div>
            ) : (
              filteredMeals.map((meal) => (
                <Card key={meal.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-20 h-20 object-cover rounded-lg bg-secondary/20"
                        onError={(e) => {
                          const fallbackImages = [
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
                            'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80',
                            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
                            'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80',
                            'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=300&q=80',
                            'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80',
                          ];
                          const index = meal.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % fallbackImages.length;
                          e.currentTarget.src = fallbackImages[index];
                        }}
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1" title={meal.name}>{meal.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {meal.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {meal.time || `${meal.cookTime} min`}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            1 serving
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
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealSearchDialog;
