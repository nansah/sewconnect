import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LocationState, Message, Measurements } from "@/types/messaging";
import { MessageList } from "@/components/messaging/MessageList";
import { MessageInput } from "@/components/messaging/MessageInput";
import { MeasurementsForm } from "@/components/messaging/MeasurementsForm";
import { ConversationHeader } from "@/components/messaging/ConversationHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useConversation } from "@/hooks/useConversation";
import { DeliveryTimeframe } from "@/components/inspiration/DeliveryTimeframe";
import { DeliveryTimeframe as DeliveryTimeframeType } from "@/types/inspiration";

const DEFAULT_MEASUREMENTS: Measurements = {
  bust: "",
  waist: "",
  hips: "",
  height: "",
  shoulderToWaist: "",
  waistToKnee: ""
};

const MessagingPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seamstress } = (location.state as LocationState) || { 
    seamstress: {
      id: "demo-seamstress-123",
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=400&h=400&fit=crop"
    }
  };

  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>(DEFAULT_MEASUREMENTS);
  const [showDeliveryTimeframe, setShowDeliveryTimeframe] = useState(false);
  
  const { messages, conversationId, loading, updateConversation } = useConversation(seamstress);

  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;
    
    const newMessage: Message = {
      text: message,
      sender: "user",
      created_at: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    const success = await updateConversation(updatedMessages);
    
    if (success) {
      setMessage("");
      // Simulate seamstress response
      setTimeout(async () => {
        const responseMessage: Message = {
          text: "Thank you for your message! I'll be happy to help you with your request.",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
        updateConversation([...updatedMessages, responseMessage]);
      }, 1000);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !conversationId) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      const newMessage: Message = {
        text: imageUrl,
        sender: "user",
        type: "image",
        created_at: new Date().toISOString()
      };

      const updatedMessages = [...messages, newMessage];
      const success = await updateConversation(updatedMessages);
      
      if (success) {
        setTimeout(async () => {
          const responseMessage: Message = {
            text: "Thanks for sharing the image! This will help me understand your requirements better.",
            sender: "seamstress",
            created_at: new Date().toISOString()
          };
          updateConversation([...updatedMessages, responseMessage]);
        }, 1000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleShareMeasurements = async () => {
    if (!conversationId) return;

    const measurementText = Object.entries(measurements)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    if (measurementText) {
      const newMessage: Message = {
        text: measurementText,
        sender: "user",
        type: "measurements",
        created_at: new Date().toISOString()
      };

      const updatedMessages = [...messages, newMessage];
      const success = await updateConversation(updatedMessages);
      
      if (success) {
        setShowMeasurements(false);
        setTimeout(async () => {
          const responseMessage: Message = {
            text: "Perfect! I've received your measurements. This will help me create the perfect fit for you.",
            sender: "seamstress",
            created_at: new Date().toISOString()
          };
          updateConversation([...updatedMessages, responseMessage]);
        }, 1000);
      }
    }
  };

  const handleSubmitOrder = async () => {
    try {
      if (!conversationId) return;

      const measurementMsg = messages.find(msg => msg.type === 'measurements');
      const inspirationMsg = messages.find(msg => msg.type === 'image');

      const orderDetails = {
        price: "$250",
        timeframe: "2 weeks",
        measurements: measurementMsg?.text || '',
        inspiration: inspirationMsg?.text || '',
      };

      const conversationData = {
        messages: messages.map(msg => ({
          text: msg.text,
          sender: msg.sender,
          type: msg.type || null,
          created_at: msg.created_at
        })),
        orderDetails
      };

      const { error } = await supabase
        .from('orders')
        .insert({
          conversation_id: conversationId,
          seamstress_id: seamstress.id,
          customer_name: "Demo Customer",
          status: 'queued',
          measurements: measurementMsg?.text || '',
          conversation: conversationData
        });

      if (error) throw error;

      toast({
        title: "Order Submitted",
        description: "Your order has been sent to the seamstress.",
      });

      const orderConfirmMessage: Message = {
        text: "✨ Order has been submitted successfully",
        sender: "seamstress",
        type: "system",
        created_at: new Date().toISOString()
      };

      await updateConversation([...messages, orderConfirmMessage]);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit order. Please try again.",
      });
    }
  };

  const handleTimeframeSelect = async (timeframe: DeliveryTimeframeType) => {
    if (!conversationId) return;

    const newMessage: Message = {
      text: `Preferred delivery date: ${timeframe.date.toLocaleDateString()}\nDelivery speed: ${timeframe.urgency}`,
      sender: "user",
      type: "delivery",
      created_at: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    const success = await updateConversation(updatedMessages);
    
    if (success) {
      setShowDeliveryTimeframe(false);
      setTimeout(async () => {
        const responseMessage: Message = {
          text: "Thank you for selecting your delivery timeframe. I'll make sure to accommodate your schedule.",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
        updateConversation([...updatedMessages, responseMessage]);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBE2D3] p-4 flex items-center justify-center">
        Loading conversation...
      </div>
    );
  }

  const hasMeasurements = messages.some(msg => msg.type === 'measurements');

  return (
    <div className="min-h-screen bg-[#EBE2D3] p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <ConversationHeader 
          seamstress={seamstress}
          hasMeasurements={hasMeasurements}
          onSubmitOrder={handleSubmitOrder}
        />

        <MessageList messages={messages} />

        {showMeasurements && (
          <MeasurementsForm
            measurements={measurements}
            setMeasurements={setMeasurements}
            onCancel={() => setShowMeasurements(false)}
            onShare={handleShareMeasurements}
          />
        )}

        {showDeliveryTimeframe && (
          <DeliveryTimeframe
            onTimeframeSelect={handleTimeframeSelect}
          />
        )}

        <MessageInput
          message={message}
          setMessage={setMessage}
          onSend={handleSend}
          onImageUpload={handleImageUpload}
          onMeasurementsClick={() => setShowMeasurements(true)}
          onDeliveryTimeframeClick={() => setShowDeliveryTimeframe(true)}
        />
      </div>
    </div>
  );
};

export default MessagingPortal;
