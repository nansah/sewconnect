
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LocationState, Message, Measurements } from "@/types/messaging";
import { MessageList } from "@/components/messaging/MessageList";
import { MessageInput } from "@/components/messaging/MessageInput";
import { MeasurementsForm } from "@/components/messaging/MeasurementsForm";
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
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

// Demo seamstress data
const DEMO_SEAMSTRESS = {
  id: "demo-seamstress-123",
  name: "Sarah the Seamstress",
  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
};

const MessagingPortal = () => {
  const location = useLocation();
  const { seamstress } = (location.state as LocationState) || { seamstress: DEMO_SEAMSTRESS };
  
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>(DEFAULT_MEASUREMENTS);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `Hello! I'm ${seamstress.name}. How can I help you today?`,
      sender: "seamstress"
    },
    {
      text: "Let's discuss your order! The price will be $250 and I can complete it within 2 weeks.",
      sender: "seamstress"
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { text: message, sender: "user" }]);
    setMessage("");

    // Add demo response after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Thank you for your message! I'll be happy to help you with your request.",
        sender: "seamstress"
      }]);
    }, 1000);
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

        // Add demo response after image upload
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Thanks for sharing the image! This will help me understand your requirements better.",
            sender: "seamstress"
          }]);
        }, 1000);
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

      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "Perfect! I've received your measurements. This will help me create the perfect fit for you.",
          sender: "seamstress"
        }]);
      }, 1000);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      // Get the last measurement message
      const measurementMsg = messages.find(msg => msg.type === 'measurements');
      
      // Get the last image as inspiration
      const inspirationMsg = messages.find(msg => msg.type === 'image');

      // Extract demo price and timeframe from the conversation
      const orderDetails = {
        price: "$250",
        timeframe: "2 weeks",
        measurements: measurementMsg?.text || '',
        inspiration: inspirationMsg?.text || '',
      };

      const { error } = await supabase
        .from('orders')
        .insert({
          seamstress_id: seamstress.id,
          customer_name: "Demo Customer",
          status: 'queued',
          measurements: measurementMsg?.text || '',
          conversation: JSON.stringify({
            messages,
            orderDetails
          })
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Order Submitted",
        description: "Your order has been sent to the seamstress.",
      });

      setMessages(prev => [...prev, {
        text: "✨ Order has been submitted successfully",
        sender: "seamstress",
        type: "system"
      }]);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Demo Mode: Order Submitted",
        description: "In a real app, this would be sent to the seamstress.",
      });

      setMessages(prev => [...prev, {
        text: "✨ Demo Mode: Order has been submitted successfully",
        sender: "seamstress",
        type: "system"
      }]);
    }
  };

  // Check if measurements have been shared to enable submit button
  const hasMeasurements = messages.some(msg => msg.type === 'measurements');

  return (
    <div className="min-h-screen bg-[#EBE2D3] p-4">
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
              className="bg-accent hover:bg-accent/90 text-white"
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
