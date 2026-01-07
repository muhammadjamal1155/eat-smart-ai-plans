
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { day: "Mon", calories: 2100, goal: 2200 },
    { day: "Tue", calories: 1950, goal: 2200 },
    { day: "Wed", calories: 2050, goal: 2200 },
    { day: "Thu", calories: 1800, goal: 2200 },
    { day: "Fri", calories: 2150, goal: 2200 },
    { day: "Sat", calories: 2300, goal: 2200 },
    { day: "Sun", calories: 2000, goal: 2200 },
];

export function HeroGraph() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-sm"
        >
            <Card className="bg-card/90 backdrop-blur-sm border-primary/20 shadow-xl overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Weekly Calorie Tracker
                    </CardTitle>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">2,050</span>
                        <span className="text-xs text-muted-foreground">avg kcal/day</span>
                    </div>
                </CardHeader>
                <CardContent className="h-[200px] w-full p-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#bef264" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#bef264" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border border-border/50 bg-background/95 backdrop-blur-sm p-3 shadow-xl">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Calories
                                                        </span>
                                                        <span className="font-bold text-foreground">
                                                            {payload[0].value}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="calories"
                                stroke="#bef264"
                                strokeWidth={3}
                                fill="url(#colorCalories)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
}
