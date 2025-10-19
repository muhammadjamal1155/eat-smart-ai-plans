
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Download, Check, Plus, Trash2 } from 'lucide-react';
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
    
    // Simulate API call to generate grocery list from meal plan
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Grocery List Updated!",
      description: "Generated from your weekly meal plan with smart quantity calculations.",
    });
    
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
    toast({
      title: "Download Started",
      description: "Your grocery list is being prepared for download.",
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
            <Button onClick={downloadList} size="sm" className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Download
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
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="outline" className="text-xs border-border/60">
                            {item.category}
                          </Badge>
                          {item.source === 'meal-plan' && (
                            <Badge variant="secondary" className="text-xs border border-border/60">
                              From Plan
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} {item.unit}
                        </div>
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
