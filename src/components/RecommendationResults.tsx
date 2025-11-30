import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Users, Filter, ArrowLeft, ChefHat, Utensils } from 'lucide-react';

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
    ingredients: string;
    steps: string[];
}

interface RecommendationResultsProps {
    data: {
        target_calories: number;
        bmr: number;
        tdee: number;
        meals: Meal[];
    };
    onBack: () => void;
}

const RecommendationResults = ({ data, onBack }: RecommendationResultsProps) => {
    const [filter, setFilter] = useState('All');
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

    const filteredMeals = filter === 'All'
        ? data.meals
        : data.meals.filter(meal => meal.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())));

    const filters = ['All', 'Healthy', 'Quick', 'Protein-rich', 'Vegan'];

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"; // Fallback food image
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-primary">Your Daily Target: {data.target_calories} kcal</h2>
                    <p className="text-muted-foreground">Based on your BMR ({data.bmr}) and Activity</p>
                </div>
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
                                src={meal.image}
                                alt={meal.name}
                                onError={handleImageError}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                                {meal.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm">
                                        {tag}
                                    </Badge>
                                ))}
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

                        <CardFooter className="pt-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full bg-[#C5D86D] text-black hover:bg-[#B5C85D]" onClick={() => setSelectedMeal(meal)}>
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
                                                <p className="text-muted-foreground leading-relaxed bg-secondary/10 p-4 rounded-lg">
                                                    {meal.ingredients}
                                                </p>
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
        </div>
    );
};

export default RecommendationResults;
