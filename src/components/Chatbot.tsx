"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X } from "lucide-react";

interface Message {
  role: "user" | "bot";
  text: string;
}

const faqs = [
  { question: "What is my average calorie intake?" },
  { question: "How much protein do I consume weekly?" },
  { question: "Show me my water intake this month" },
  { question: "How many workout days do I have this quarter?" },
  { question: "What are my personalised meal plans?" },
  { question: "Give me a nutrition report for today" },
  { question: "Compare my diet progress this month vs last month" },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear chat when closing
  const toggleChat = () => {
    if (isOpen) {
      setMessages([]);
    }
    setIsOpen(!isOpen);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `Here’s the answer for: "${userMessage}"` },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg relative"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="absolute bottom-16 right-0 w-80 md:w-96"
        >
          <Card className="flex flex-col h-[500px] shadow-xl border rounded-2xl">
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 rounded-t-2xl font-semibold">
              NutriGuide AI Assistant
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-gray-500 text-sm mb-3">
                  👋 Hi! I’m your NutriGuide AI. Ask me about your nutrition,
                  workouts, or progress.
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 max-w-[85%] rounded-xl ${
                    msg.role === "user"
                      ? "ml-auto bg-blue-100 text-blue-900"
                      : "mr-auto bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {/* Default Suggested Questions */}
              {messages.length === 0 && (
                <div className="space-y-2 pt-4">
                  <p className="text-sm text-gray-500">
                    Try asking one of these:
                  </p>
                  <ScrollArea className="max-h-32 pr-2">
                    <div className="space-y-2">
                      {faqs.map((faq, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start whitespace-normal"
                          onClick={() => handleSend(faq.question)}
                        >
                          {faq.question}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Box */}
            <div className="flex items-center gap-2 border-t p-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                onClick={() => handleSend()}
                className="bg-blue-600 text-white"
              >
                <Send size={18} />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
