import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X } from "lucide-react";
import { faqs as helpCenterFaqs } from "@/lib/faq";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestedFaqs = useMemo(() => helpCenterFaqs.slice(0, 6), []);

  const toggleChat = () => {
    if (isOpen) {
      // Optional: clear messages on close
      // setMessages([]);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const findFaqAnswer = (query: string) => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return null;

    return (
      helpCenterFaqs.find((faq) => {
        // Only match if the user asks something very close to the specific FAQ title
        // or if they clicked one of the suggested buttons (which sends the exact question)
        const questionMatch =
          normalize(faq.question) === normalizedQuery ||
          (normalize(faq.question).includes(normalizedQuery) && normalizedQuery.length > 10);

        return questionMatch;
      }) || null
    );
  };

  const handleSend = async (text?: string) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;

    // 1. Check local FAQs first (instant response)
    const faqMatch = findFaqAnswer(userMessage);

    // Initial user message
    const newMessages = [
      ...messages,
      { role: "user" as const, text: userMessage }
    ];
    setMessages(newMessages);
    setInput("");

    if (faqMatch) {
      setMessages(prev => [
        ...prev,
        { role: "bot" as const, text: faqMatch.answer, sourceQuestion: faqMatch.question }
      ]);
      return;
    }

    // 2. If no FAQ, ask the AI Backend
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [
        ...prev,
        { role: "bot" as const, text: data.response }
      ]);

    } catch (err) {
      console.error("Chat Error", err);
      setMessages(prev => [
        ...prev,
        {
          role: "bot" as const,
          text: "I'm having trouble connecting to the kitchen server right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBotMessage = (message: Message) => {
    if (message.role !== "bot") return message.text;

    return (
      <div className="space-y-2">
        {message.sourceQuestion && (
          <p className="text-xs font-semibold text-blue-600">FAQ: {message.sourceQuestion}</p>
        )}
        <div className="prose prose-sm dark:prose-invert max-w-none text-sm break-words [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.text}
          </ReactMarkdown>
        </div>
        {!message.sourceQuestion && (
          <p className="text-[10px] text-muted-foreground pt-1 border-t mt-2">
            AI-generated advice. Cook thoroughly.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg relative"
        animate={{ opacity: [1, 0.9, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
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
          <Card className="flex flex-col h-[500px] shadow-xl border rounded-2xl bg-white dark:bg-gray-800">
            <div className="bg-blue-600 text-white p-3 rounded-t-2xl font-semibold flex items-center gap-2">
              <span className="text-lg">👨‍🍳</span>
              NutriGuide Chef
            </div>

            <ScrollArea className="flex-1 p-3 space-y-3 bg-gray-50 dark:bg-gray-900/50">
              {messages.length === 0 && (
                <div className="text-muted-foreground text-sm mb-3 p-2 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-100 dark:border-blue-900">
                  Hi! I'm your AI Chef. Ask me for recipes, substitutions, or cooking tips!
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 max-w-[85%] rounded-xl text-sm ${msg.role === "user"
                      ? "ml-auto bg-blue-600 text-white rounded-br-none"
                      : "mr-auto bg-white dark:bg-gray-800 border shadow-sm text-gray-800 dark:text-gray-100 rounded-bl-none"
                    }`}
                >
                  {msg.role === "bot" ? renderBotMessage(msg) : msg.text}
                </div>
              ))}

              {isLoading && (
                <div className="mr-auto bg-white dark:bg-gray-800 border shadow-sm p-3 rounded-xl rounded-bl-none w-fit">
                  <div className="flex space-x-1 h-4 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}

              {messages.length === 0 && (
                <div className="space-y-2 pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Suggestions</p>
                  <div className="grid gap-2">
                    <Button variant="outline" size="sm" className="justify-start h-auto py-2 text-left whitespace-normal" onClick={() => handleSend("What can I substitute for eggs?")}>
                      🥚 Egg Substitutes
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start h-auto py-2 text-left whitespace-normal" onClick={() => handleSend("Give me a healthy breakfast idea")}>
                      🥗 Healthy Breakfast
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start h-auto py-2 text-left whitespace-normal" onClick={() => handleSend("How do I make pasta spicy?")}>
                      🌶️ Spicy Pasta Tips
                    </Button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="flex items-center gap-2 border-t p-3 bg-white dark:bg-gray-800 rounded-b-2xl">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the chef..."
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                disabled={isLoading}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-blue-500"
              />
              <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="bg-blue-600 text-white hover:bg-blue-700 shrink-0">
                <Send size={18} />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
