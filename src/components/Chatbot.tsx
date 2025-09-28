

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X } from 'lucide-react';
import { faqs, FAQ } from '@/lib/faq';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const initialMessages: Message[] = [
  { sender: 'bot', text: "Hello! I'm the Eat Smart AI assistant. How can I help you today?" },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (text.trim() === '') return;

    const userMessage: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);

    const lowerCaseInput = text.toLowerCase();
    let botResponse: Message = {
      sender: 'bot',
      text: "I'm sorry, I can't answer that yet. Please try asking another question or contact our support team.",
    };

    let bestMatch: { faq: FAQ; score: number } | null = null;

    faqs.forEach((faq) => {
      let score = 0;
      faq.keywords.forEach((keyword) => {
        if (lowerCaseInput.includes(keyword)) {
          score++;
        }
      });
      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { faq, score };
      }
    });

    if (bestMatch) {
      botResponse.text = bestMatch.faq.answer;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInputValue('');
  };

  const handleSendMessage = () => {
    sendMessage(inputValue);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setMessages(initialMessages);
      }, 200);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageSquare className="w-8 h-8" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 mr-4 p-0" sideOffset={10}>
        <Card className="flex flex-col h-[400px] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Support Chat</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => handleOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 min-h-0">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg break-words ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {messages.length === 1 && (
                  <div className="space-y-2 pt-4">
                    <p className="text-sm text-muted-foreground">Or try one of these questions:</p>
                    {faqs.slice(0, 3).map((faq) => (
                      <Button
                        key={faq.question}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start h-auto whitespace-normal"
                        onClick={() => sendMessage(faq.question)}
                      >
                        {faq.question}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a question..."
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

