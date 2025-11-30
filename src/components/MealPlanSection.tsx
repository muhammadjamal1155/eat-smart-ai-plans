import { useState, useRef, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Flame, Brain, Fish, Leaf, Search, Printer, Trash2,
  Save, Share2, Calendar, MoreVertical, ShoppingCart,
  Loader2, Download, Shuffle, Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import MealPlanCard from './MealPlanCard';
import MealSearchDialog from './MealSearchDialog';
import { toast } from '@/hooks/use-toast';
import {
  DndContext, DragOverlay, useDraggable, useDroppable,
  closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragStartEvent, DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ---------------- Interfaces ----------------
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

interface DayMeals {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
}

// ---------------- Days ----------------
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ---------------- Drag Components ----------------
function DraggableMeal({ meal }: { meal: Meal }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: meal.id,
    data: { meal },
  });
  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab shadow-lg scale-105 rounded-lg overflow-hidden">
      <MealPlanCard mealType="breakfast" meal={meal} onMealChange={() => { }} />
    </div>
  );
}

function DroppableMealSlot({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[150px] rounded-lg p-2 flex items-center justify-center transition-colors duration-200 border-2 
      ${isOver ? 'border-primary bg-forest-100/40 dark:bg-forest-900/20' : 'border-dashed border-border/70 bg-background/60 dark:bg-background/40'}`}
    >
      {children}
    </div>
  );
}

// ---------------- Initial State ----------------
const initialWeekMeals: Record<string, DayMeals> = daysOfWeek.reduce((acc, day) => {
  acc[day] = { breakfast: null, lunch: null, dinner: null };
  return acc;
}, {} as Record<string, DayMeals>);

// ---------------- Component ----------------
const MealPlanSection = () => {
  const [weekMeals, setWeekMeals] = useState<Record<string, DayMeals>>(() => {
    try {
      const saved = localStorage.getItem('weekMeals');
      return saved ? JSON.parse(saved) : initialWeekMeals;
    } catch {
      return initialWeekMeals;
    }
  });

  const [isBrowseMealsOpen, setIsBrowseMealsOpen] = useState(false);
  const [activeMealSlot, setActiveMealSlot] = useState<{ day: string; mealType: keyof DayMeals } | null>(null);

  const handleOpenBrowseMeals = (day: string, mealType: keyof DayMeals) => {
    setActiveMealSlot({ day, mealType });
    setIsBrowseMealsOpen(true);
  };

  // Save meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weekMeals', JSON.stringify(weekMeals));
  }, [weekMeals]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeals = useMemo(() => {
    if (!searchQuery) return weekMeals;
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = { ...weekMeals };

    for (const day in filtered) {
      const dayMeals = filtered[day as keyof typeof filtered];
      for (const mealType in dayMeals) {
        const meal = dayMeals[mealType as keyof typeof dayMeals];
        if (meal && !meal.name.toLowerCase().includes(lowercasedQuery)) {
          (filtered[day as keyof typeof filtered])[mealType as keyof DayMeals] = null;
        }
      }
    }
    return filtered;
  }, [searchQuery, weekMeals]);

  const calculateDailySummary = (dayMeals: DayMeals) => {
    const meals = [dayMeals.breakfast, dayMeals.lunch, dayMeals.dinner].filter(Boolean) as Meal[];
    return meals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.calories,
        protein: total.protein + meal.protein,
        carbs: total.carbs + meal.carbs,
        fats: total.fats + meal.fats
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  // ---------------- Shopping List ----------------
  const handleGenerateShoppingList = () => {
    const ingredients: string[] = [];

    Object.values(weekMeals).forEach(day => {
      ['breakfast', 'lunch', 'dinner'].forEach(type => {
        const meal = day[type as keyof DayMeals];
        if (meal) {
          ingredients.push(...meal.ingredients);
        }
      });
    });

    if (ingredients.length === 0) {
      toast({
        title: "No Meals Selected",
        description: "Add meals to generate a shopping list.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Shopping List Generated",
      description: `You have ${ingredients.length} items in your shopping list.`,
    });

    console.log("Shopping List:", ingredients);
  };

  // ---------------- PDF Download ----------------
  const [isDownloading, setIsDownloading] = useState(false);
  const mealPlanRef = useRef<HTMLDivElement>(null);

  const handleDownloadPlan = () => {
    if (!mealPlanRef.current) return;

    setIsDownloading(true);
    toast({
      title: "Download Started",
      description: "Your meal plan PDF is being generated...",
    });

    html2canvas(mealPlanRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('meal-plan.pdf');
      setIsDownloading(false);
    });
  };

  // ---------------- Share ----------------
  const handleSharePlan = async () => {
    if (!mealPlanRef.current) return;

    try {
      const canvas = await html2canvas(mealPlanRef.current, { scale: 2 });
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], 'meal-plan.png', { type: 'image/png' });
          await navigator.share({
            title: 'My Meal Plan',
            text: 'Check out my weekly meal plan from NutriPlan!',
            files: [file],
          });
          toast({
            title: "Plan Shared",
            description: "Your meal plan has been shared successfully!",
          });
        } else {
          toast({
            title: "Share Not Supported",
            description: "Web Share API is not supported in your browser.",
            variant: "destructive",
          });
        }
      }, 'image/png');
    } catch (error) {
      toast({
        title: "Error Sharing Plan",
        description: "Could not share the meal plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ---------------- Drag Logic ----------------
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const findContainer = (id: string) => {
    if (id in weekMeals) return id;
    for (const day in weekMeals) {
      for (const mealType in weekMeals[day]) {
        if (weekMeals[day][mealType as keyof DayMeals]?.id === id) {
          return `${day}-${mealType}`;
        }
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(String(active.id));
    const overContainer = findContainer(String(over.id));
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    const [fromDay, fromMealType] = activeContainer.split('-');
    const [toDay, toMealType] = overContainer.split('-');

    setWeekMeals(prev => {
      const newWeek = { ...prev };
      const draggedMeal = newWeek[fromDay][fromMealType as keyof DayMeals];
      newWeek[fromDay] = { ...newWeek[fromDay], [fromMealType]: null };
      newWeek[toDay] = { ...newWeek[toDay], [toMealType]: draggedMeal };
      return newWeek;
    });

    setActiveId(null);
  };
  const handleDragCancel = () => setActiveId(null);
  const activeMeal = activeId ? Object.values(weekMeals).flatMap(day => Object.values(day)).find(meal => meal?.id === activeId) : null;

  const handleMealChange = (day: string, mealType: keyof DayMeals, newMeal: Meal | null) => {
    setWeekMeals(prevWeekMeals => ({
      ...prevWeekMeals,
      [day]: {
        ...prevWeekMeals[day],
        [mealType]: newMeal,
      },
    }));
  };

  const handleBrowseMealSelect = (meal: Meal) => {
    if (activeMealSlot) {
      handleMealChange(activeMealSlot.day, activeMealSlot.mealType, meal);
      setActiveMealSlot(null);
    }
    setIsBrowseMealsOpen(false);
  };

  // ---------------- Render ----------------
  return (
    <section
      id="meal-plans"
      className="scroll-mt-24 md:scroll-mt-28 py-20 relative w-full overflow-x-hidden animate-fade-in"
      ref={mealPlanRef}
    >
      <div className="container mx-auto">
        <Card className="glass-panel shadow-large">
          <CardHeader>
            <CardTitle>Weekly Meal Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search meals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleGenerateShoppingList}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Shopping List
              </Button>
              <Button onClick={handleDownloadPlan} disabled={isDownloading}>
                {isDownloading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Download className="mr-2 h-4 w-4" />}
                Download
              </Button>
              <Button onClick={handleSharePlan}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>

            {daysOfWeek.map((day) => {
              const summary = calculateDailySummary(filteredMeals[day]);
              return (
                <div key={day} className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">{day}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                      <DroppableMealSlot key={mealType} id={`${day}-${mealType}`}>
                        {filteredMeals[day]?.[mealType as keyof DayMeals] ? (
                          <MealPlanCard
                            mealType={mealType as "breakfast" | "lunch" | "dinner"}
                            meal={filteredMeals[day][mealType as keyof DayMeals]!}
                            onMealChange={(newMeal) => handleMealChange(day, mealType as keyof DayMeals, newMeal)}
                          />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenBrowseMeals(day, mealType as keyof DayMeals)}
                            className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-primary"
                          >
                            <Plus className="w-5 h-5 mb-1" />
                            Add {mealType}
                          </Button>
                        )}
                      </DroppableMealSlot>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Calories: {summary.calories} | Protein: {summary.protein}g | Carbs: {summary.carbs}g | Fats: {summary.fats}g
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <MealSearchDialog
        isOpen={isBrowseMealsOpen}
        onOpenChange={setIsBrowseMealsOpen}
        onSelectMeal={handleBrowseMealSelect}
        mealType={activeMealSlot?.mealType || 'breakfast'}
      />
    </section>
  );
};

export default MealPlanSection;
