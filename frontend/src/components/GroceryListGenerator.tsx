import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Download, Check, Plus, Trash2, Mail, Apple, Beef, Milk, Wheat, Cookie, Coffee, Snowflake, Archive } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/api';
import { jsPDF } from 'jspdf';

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
  const { user } = useAuth();
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
      const allIngredients: string[] = [];

      Object.values(weekMeals).forEach((day: any) => {
        ['breakfast', 'lunch', 'dinner'].forEach(type => {
          const meal = day[type];
          if (meal && meal.ingredients) {
            allIngredients.push(...meal.ingredients);
          }
        });
      });

      if (allIngredients.length === 0) {
        toast({
          title: "No Ingredients Found",
          description: "Your meal plan seems to be empty.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      // Call Backend AI
      try {
        const response = await fetch(getApiUrl('/plans/grocery-list'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients: allIngredients })
        });

        if (!response.ok) throw new Error("Failed to generate AI list");

        const data = await response.json();
        const aiItems = data.items;

        // Map AI items to GroceryItem structure
        const newList = aiItems.map((item: any, index: number) => ({
          id: `ai-${index}`,
          name: item.name,
          category: item.category || 'Other',
          quantity: item.quantity || '1',
          unit: '',
          checked: false,
          source: 'meal-plan'
        }));

        setGroceryList(newList);
        toast({
          title: "Smart List Generated! 🧠",
          description: `AI consolidated ${allIngredients.length} ingredients into ${newList.length} items.`,
        });

      } catch (err) {
        console.warn("AI Generation failed, falling back to basic list", err);
        // Fallback Logic (simplified from original)
        const ingredientsMap = new Map<string, GroceryItem>();
        let idCounter = 1;
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

        allIngredients.forEach(ing => {
          const name = ing.trim();
          if (!ingredientsMap.has(name)) {
            ingredientsMap.set(name, {
              id: String(idCounter++),
              name: name,
              category: categorizeIngredient(name),
              quantity: '1',
              unit: 'item',
              checked: false,
              source: 'meal-plan'
            });
          }
        });
        const fallbackList = Array.from(ingredientsMap.values());
        setGroceryList(fallbackList);
        toast({
          title: "Basic List Generated",
          description: "Used offline generation due to connection issue.",
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
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Color Palette
    const colors = {
      primary: [44, 98, 56], // Forest Green
      secondary: [76, 175, 80], // Lighter Green
      text: [33, 33, 33], // Dark Gray
      lightText: [100, 100, 100], // Light Gray
      accent: [240, 240, 240], // Light Background
      white: [255, 255, 255]
    };

    // Helper to get category color
    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'Produce': return [34, 197, 94]; // Green-500
        case 'Meat & Fish': return [239, 68, 68]; // Red-500
        case 'Dairy': return [59, 130, 246]; // Blue-500
        case 'Bakery': return [245, 158, 11]; // Amber-500
        case 'Grains': return [202, 138, 4]; // Yellow-600
        case 'Pantry': return [100, 116, 139]; // Slate-500
        default: return [107, 114, 128]; // Gray-500
      }
    };

    // --- Header ---
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text("My Smart Grocery List", margin, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 32);

    doc.setFontSize(10);
    doc.text("Eat Smart AI", pageWidth - margin - 25, 20);
    doc.text("www.eatsmart.ai", pageWidth - margin - 30, 28);

    // --- Content ---
    let yPos = 55;

    // Group items for layout
    const grouped: Record<string, GroceryItem[]> = {};
    groceryList.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    Object.keys(grouped).sort().forEach(cat => {
      const catColor = getCategoryColor(cat);

      // Check for page break needed for category header + at least one item
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 30; // Reset Y on new page
      }

      // Category Header
      doc.setFillColor(catColor[0], catColor[1], catColor[2]);
      doc.rect(margin, yPos, 4, 8, 'F'); // Colored accent bar

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(catColor[0], catColor[1], catColor[2]);
      doc.text(cat.toUpperCase(), margin + 8, yPos + 6);

      // Line separator
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, yPos + 10, pageWidth - margin, yPos + 10);

      yPos += 20;

      // Items
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

      grouped[cat].forEach(item => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = 30;
        }

        // Checkbox style
        const boxSize = 5;
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.5);

        if (item.checked) {
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, yPos - 4, boxSize, boxSize, 'FD');
          doc.setFont("zapfdingbats"); // Use ZapfDingbats for checkmark if available, or just draw lines
          doc.setFontSize(10);
          doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          doc.text("4", margin + 0.5, yPos); // approx checkmark in zapfdingbats
          // Fallback to plotting lines if zapfdingbats not desired:
          // doc.line(margin, yPos, margin + 2, yPos + 2); etc.
        } else {
          doc.rect(margin, yPos - 4, boxSize, boxSize);
        }

        // Reset font for text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

        const quantityText = item.quantity && item.quantity !== '1' ? `${item.quantity} ${item.unit || ''} ` : '';
        const itemText = `${quantityText}${item.name}`;

        doc.text(itemText, margin + 10, yPos);

        // Optional dot leader or spacing
        // doc.setDrawColor(240, 240, 240);
        // doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);

        yPos += 10;
      });

      yPos += 5; // Spacing after category
    });

    // --- Footer (Page Numbers) ---
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save('Eat-Smart-Grocery-List.pdf');

    toast({
      title: "Download Started",
      description: "Your enhanced grocery list is downloading!",
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
    <Card id="grocery-list" className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm transition-colors overflow-hidden h-[650px] flex flex-col">
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
                if (!user?.email) {
                  toast({
                    title: "Email Missing",
                    description: "Please complete your profile or login.",
                    variant: "destructive"
                  });
                  return;
                }

                const email = user.email;
                const items = groceryList.map(item => `${item.name} (${item.category})`);

                try {
                  toast({ title: "Sending Email...", description: `Sending to ${email}` });
                  await fetch(getApiUrl('/api/email-grocery-list'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, items })
                  });
                  toast({ title: "Email Sent", description: `Sent to ${email}` });
                } catch (e) {
                  toast({ title: "Error", description: "Failed to send email.", variant: "destructive" });
                }
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
      <CardContent className="pt-6 flex-1 flex flex-col min-h-0">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col min-h-0">
          <TabsList className="flex flex-wrap h-auto gap-3 mb-6 bg-transparent border-none p-0">
            {categories.filter(category => getCategoryCount(category) > 0).map((category) => (
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

          <TabsContent value={selectedCategory} className="space-y-6 flex-1 overflow-y-auto pr-2 pb-6 min-h-0">
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
