
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Send } from "lucide-react";

interface LocationState {
  seamstress: {
    name: string;
    image: string;
  };
}

const MessagingPortal = () => {
  const location = useLocation();
  const { seamstress } = (location.state as LocationState) || { 
    seamstress: { name: "Seamstress", image: "" } 
  };
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string; sender: "user" | "seamstress"}>>([
    {
      text: `Hello! I'm ${seamstress.name}. How can I help you today?`,
      sender: "seamstress"
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { text: message, sender: "user" }]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-secondary p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-primary/10 flex items-center gap-4 border-b">
          <img 
            src={seamstress.image} 
            alt={seamstress.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <h2 className="text-xl font-semibold">{seamstress.name}</h2>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[500px] p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-secondary"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagingPortal;
