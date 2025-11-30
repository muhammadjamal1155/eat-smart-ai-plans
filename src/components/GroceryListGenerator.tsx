
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Download, Check, Plus, Trash2, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  unit: string;
  checked: boolean;
  source: 'meal-plan' | 'manual';
}

const GroceryListGenerator = () => {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([
    { id: '1', name: 'Greek Yogurt', category: 'Dairy', quantity: '2', unit: 'containers', checked: false, source: 'meal-plan' },
    { id: '2', name: 'Mixed Berries', category: 'Produce', quantity: '1', unit: 'bag', checked: false, source: 'meal-plan' },
    { id: '3', name: 'Granola', category: 'Pantry', quantity: '1', unit: 'box', checked: false, source: 'meal-plan' },
    { id: '4', name: 'Avocados', category: 'Produce', quantity: '4', unit: 'pieces', checked: false, source: 'meal-plan' },
    { id: '5', name: 'Whole Grain Bread', category: 'Bakery', quantity: '1', unit: 'loaf', checked: false, source: 'meal-plan' },
    { id: '6', name: 'Quinoa', category: 'Pantry', quantity: '1', unit: 'bag', checked: false, source: 'meal-plan' },
    { id: '7', name: 'Salmon Fillets', category: 'Meat & Fish', quantity: '4', unit: 'pieces', checked: false, source: 'meal-plan' },
    { id: '8', name: 'Sweet Potatoes', category: 'Produce', quantity: '3', unit: 'pieces', checked: false, source: 'meal-plan' },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['All', 'Produce', 'Dairy', 'Meat & Fish', 'Pantry', 'Bakery'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const generateFromMealPlan = async () => {
    setIsGenerating(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const savedMeals = localStorage.getItem('weekMeals');
      if (!savedMeals) {
        toast({
          title: "No Meal Plan Found",
          description: "Please create a meal plan first.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      const weekMeals = JSON.parse(savedMeals);
      const ingredientsMap = new Map<string, GroceryItem>();
      let idCounter = 1;

      // Helper to categorize ingredients (simple keyword based)
      const categorizeIngredient = (name: string): string => {
        const lowerName = name.toLowerCase();
        if (['chicken', 'beef', 'fish', 'salmon', 'steak', 'pork', 'meat', 'egg'].some(k => lowerName.includes(k))) return 'Meat & Fish';
        if (['milk', 'cheese', 'yogurt', 'cream', 'butter'].some(k => lowerName.includes(k))) return 'Dairy';
        if (['bread', 'bun', 'tortilla', 'bagel'].some(k => lowerName.includes(k))) return 'Bakery';
        if (['apple', 'banana', 'berry', 'spinach', 'lettuce', 'tomato', 'potato', 'onion', 'garlic', 'carrot', 'vegetable', 'fruit'].some(k => lowerName.includes(k))) return 'Produce';
        return 'Pantry';
      };

      Object.values(weekMeals).forEach((day: any) => {
        ['breakfast', 'lunch', 'dinner'].forEach(type => {
          const meal = day[type];
          if (meal && meal.ingredients) {
            meal.ingredients.forEach((ing: string) => {
              // Simple parsing: assume format "quantity unit name" or just "name"
              // For now, we just use the whole string as name and default quantity
              const name = ing.trim();
              const category = categorizeIngredient(name);

              if (ingredientsMap.has(name)) {
                // const existing = ingredientsMap.get(name)!;
                // Very basic quantity aggregation (just incrementing count if unit matches, otherwise appending)
                // Since our data is just strings, we'll just keep unique items for now
              } else {
                ingredientsMap.set(name, {
                  id: String(idCounter++),
                  name: name,
                  category: category,
                  quantity: '1', // Default
                  unit: 'item', // Default
                  checked: false,
                  source: 'meal-plan'
                });
              }
            });
          }
        });
      });

      const newList = Array.from(ingredientsMap.values());

      if (newList.length === 0) {
        toast({
          title: "No Ingredients Found",
          description: "Your meal plan seems to be empty.",
          variant: "destructive"
        });
      } else {
        setGroceryList(newList);
        toast({
          title: "Grocery List Updated!",
          description: `Generated ${newList.length} items from your weekly meal plan.`,
        });
      }

    } catch (error) {
      console.error("Error generating list:", error);
      toast({
        title: "Error",
        description: "Failed to generate grocery list.",
        variant: "destructive"
      });
    }

    setIsGenerating(false);
  };

  const toggleItem = (id: string) => {
    setGroceryList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setGroceryList(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your grocery list.",
    });
  };

  const downloadList = () => {
    const text = groceryList.map(item => `[${item.checked ? 'x' : ' '}] ${item.name} (${item.category})`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grocery-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your grocery list has been downloaded.",
    });
  };

  const clearCompleted = () => {
    setGroceryList(prev => prev.filter(item => !item.checked));
    toast({
      title: "Completed Items Cleared",
      description: "All checked items have been removed from the list.",
    });
  };

  const filteredItems = groceryList.filter(item =>
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const completedCount = groceryList.filter(item => item.checked).length;
  const totalCount = groceryList.length;

  const getCategoryCount = (category: string) => {
    if (category === 'All') return groceryList.length;
    return groceryList.filter(item => item.category === category).length;
  };

  return (
    <Card className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm transition-colors">
      <CardHeader className="border-b border-border/70 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-forest-500" />
            <span>Smart Grocery List</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={generateFromMealPlan}
              disabled={isGenerating}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'From Meal Plan'}
            </Button>
            <Button onClick={downloadList} size="sm" className="btn-primary" disabled={groceryList.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={async () => {
                // Get user email from localStorage or prompt (simplifying by prompting for now if not in context)
                // Ideally we use useAuth() here but let's keep it simple for this component
                const userStr = localStorage.getItem('nutriplan-user');
                let email = '';
                if (userStr) {
                  email = JSON.parse(userStr).email;
                } else {
                  email = prompt("Enter your email address:") || '';
                }

                if (!email) return;

                const items = groceryList.map(item => `${item.quantity} ${item.unit} ${item.name} (${item.category})`);

                try {
                  const response = await fetch('http://localhost:5000/api/email-grocery-list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, items })
                  });

                  if (response.ok) {
                    toast({
                      title: "Email Sent",
                      description: `Grocery list sent to ${email} (Check server console)`,
                    });
                  } else {
                    throw new Error("Failed to send email");
                  }
                } catch (e) {
                  toast({
                    title: "Error",
                    description: "Could not send email.",
                    variant: "destructive"
                  });
                }
              }}
              size="sm"
              variant="outline"
              disabled={groceryList.length === 0}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{completedCount} of {totalCount} items completed</span>
          {completedCount > 0 && (
            <Button
              onClick={clearCompleted}
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear Completed
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-6 mb-6 bg-background/60 dark:bg-background/40 border border-border/70">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
                {category !== 'All' && (
                  <Badge variant="secondary" className="ml-1 text-xs border border-border/60">
                    {getCategoryCount(category)}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No items in this category</p>
                  {groceryList.length === 0 && (
                    <p className="text-xs mt-2">Click "From Meal Plan" to generate your list.</p>
                  )}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-border/70 rounded-lg bg-background/60 dark:bg-background/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <div className={`flex-1 ${item.checked ? 'line-through text-muted-foreground/70' : ''}`}>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium capitalize">{item.name}</span>
                          <Badge variant="outline" className="text-xs border-border/60">
                            {item.category}
                          </Badge>
                          {item.source === 'meal-plan' && (
                            <Badge variant="secondary" className="text-xs border border-border/60">
                              From Plan
                            </Badge>
                          )}
                        </div>
                        {/* Quantity display removed as we are just listing ingredients for now */}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeItem(item.id)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GroceryListGenerator;
