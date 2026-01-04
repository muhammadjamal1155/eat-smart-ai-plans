import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Download, Check, Plus, Trash2, Mail, Apple, Beef, Milk, Wheat, Cookie, Coffee, Snowflake, Archive } from 'lucide-react';
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
    { id: '6', name: 'Quinoa', category: 'Grains', quantity: '1', unit: 'bag', checked: false, source: 'meal-plan' },
    { id: '7', name: 'Salmon Fillets', category: 'Meat & Fish', quantity: '4', unit: 'pieces', checked: false, source: 'meal-plan' },
    { id: '8', name: 'Sweet Potatoes', category: 'Produce', quantity: '3', unit: 'pieces', checked: false, source: 'meal-plan' },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  // Expanded categories with icons
  const categoryConfig: Record<string, { icon: any, color: string }> = {
    'Produce': { icon: Apple, color: 'text-green-500' },
    'Meat & Fish': { icon: Beef, color: 'text-red-500' },
    'Dairy': { icon: Milk, color: 'text-blue-500' },
    'Bakery': { icon: Cookie, color: 'text-amber-500' },
    'Grains': { icon: Wheat, color: 'text-yellow-600' },
    'Pantry': { icon: Archive, color: 'text-slate-500' },
    'Beverages': { icon: Coffee, color: 'text-orange-500' },
    'Frozen': { icon: Snowflake, color: 'text-cyan-500' },
    'Other': { icon: ShoppingCart, color: 'text-gray-500' }
  };

  const categories = ['All', ...Object.keys(categoryConfig)];
  const [selectedCategory, setSelectedCategory] = useState('Produce');

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

      // Enhanced categorization logic
      const categorizeIngredient = (name: string): string => {
        const lowerName = name.toLowerCase();

        if (['chicken', 'beef', 'fish', 'salmon', 'steak', 'pork', 'meat', 'egg', 'turkey', 'lamb', 'shrimp', 'tuna'].some(k => lowerName.includes(k))) return 'Meat & Fish';
        if (['milk', 'cheese', 'yogurt', 'cream', 'butter', 'ghee', 'whey', 'mozzarella', 'cheddar'].some(k => lowerName.includes(k))) return 'Dairy';
        if (['bread', 'bun', 'tortilla', 'bagel', 'pita', 'muffin', 'toast'].some(k => lowerName.includes(k))) return 'Bakery';
        if (['apple', 'banana', 'berry', 'spinach', 'lettuce', 'tomato', 'potato', 'onion', 'garlic', 'carrot', 'vegetable', 'fruit', 'pepper', 'cucumber', 'broccoli', 'avocado', 'lemon', 'lime', 'herb', 'cilantro', 'parsley', 'basil'].some(k => lowerName.includes(k))) return 'Produce';
        if (['rice', 'pasta', 'quinoa', 'oat', 'grain', 'flour', 'noodle', 'couscous'].some(k => lowerName.includes(k))) return 'Grains';
        if (['coffee', 'tea', 'juice', 'soda', 'water', 'drink'].some(k => lowerName.includes(k))) return 'Beverages';
        if (['frozen', 'ice cream'].some(k => lowerName.includes(k))) return 'Frozen';
        if (['oil', 'sauce', 'spice', 'salt', 'sugar', 'honey', 'syrup', 'can', 'jar', 'nut', 'seed', 'bean', 'lentil', 'chickpea', 'stock', 'broth'].some(k => lowerName.includes(k))) return 'Pantry';

        return 'Other';
      };

      Object.values(weekMeals).forEach((day: any) => {
        ['breakfast', 'lunch', 'dinner'].forEach(type => {
          const meal = day[type];
          if (meal && meal.ingredients) {
            meal.ingredients.forEach((ing: string) => {
              const name = ing.trim();
              const category = categorizeIngredient(name);

              if (!ingredientsMap.has(name)) {
                ingredientsMap.set(name, {
                  id: String(idCounter++),
                  name: name,
                  category: category,
                  quantity: '1', // Default
                  unit: 'item', // Default
                  checked: false,
                  source: 'meal-plan'
                });
              } else {
                const existing = ingredientsMap.get(name)!;
                const currentQty = parseInt(existing.quantity) || 0;
                existing.quantity = String(currentQty + 1);
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
        // Sort by category then name
        newList.sort((a, b) => {
          if (a.category !== b.category) return a.category.localeCompare(b.category);
          return a.name.localeCompare(b.name);
        });

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
    // Group by category for download
    const grouped: Record<string, GroceryItem[]> = {};
    groceryList.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    let text = "My Smart Grocery List\n\n";
    Object.keys(grouped).sort().forEach(cat => {
      text += `--- ${cat} ---\n`;
      grouped[cat].forEach(item => {
        text += `[${item.checked ? 'x' : ' '}] ${item.name}\n`;
      });
      text += "\n";
    });

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

  // Group items for "All" view
  const groupedItems = selectedCategory === 'All'
    ? filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, GroceryItem[]>)
    : { [selectedCategory]: filteredItems };

  return (
    <Card id="grocery-list" className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm transition-colors overflow-hidden">
      <CardHeader className="border-b border-border/70 pb-4 bg-muted/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-h-[40px]">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-forest-500 shrink-0" />
            <span className="whitespace-nowrap">Grocery Agenda</span>
          </CardTitle>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              onClick={generateFromMealPlan}
              disabled={isGenerating}
              size="sm"
              variant="default"
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isGenerating ? 'Loading...' : 'Import'}
            </Button>
            <Button onClick={downloadList} size="sm" variant="outline" disabled={groceryList.length === 0}>
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={async () => {
                // ... (keep email logic same for now, just simplified button)
                const userStr = localStorage.getItem('nutriplan-user');
                let email = '';
                if (userStr) email = JSON.parse(userStr).email;
                else email = prompt("Enter your email address:") || '';
                if (!email) return;

                const items = groceryList.map(item => `${item.name} (${item.category})`);
                try {
                  await fetch('http://localhost:5000/api/email-grocery-list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, items })
                  });
                  toast({ title: "Email Sent", description: `Sent to ${email}` });
                } catch (e) { toast({ title: "Error", description: "Failed to send email." }); }
              }}
              size="sm"
              variant="outline"
              disabled={groceryList.length === 0}
            >
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>{completedCount}/{totalCount} Done</span>
          {completedCount > 0 && (
            <button onClick={clearCompleted} className="hover:text-destructive transition-colors">
              Clear Done
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex flex-wrap h-auto gap-3 mb-6 bg-transparent border-none p-0">
            {categories.filter(category => category !== 'All' && getCategoryCount(category) > 0).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-xs border border-border/60 bg-background/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
                {category !== 'All' && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1 h-4 min-w-[1rem] flex items-center justify-center bg-background/80">
                    {getCategoryCount(category)}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            {Object.keys(groupedItems).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No items found</p>
                {groceryList.length === 0 && (
                  <p className="text-xs mt-2">Click "From Meal Plan" to generate your list.</p>
                )}
              </div>
            ) : (
              Object.entries(groupedItems).sort().map(([category, items]) => {
                const Config = categoryConfig[category] || categoryConfig['Other'];
                const Icon = Config.icon;

                return (
                  <div key={category} className="space-y-2">
                    {selectedCategory === 'All' && (
                      <h3 className={`font-semibold flex items-center gap-2 ${Config.color} border-b border-border/50 pb-1 mb-2`}>
                        <Icon className="w-4 h-4" />
                        {category}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 border rounded-md bg-background/50 hover:bg-accent/10 transition-colors border-l-4 ${item.category === 'Produce' ? 'border-l-green-500' :
                            item.category === 'Meat & Fish' ? 'border-l-red-500' :
                              item.category === 'Dairy' ? 'border-l-blue-500' :
                                'border-l-slate-300'
                            } border-y-border/40 border-r-border/40`}
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={() => toggleItem(item.id)}
                            />
                            <div className={`flex-1 truncate ${item.checked ? 'line-through text-muted-foreground/70' : ''}`}>
                              <span className="font-medium capitalize text-sm">{item.quantity > '1' ? `${item.quantity}x ` : ''}{item.name}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeItem(item.id)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GroceryListGenerator;
