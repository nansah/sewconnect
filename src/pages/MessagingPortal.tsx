
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LocationState, Message, Measurements } from "@/types/messaging";
import { MessageList } from "@/components/messaging/MessageList";
import { MessageInput } from "@/components/messaging/MessageInput";
import { MeasurementsForm } from "@/components/messaging/MeasurementsForm";

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
  const [messages, setMessages] = useState<Message[]>([
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

        <MessageList messages={messages} />

        {showMeasurements && (
          <MeasurementsForm
            measurements={measurements}
            setMeasurements={setMeasurements}
            onCancel={() => setShowMeasurements(false)}
            onShare={handleShareMeasurements}
          />
        )}

        <MessageInput
          message={message}
          setMessage={setMessage}
          onSend={handleSend}
          onImageUpload={handleImageUpload}
          onMeasurementsClick={() => setShowMeasurements(true)}
        />
      </div>
    </div>
  );
};

export default MessagingPortal;
