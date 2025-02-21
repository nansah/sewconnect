
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LocationState, Message, Measurements } from "@/types/messaging";
import { MessageList } from "@/components/messaging/MessageList";
import { MessageInput } from "@/components/messaging/MessageInput";
import { MeasurementsForm } from "@/components/messaging/MeasurementsForm";
import { Button } from "@/components/ui/button";
import { Send, FileCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  
  const { toast } = useToast();
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

  const handleSubmitOrder = async () => {
    try {
      // Get the last measurement message if it exists
      const lastMeasurement = messages.find(msg => msg.type === 'measurements');
      
      // Create the order in the queue
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            seamstress_id: seamstress.id || '',
            customer_name: "Customer Name", // This should come from auth context in a real app
            status: 'queued',
            measurements: lastMeasurement?.text || '',
            conversation: messages
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Order Submitted",
        description: "Your order has been sent to the seamstress.",
      });

      // Add a system message to show the order was submitted
      setMessages(prev => [...prev, {
        text: "✨ Order has been submitted successfully",
        sender: "seamstress",
        type: "system"
      } as Message]);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit order. Please try again.",
      });
    }
  };

  // Check if measurements have been shared to enable submit button
  const hasMeasurements = messages.some(msg => msg.type === 'measurements');

  return (
    <div className="min-h-screen bg-secondary p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-primary/10 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <img 
              src={seamstress.image} 
              alt={seamstress.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <h2 className="text-xl font-semibold">{seamstress.name}</h2>
          </div>
          {hasMeasurements && (
            <Button 
              onClick={handleSubmitOrder}
              className="bg-accent hover:bg-accent/90"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Submit Order
            </Button>
          )}
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
