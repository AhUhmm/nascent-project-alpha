
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "system";
  timestamp: Date;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Welcome to Stratum. I'm your AI assistant and can help you analyze the data within your strata. What would you like to know?",
      sender: "system",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const systemResponse: Message = {
        id: `system-${Date.now()}`,
        text: `This is a simulated response to "${input}". In a real application, this would connect to an LLM API to provide insights about your data.`,
        sender: "system",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, systemResponse]);
    }, 1000);
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-sidebar z-30 border-l transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-14 border-b flex items-center justify-between px-4">
        <h2 className="font-semibold">AI Assistant</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col h-[calc(100%-3.5rem)]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg max-w-[90%] ${
                  message.sender === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
