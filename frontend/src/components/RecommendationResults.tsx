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
import { getFallbackImage } from '@/lib/utils';
import { analyticsService } from '@/services/analytics';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

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

        // AI Fields
        ai_insight?: string;
        strategy_tip?: string;
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


    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, id: string) => {
        e.currentTarget.src = getFallbackImage(id);
        e.currentTarget.onerror = null; // Prevent infinite loop
    };

    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleGoToMealPlan = async () => {
        if (!user) {
            navigate('/meal-plans');
            return;
        }

        setIsSaving(true);
        try {
            // Distribute meals across the week
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const weekMeals: any = {};

            // Simple distribution strategy: Rotate through the recommended meals
            // Assuming data.meals has at least 1 meal
            const meals = data.meals;
            if (!meals || meals.length === 0) {
                toast({ title: "No meals to save", variant: "destructive" });
                navigate('/meal-plans');
                return;
            }

            days.forEach((day, index) => {
                // Ensure we have different meals if possible, or repeat if not enough
                const breakfast = meals[index % meals.length];
                const lunch = meals[(index + 1) % meals.length];
                const dinner = meals[(index + 2) % meals.length];

                weekMeals[day] = {
                    breakfast,
                    lunch,
                    dinner
                };
            });

            await analyticsService.savePlan(user.id, weekMeals);

            toast({ title: "Plan Saved!", description: "Your weekly meal plan has been created." });
            navigate('/meal-plans');
        } catch (error) {
            console.error("Failed to save plan:", error);
            toast({ title: "Error saving plan", description: "Please try again.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Button variant="ghost" onClick={onBack} className="self-start flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Form
                </Button>
                <div className="text-right space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Your Daily Target: {data.target_calories} kcal</h2>
                        <p className="text-white/60 font-medium">Based on your BMR ({data.bmr}) and Activity</p>
                    </div>

                    {data.model_used && (
                        <div className="flex justify-end gap-3 pt-2">
                            <Badge className="px-3 py-1.5 bg-primary/20 text-primary-foreground border-primary/30 gap-1.5 backdrop-blur-sm">
                                <Brain className="w-3.5 h-3.5" />
                                <span className="font-semibold">AI Model: {data.model_used.toUpperCase()}</span>
                            </Badge>
                            <Badge className="px-3 py-1.5 bg-emerald-500/20 text-emerald-100 border-emerald-500/30 gap-1.5 backdrop-blur-sm">
                                <Zap className="w-3.5 h-3.5" />
                                <span className="font-semibold">Confidence: {data.model_confidence}</span>
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Insight Card */}
            {(data.ai_insight || data.strategy_tip) && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-12 -right-12 p-4 opacity-10 rotate-12 animate-pulse">
                        <Brain className="w-64 h-64 text-white" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        {data.ai_insight && (
                            <div>
                                <h3 className="text-xl font-bold text-primary-foreground flex items-center gap-2 mb-3">
                                    <Brain className="w-6 h-6" /> AI Nutritionist Insight
                                </h3>
                                <p className="text-lg text-white/90 leading-relaxed italic font-light">
                                    "{data.ai_insight}"
                                </p>
                            </div>
                        )}

                        {data.strategy_tip && (
                            <div className="bg-primary/20 rounded-xl p-5 border border-primary/30 flex gap-4 items-start backdrop-blur-sm">
                                <div className="bg-white/20 p-2.5 rounded-full mt-0.5">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-primary-foreground uppercase tracking-widest mb-1.5 opacity-80">
                                        Personal Strategy
                                    </h4>
                                    <p className="font-medium text-white text-base leading-relaxed">
                                        {data.strategy_tip}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CTA Card */}
            <div className="bg-gradient-to-r from-primary/40 to-emerald-900/40 backdrop-blur-md border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Ready to start your journey?</h3>
                    <p className="text-white/70">Add these meals to your weekly planner to stay on track.</p>
                </div>
                <Button onClick={handleGoToMealPlan} className="bg-white text-primary hover:bg-white/90 border-0 shadow-lg font-bold">
                    Go to Meal Planner
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                <div className="bg-white/5 p-2 rounded-full">
                    <Filter className="w-5 h-5 text-white/50" />
                </div>
                {filters.map(f => (
                    <Button
                        key={f}
                        variant="ghost"
                        onClick={() => setFilter(f)}
                        className={`rounded-full border transition-all ${filter === f
                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                            }`}
                    >
                        {f}
                    </Button>
                ))}
            </div>

            {/* Meal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map((meal) => (
                    <Card key={meal.id} className="group overflow-hidden bg-white/5 backdrop-blur-md border-white/10 text-white hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
                        <div className="relative h-56 w-full overflow-hidden">
                            <img
                                src={meal.image && !meal.image.includes('placeholder') ? meal.image : getFallbackImage(meal.id)}
                                alt={meal.name}
                                onError={(e) => handleImageError(e, meal.id)}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                            <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1.5 max-w-[80%]">
                                {meal.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag} className="bg-black/60 backdrop-blur-md text-white border-0 font-normal">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors" title={meal.name}>
                                {meal.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-grow relative z-10">
                            <div className="flex items-center justify-between text-sm text-white/50">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{meal.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    <span>Single Serving</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 text-center text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                                <div>
                                    <div className="font-bold text-white">{meal.calories}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40">Kcal</div>
                                </div>
                                <div>
                                    <div className="font-bold text-white/90">{meal.protein}g</div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40">Prot</div>
                                </div>
                                <div>
                                    <div className="font-bold text-white/90">{meal.carbs}g</div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40">Carb</div>
                                </div>
                                <div>
                                    <div className="font-bold text-white/90">{meal.fats}g</div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40">Fats</div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-2 gap-2 relative z-10 pb-6 px-6">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary" onClick={() => setSelectedMeal(meal)}>
                                        View Recipe
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border-white/10 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
                                            <ChefHat className="w-7 h-7 text-primary" />
                                            {meal.name}
                                        </DialogTitle>
                                        <DialogDescription className="text-white/60 text-lg">
                                            Ready in {meal.time} • {meal.calories} Calories
                                        </DialogDescription>
                                    </DialogHeader>

                                    <ScrollArea className="h-[60vh] pr-4 mt-4">
                                        <div className="space-y-8">
                                            {/* Ingredients */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary border-b border-white/10 pb-2">
                                                    <Utensils className="w-5 h-5" /> Ingredients
                                                </h3>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {meal.ingredients.map((ingredient, index) => (
                                                        <li key={index} className="flex items-start gap-3 text-white/80 bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                                                            <span className="capitalize leading-relaxed">{ingredient}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Instructions */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary border-b border-white/10 pb-2">
                                                    <ChefHat className="w-5 h-5" /> Instructions
                                                </h3>
                                                <div className="space-y-6">
                                                    {meal.steps.map((step, index) => (
                                                        <div key={index} className="flex gap-4 group">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-sm group-hover:bg-primary group-hover:text-black transition-colors">
                                                                {index + 1}
                                                            </div>
                                                            <p className="text-white/80 pt-1 leading-relaxed group-hover:text-white transition-colors">{step}</p>
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
