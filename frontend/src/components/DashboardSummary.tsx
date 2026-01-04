
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { analyticsService } from '@/services/analytics';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy, Calendar, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SummaryStats {
    current_streak: number;
    longest_streak: number;
    consistency_score: number;
    total_logs: number;
}

const DashboardSummary = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<SummaryStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.id) {
                try {
                    const data = await analyticsService.getAnalyticsSummary(user.id);
                    setStats(data);
                } catch (error) {
                    console.error("Failed to fetch summary stats", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchStats();
    }, [user]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-orange-600">Current Streak</p>
                        <h3 className="text-2xl font-bold text-orange-900">{stats.current_streak} Days</h3>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-full">
                        <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-600">Longest Streak</p>
                        <h3 className="text-2xl font-bold text-blue-900">{stats.longest_streak} Days</h3>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                        <Trophy className="w-6 h-6 text-blue-500" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-600">consistency (30d)</p>
                        <h3 className="text-2xl font-bold text-green-900">{stats.consistency_score}%</h3>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                        <Activity className="w-6 h-6 text-green-500" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-purple-600">Total Logs</p>
                        <h3 className="text-2xl font-bold text-purple-900">{stats.total_logs}</h3>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                        <Calendar className="w-6 h-6 text-purple-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardSummary;
