
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border border-border">
                    <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground rounded-t-lg">
                        <h3 className="font-semibold">NutriGuide Assistant</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-primary-foreground hover:bg-primary/90"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="text-sm text-muted-foreground text-center">
                            Hello {user?.name || 'there'}! How can I help you with your meal plan today?
                        </div>
                    </div>
                    <div className="p-4 border-t">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-12 w-12 rounded-full shadow-lg"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
};

export default Chatbot;
