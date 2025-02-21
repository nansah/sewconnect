
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Send, Image, Ruler } from "lucide-react";

interface LocationState {
  seamstress: {
    name: string;
    image: string;
  };
}

interface Measurements {
  bust: string;
  waist: string;
  hips: string;
  height: string;
  shoulderToWaist: string;
  waistToKnee: string;
}

const DEFAULT_MEASUREMENTS: Measurements = {
  bust: "",
  waist: "",
  hips: "",
  height: "",
  shoulderToWaist: "",
  waistToKnee: ""
};

const MessagingPortal = () => {
  const location = useLocation();
  const { seamstress } = (location.state as LocationState) || { 
    seamstress: { name: "Seamstress", image: "" } 
  };
  
  const [message, setMessage] = useState("");
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>(DEFAULT_MEASUREMENTS);
  const [messages, setMessages] = useState<Array<{text: string; sender: "user" | "seamstress"; type?: "measurements" | "image"}>>([
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setMessages(prev => [...prev, { 
          text: imageUrl,
          sender: "user",
          type: "image"
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareMeasurements = () => {
    const measurementText = Object.entries(measurements)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    if (measurementText) {
      setMessages(prev => [...prev, {
        text: measurementText,
        sender: "user",
        type: "measurements"
      }]);
      setShowMeasurements(false);
    }
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
                  {msg.type === "image" ? (
                    <img src={msg.text} alt="Inspiration" className="max-w-full rounded" />
                  ) : msg.type === "measurements" ? (
                    <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Measurements Form */}
        {showMeasurements && (
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(measurements).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <Input
                    value={value}
                    onChange={(e) => setMeasurements(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    placeholder="in inches"
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMeasurements(false)}>
                Cancel
              </Button>
              <Button onClick={handleShareMeasurements}>
                Share Measurements
              </Button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2 mb-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowMeasurements(true)}
            >
              <Ruler className="h-4 w-4" />
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button variant="outline" size="icon" type="button">
                <Image className="h-4 w-4" />
              </Button>
            </label>
          </div>
          <div className="flex gap-2">
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
    </div>
  );
};

export default MessagingPortal;
