
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { analyticsService } from '@/services/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, RefreshCw, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface CoachInsights {
    analysis: string;
    status: 'on_track' | 'at_risk' | 'off_track';
    suggestions: string[];
    encouragement: string;
}

const AICoach = () => {
    const { user } = useAuth();
    const [insights, setInsights] = useState<CoachInsights | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchInsights = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const data = await analyticsService.getCoachInsights(user.id);
            setInsights(data);
            toast({ title: "Analysis Complete", description: "The AI Coach has reviewed your progress." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to generate insights.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'on_track':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle className="w-3 h-3 mr-1" /> On Track</Badge>;
            case 'at_risk':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" /> Attention Needed</Badge>;
            case 'off_track':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200"><TrendingUp className="w-3 h-3 mr-1" /> Action Required</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Brain className="w-8 h-8 text-primary" />
                        AI Performance Coach
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Get personalized, data-driven advice based on your recent activity and goals.
                    </p>
                </div>
                <Button onClick={fetchInsights} disabled={isLoading} size="lg" className="gap-2">
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    {insights ? 'Refresh Analysis' : 'Analyze My Progress'}
                </Button>
            </div>

            {isLoading && (
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <div className="grid gap-4 md:grid-cols-3">
                            <Skeleton className="h-32" />
                            <Skeleton className="h-32" />
                            <Skeleton className="h-32" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {!isLoading && insights && (
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Assessment */}
                    <Card className="md:col-span-2 border-primary/20 bg-primary/5">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl text-primary">Assessment</CardTitle>
                                {getStatusBadge(insights.status)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg leading-relaxed text-gray-700">
                                "{insights.analysis}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-primary/10">
                                <p className="font-medium italic text-gray-600">
                                    Coach says: "{insights.encouragement}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Plan */}
                    <Card className="md:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl">Action Plan</CardTitle>
                            <CardDescription>Top 3 Priorities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {insights.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex gap-3 items-start">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm font-medium pt-0.5">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AICoach;
