import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Filter, ArrowLeft, ChefHat, Utensils, Brain, Zap } from 'lucide-react';

interface Meal {
    id: string;
    name: string;
    image: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    tags: string[];
    time: string;
    ingredients: string[];
    steps: string[];
}

interface RecommendationResultsProps {
    data: {
        target_calories: number;
        bmr: number;
        tdee: number;
        meals: Meal[];
        model_used?: string;
        model_confidence?: string;
    };
    onBack: () => void;
}

const RecommendationResults = ({ data, onBack }: RecommendationResultsProps) => {
    const [filter, setFilter] = useState('All');
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

    const filters = ['All', 'Healthy', 'Quick', 'Protein-rich', 'Vegan', 'Low Carb', 'Gluten Free'];

    const filterMap: { [key: string]: string[] } = {
        'All': [],
        'Healthy': ['low-in-something', 'low-sodium', 'low-fat', 'healthy'],
        'Quick': ['30-minutes-or-less', '15-minutes-or-less', 'easy', 'quick'],
        'Protein-rich': ['high-protein', 'protein'],
        'Vegan': ['vegan'],
        'Low Carb': ['low-carb', 'very-low-carbs'],
        'Gluten Free': ['gluten-free']
    };

    const filteredMeals = filter === 'All'
        ? data.meals
        : data.meals.filter(meal => {
            const targetTags = filterMap[filter] || [];
            return meal.tags.some(tag => targetTags.some(t => tag.toLowerCase().includes(t)));
        });

    const fallbackImages = [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", // Salad bowl
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", // Steak/Meat
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80", // Healthy bowl
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80", // Pancakes/Breakfast
        "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&q=80", // Soup
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80", // Sandwich/Toast
        "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80", // French toast/Dessert
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", // Veggie bowl
    ];

    const getFallbackImage = (id: string) => {
        let numericId = parseInt(id);
        if (isNaN(numericId)) {
            // Simple hash for string IDs
            numericId = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        }
        const index = Math.abs(numericId) % fallbackImages.length;
        return fallbackImages[index] || fallbackImages[0];
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, id: string) => {
        e.currentTarget.src = getFallbackImage(id);
        e.currentTarget.onerror = null; // Prevent infinite loop
    };

    const navigate = useNavigate();

    const handleGoToMealPlan = () => {
        navigate('/meal-plans');
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 hover:bg-transparent hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <div className="text-right space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold text-primary tracking-tight">Your Daily Target: {data.target_calories} kcal</h2>
                        <p className="text-muted-foreground font-medium">Based on your BMR ({data.bmr}) and Activity</p>
                    </div>

                    {data.model_used && (
                        <div className="flex justify-end gap-3 pt-2">
                            <Badge className="px-3 py-1.5 bg-violet-500/10 text-violet-600 border-violet-200 hover:bg-violet-500/20 gap-1.5 transition-colors">
                                <Brain className="w-3.5 h-3.5" />
                                <span className="font-semibold">AI Model: {data.model_used.toUpperCase()}</span>
                            </Badge>
                            <Badge className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20 gap-1.5 transition-colors">
                                <Zap className="w-3.5 h-3.5" />
                                <span className="font-semibold">Confidence: {data.model_confidence}</span>
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-secondary/10 border-primary/20 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Ready to plan your week?</h3>
                    <p className="text-muted-foreground">Head over to the Meal Planner to add these recommended meals to your weekly schedule.</p>
                </div>
                <Button onClick={handleGoToMealPlan} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Go to Meal Planner
                </Button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                {filters.map(f => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        onClick={() => setFilter(f)}
                        className="rounded-full"
                    >
                        {f}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map((meal) => (
                    <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-primary/20 flex flex-col">
                        <div className="relative h-48 w-full">
                            <img
                                src={meal.image && !meal.image.includes('placeholder') ? meal.image : getFallbackImage(meal.id)}
                                alt={meal.name}
                                onError={(e) => handleImageError(e, meal.id)}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                                {meal.tags.slice(0, 3).map(tag => {
                                    let badgeColor = "bg-black/50 text-white hover:bg-black/70";
                                    if (tag === 'Breakfast') badgeColor = "bg-orange-500/90 text-white hover:bg-orange-600/90";
                                    if (tag === 'Lunch') badgeColor = "bg-green-500/90 text-white hover:bg-green-600/90";
                                    if (tag === 'Dinner') badgeColor = "bg-blue-500/90 text-white hover:bg-blue-600/90";

                                    return (
                                        <Badge key={tag} variant="secondary" className={`${badgeColor} backdrop-blur-sm`}>
                                            {tag}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl line-clamp-1" title={meal.name}>{meal.name}</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-grow">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{meal.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>1 serving</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 text-center text-sm bg-secondary/20 p-2 rounded-lg">
                                <div>
                                    <div className="font-bold text-primary">{meal.calories}</div>
                                    <div className="text-xs text-muted-foreground">Cal</div>
                                </div>
                                <div>
                                    <div className="font-bold">{meal.protein}g</div>
                                    <div className="text-xs text-muted-foreground">Prot</div>
                                </div>
                                <div>
                                    <div className="font-bold">{meal.carbs}g</div>
                                    <div className="text-xs text-muted-foreground">Carbs</div>
                                </div>
                                <div>
                                    <div className="font-bold">{meal.fats}g</div>
                                    <div className="text-xs text-muted-foreground">Fats</div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-2 gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="flex-1 bg-[#C5D86D] text-black hover:bg-[#B5C85D]" onClick={() => setSelectedMeal(meal)}>
                                        View Recipe
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                            <ChefHat className="w-6 h-6 text-primary" />
                                            {meal.name}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Ready in {meal.time} • {meal.calories} Calories
                                        </DialogDescription>
                                    </DialogHeader>

                                    <ScrollArea className="h-[60vh] pr-4">
                                        <div className="space-y-6 py-4">
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                                                    <Utensils className="w-5 h-5" /> Ingredients
                                                </h3>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {meal.ingredients.map((ingredient, index) => (
                                                        <li key={index} className="flex items-center gap-2 text-muted-foreground bg-secondary/10 p-2 rounded-md">
                                                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                                            <span className="capitalize">{ingredient}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                                                    <ChefHat className="w-5 h-5" /> Instructions
                                                </h3>
                                                <div className="space-y-4">
                                                    {meal.steps.map((step, index) => (
                                                        <div key={index} className="flex gap-4">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                                                {index + 1}
                                                            </div>
                                                            <p className="text-muted-foreground pt-1">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div >
    );
};

export default RecommendationResults;
