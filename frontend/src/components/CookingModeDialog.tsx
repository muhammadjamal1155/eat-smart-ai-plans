import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ChefHat, Timer, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Meal {
    id: string;
    name: string;
    time?: string;
    cookTime: number;
    calories: number;
    ingredients: string[];
    steps?: string[];
}

interface CookingModeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    meal: Meal | null;
}

export default function CookingModeDialog({ open, onOpenChange, meal }: CookingModeDialogProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

    if (!meal) return null;

    const steps = meal.steps || ["No instructions provided."];
    const progress = ((activeStep + 1) / steps.length) * 100;

    const toggleIngredient = (ingredient: string) => {
        setCheckedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(i => i !== ingredient)
                : [...prev, ingredient]
        );
    };

    const isLastStep = activeStep === steps.length - 1;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-xl">
                {/* Header */}
                <div className="p-6 bg-primary/10 border-b flex justify-between items-start">
                    <div>
                        <Badge variant="outline" className="mb-2 bg-background/50 backdrop-blur">Cooking Mode</Badge>
                        <DialogTitle className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                            <ChefHat className="w-8 h-8 text-primary" />
                            {meal.name}
                        </DialogTitle>
                        <DialogDescription className="text-base flex items-center gap-4">
                            <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> {meal.time || `${meal.cookTime} min`}</span>
                            <span>•</span>
                            <span>{meal.calories} Calories</span>
                        </DialogDescription>
                    </div>
                    <div className="bg-background/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium border">
                        Step {activeStep + 1} of {steps.length}
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Sidebar - Ingredients */}
                    <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r bg-muted/10 p-0 flex flex-col">
                        <div className="p-4 border-b bg-muted/20 font-semibold text-lg flex justify-between items-center">
                            Ingredients
                            <Badge variant="secondary" className="text-xs font-normal">
                                {checkedIngredients.length}/{meal.ingredients.length} ready
                            </Badge>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-3">
                                {meal.ingredients.map((ingredient, idx) => (
                                    <div key={idx} className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${checkedIngredients.includes(ingredient) ? 'bg-green-500/10' : 'hover:bg-muted/50'}`}>
                                        <Checkbox
                                            id={`ing-${idx}`}
                                            checked={checkedIngredients.includes(ingredient)}
                                            onCheckedChange={() => toggleIngredient(ingredient)}
                                        />
                                        <label
                                            htmlFor={`ing-${idx}`}
                                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${checkedIngredients.includes(ingredient) ? 'line-through text-muted-foreground' : ''}`}
                                        >
                                            {ingredient}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Main Content - Active Step */}
                    <div className="flex-1 flex flex-col bg-background relative">
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-secondary">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="flex-1 flex items-center justify-center p-8 md:p-12 text-center overflow-y-auto">
                            <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300 key={activeStep}">
                                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                    {activeStep + 1}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-medium leading-relaxed">
                                    {steps[activeStep]}
                                </h3>
                            </div>
                        </div>

                        {/* Step Controls */}
                        <div className="p-6 border-t bg-muted/5 flex justify-between items-center">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                                disabled={activeStep === 0}
                                className="w-32"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>

                            <div className="hidden sm:flex gap-1">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-colors ${i === activeStep ? 'bg-primary' : i < activeStep ? 'bg-primary/40' : 'bg-muted-foreground/20'}`}
                                    />
                                ))}
                            </div>

                            {isLastStep ? (
                                <Button
                                    size="lg"
                                    className="w-32 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Finish <CheckCircle2 className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                                    className="w-32"
                                >
                                    Next <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
