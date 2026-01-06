import { getApiUrl } from "@/lib/api";

export const analyticsService = {
    async logDailyStats(data: any) {
        const response = await fetch(getApiUrl('/analytics/log'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to log stats');
        return response.json();
    },

    async getHistory(userId: string, days: number = 30) {
        const response = await fetch(getApiUrl(`/analytics/history?user_id=${userId}&days=${days}`));
        if (!response.ok) throw new Error('Failed to fetch history');
        return response.json();
    },

    async saveGoal(goal: any, userId: string) {
        const response = await fetch(getApiUrl('/goals'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ goal, user_id: userId }),
        });
        if (!response.ok) throw new Error('Failed to save goal');
        return response.json();
    },

    async getGoals(userId: string) {
        const response = await fetch(getApiUrl(`/goals?user_id=${userId}`));
        if (!response.ok) throw new Error('Failed to fetch goals');
        return response.json();
    },

    async getCoachInsights(userId: string) {
        const response = await fetch(getApiUrl('/insights/coach'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });
        if (!response.ok) throw new Error('Failed to fetch coach insights');
        return response.json();
    },

    async getAnalyticsSummary(userId: string) {
        const response = await fetch(getApiUrl(`/analytics/summary?user_id=${userId}`));
        if (!response.ok) throw new Error('Failed to fetch summary');
        return response.json();
    },

    async logMeal(userId: string, meal: { calories: number; protein: number; carbs: number; fats: number; name?: string }) {
        const response = await fetch(getApiUrl('/analytics/log-meal'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                ...meal
            }),
        });
        if (!response.ok) throw new Error('Failed to log meal');
        return response.json();
    },

    async savePlan(userId: string, planData: any) {
        const response = await fetch(getApiUrl('/plans'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, plan_data: planData })
        });
        if (!response.ok) throw new Error('Failed to save plan');
        return response.json();
    },

    async getPlan(userId: string) {
        const response = await fetch(getApiUrl(`/plans?user_id=${userId}`));
        if (!response.ok) throw new Error('Failed to fetch plan');
        return response.json();
    }
};
