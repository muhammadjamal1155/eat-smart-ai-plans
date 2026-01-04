import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    TrendingUp,
    Users,
    Utensils,
    DollarSign,
    Activity,
    Leaf,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Mock Data for "CRM" and "Finance" aspects until backend support exists
const MOCK_REVENUE = {
    total: "12,450",
    growth: "+12.5%",
    isPositive: true
};

const MOCK_USERS = {
    active: "1,240",
    new: "+150",
    isPositive: true
};

interface AdminStats {
    total_meals: number;
    avg_calories: number;
    top_tags: Record<string, number>;
    diet_stats: Record<string, number>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, use SWR or React Query
        fetch('http://localhost:5000/admin/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch admin stats", err);
                setLoading(false);
            });
    }, []);

    const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-20 mb-1" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                    {trend && (
                        <span className={cn(
                            "mr-1 flex items-center",
                            trend.isPositive ? "text-green-500" : "text-red-500"
                        )}>
                            {trend.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                            {trend.value}
                        </span>
                    )}
                    {subtext}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your meal planner application performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={`$${MOCK_REVENUE.total}`}
                    icon={DollarSign}
                    trend={{ value: MOCK_REVENUE.growth, isPositive: MOCK_REVENUE.isPositive }}
                    subtext="from last month"
                />
                <StatCard
                    title="Active Users"
                    value={MOCK_USERS.active}
                    icon={Users}
                    trend={{ value: MOCK_USERS.new, isPositive: MOCK_USERS.isPositive }}
                    subtext="new users this month"
                />
                <StatCard
                    title="Total Recipes"
                    value={stats?.total_meals || 0}
                    icon={Utensils}
                    subtext="active meals in database"
                />
                <StatCard
                    title="Avg. Calories"
                    value={stats?.avg_calories || 0}
                    icon={Activity}
                    subtext="per meal"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Cuisine Popularity</CardTitle>
                        <CardDescription>
                            Most common tags across your recipe database.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-[200px] w-full" /> : (
                            <div className="space-y-4">
                                {stats?.top_tags && Object.entries(stats.top_tags).slice(0, 5).map(([tag, count], i) => (
                                    <div key={tag} className="flex items-center">
                                        <div className="w-full max-w-sm flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium capitalize">{tag}</span>
                                                <span className="text-sm text-muted-foreground">{count} meals</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${(count / (Object.values(stats.top_tags)[0] || 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Dietary Distribution</CardTitle>
                        <CardDescription>
                            Breakdown of specialized diet options.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-[200px] w-full" /> : (
                            <div className="grid gap-4">
                                {stats?.diet_stats && Object.entries(stats.diet_stats).map(([diet, count]) => (
                                    <div key={diet} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-md shadow-sm">
                                                <Leaf className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium capitalize">{diet}</div>
                                                <div className="text-xs text-muted-foreground">Certified Recipes</div>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-base">
                                            {count}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Recent Activity could go here */}
        </div>
    );
}
