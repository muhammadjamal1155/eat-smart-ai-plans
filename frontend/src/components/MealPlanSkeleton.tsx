import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MealPlanSkeleton = () => {
    return (
        <div className="space-y-8">
            {[1, 2, 3].map((day) => (
                <div key={day} className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((meal) => (
                            <Card key={meal} className="h-full">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <div className="flex gap-1">
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MealPlanSkeleton;
