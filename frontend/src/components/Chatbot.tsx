import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X } from "lucide-react";
import { faqs as helpCenterFaqs } from "@/lib/faq";

interface Message {
  role: "user" | "bot";
  text: string;
  sourceQuestion?: string;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestedFaqs = useMemo(() => helpCenterFaqs.slice(0, 6), []);

  const toggleChat = () => {
    if (isOpen) {
      setMessages([]);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const findFaqAnswer = (query: string) => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return null;

    return (
      helpCenterFaqs.find((faq) => {
        const questionMatch =
          normalize(faq.question).includes(normalizedQuery) ||
          normalizedQuery.includes(normalize(faq.question));

        const keywordMatch = faq.keywords?.some((keyword) =>
          normalizedQuery.includes(normalize(keyword))
        );

        return questionMatch || keywordMatch;
      }) || null
    );
  };

  const handleSend = (text?: string) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;

    const faqMatch = findFaqAnswer(userMessage);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
      faqMatch
        ? { role: "bot", text: faqMatch.answer, sourceQuestion: faqMatch.question }
        : {
            role: "bot",
            text: "I couldn't find an exact match for that. Try rephrasing your question or visit the Help Center for more topics.",
          },
    ]);
    setInput("");
  };

  const renderBotMessage = (message: Message) => {
    if (message.role !== "bot") return message.text;

    return (
      <div className="space-y-2">
        {message.sourceQuestion && (
          <p className="text-xs font-semibold text-blue-600">FAQ: {message.sourceQuestion}</p>
        )}
        <p>{message.text}</p>
        <p className="text-[11px] text-muted-foreground">
          Looking for more? Visit the Help Center for all FAQs.
        </p>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg relative"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="absolute bottom-16 right-0 w-80 md:w-96"
        >
          <Card className="flex flex-col h-[500px] shadow-xl border rounded-2xl">
            <div className="bg-blue-600 text-white p-3 rounded-t-2xl font-semibold">
              NutriGuide Help Assistant
            </div>

            <ScrollArea className="flex-1 p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-muted-foreground text-sm mb-3">
                  Hi! I'm NutriGuide's helper. Ask about common topics or pick an FAQ shortcut below.
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 max-w-[85%] rounded-xl ${msg.role === "user" ? "ml-auto bg-blue-100 text-blue-900" : "mr-auto bg-gray-100 text-gray-800"}`} 
                >
                  {msg.role === "bot" ? renderBotMessage(msg) : msg.text}
                </div>
              ))}

              {messages.length === 0 && (
                <div className="space-y-2 pt-4">
                  <p className="text-sm text-muted-foreground">Popular questions:</p>
                  <ScrollArea className="max-h-32 pr-2">
                    <div className="space-y-2">
                      {suggestedFaqs.map((faq, i) => (
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

            <div className="flex items-center gap-2 border-t p-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={() => handleSend()} className="bg-blue-600 text-white">
                <Send size={18} />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
