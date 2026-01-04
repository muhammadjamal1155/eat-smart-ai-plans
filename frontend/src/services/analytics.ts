const API_URL = 'http://localhost:5000'; // Adjust if environment variable available

export const analyticsService = {
    async logDailyStats(data: any) {
        const response = await fetch(`${API_URL}/analytics/log`, {
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
        const response = await fetch(`${API_URL}/analytics/history?user_id=${userId}&days=${days}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        return response.json();
    },

    async saveGoal(goal: any, userId: string) {
        const response = await fetch(`${API_URL}/goals`, {
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
        const response = await fetch(`${API_URL}/goals?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch goals');
        return response.json();
    },

    async getCoachInsights(userId: string) {
        const response = await fetch(`${API_URL}/insights/coach`, {
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
        const response = await fetch(`${API_URL}/analytics/summary?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch summary');
        return response.json();
    },
};
