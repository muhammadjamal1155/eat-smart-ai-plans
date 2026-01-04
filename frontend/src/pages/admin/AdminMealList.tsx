import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Edit,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Plus
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface AdminMeal {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    tags: string[];
}

export default function AdminMealList() {
    const [meals, setMeals] = useState<AdminMeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch meals
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:5000/admin/meals?page=${page}&search=${debouncedSearch}`)
            .then(res => res.json())
            .then(data => {
                setMeals(data.meals || []);
                setTotalPages(data.pages || 1);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch meals", err);
                setLoading(false);
            });
    }, [page, debouncedSearch]);

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            // Simulation
            toast({
                title: "Meal Deleted",
                description: `${name} has been removed from the database. (Simulated)`,
            });
            // In real app: call DELETE API then refresh
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Food Listings</h2>
                    <p className="text-muted-foreground">Manage your recipe inventory.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New Recipe
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search recipes..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Meal Name</TableHead>
                            <TableHead>Calories</TableHead>
                            <TableHead className="hidden md:table-cell">Macros (P/C/F)</TableHead>
                            <TableHead className="hidden lg:table-cell">Tags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : meals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No meals found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            meals.map((meal) => (
                                <TableRow key={meal.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        #{meal.id.slice(0, 6)}...
                                    </TableCell>
                                    <TableCell className="font-medium">{meal.name}</TableCell>
                                    <TableCell>{meal.calories}</TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                        {meal.protein}g / {meal.carbs}g / {meal.fats}g
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {meal.tags.map(t => (
                                                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                onClick={() => handleDelete(meal.id, meal.name)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
