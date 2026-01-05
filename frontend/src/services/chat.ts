const API_URL = 'http://localhost:5000'; // Adjust if environment variable available

export interface ChatResponse {
    response: string;
    error?: string;
}

export const chatService = {
    async sendMessage(message: string, context?: any): Promise<ChatResponse> {
        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, context }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Chat service error:", error);
            return { response: "I'm having trouble connecting right now. Please try again later.", error: String(error) };
        }
    }
};
