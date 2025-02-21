
import { useState, useEffect } from "react";
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

const MessagingPortal = () => {
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    initializeConversation();
    return () => {
      // Cleanup Supabase realtime subscription
      supabase.removeAllChannels();
    };
  }, []);

  const initializeConversation = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Check for existing conversation
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('seamstress_id', seamstress.id)
      .single();

    if (existingConv) {
      setConversationId(existingConv.id);
      setMessages(existingConv.messages || []);
    } else {
      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          user_id: session.user.id,
          seamstress_id: seamstress.id,
          messages: [{
            text: `Hello! I'm ${seamstress.name}. How can I help you today?`,
            sender: "seamstress",
            created_at: new Date().toISOString()
          }]
        })
        .select()
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create conversation.",
        });
        return;
      }

      setConversationId(newConv.id);
      setMessages(newConv.messages || []);
    }

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`conversation-${existingConv?.id || 'new'}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${existingConv?.id}`
        },
        (payload) => {
          if (payload.new.messages) {
            setMessages(payload.new.messages);
          }
        }
      )
      .subscribe();
  };

  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;
    
    const newMessage: Message = {
      text: message,
      sender: "user",
      created_at: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    
    const { error } = await supabase
      .from('conversations')
      .update({ messages: updatedMessages })
      .eq('id', conversationId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message.",
      });
      return;
    }

    setMessage("");

    // Simulate seamstress response
    setTimeout(async () => {
      const responseMessage: Message = {
        text: "Thank you for your message! I'll be happy to help you with your request.",
        sender: "seamstress",
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('conversations')
        .update({ 
          messages: [...updatedMessages, responseMessage]
        })
        .eq('id', conversationId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update conversation.",
        });
      }
    }, 1000);
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
      
      const { error } = await supabase
        .from('conversations')
        .update({ messages: updatedMessages })
        .eq('id', conversationId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send image.",
        });
        return;
      }

      // Simulate seamstress response
      setTimeout(async () => {
        const responseMessage: Message = {
          text: "Thanks for sharing the image! This will help me understand your requirements better.",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('conversations')
          .update({ 
            messages: [...updatedMessages, responseMessage]
          })
          .eq('id', conversationId);

        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update conversation.",
          });
        }
      }, 1000);
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
      
      const { error } = await supabase
        .from('conversations')
        .update({ messages: updatedMessages })
        .eq('id', conversationId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to share measurements.",
        });
        return;
      }

      setShowMeasurements(false);

      // Simulate seamstress response
      setTimeout(async () => {
        const responseMessage: Message = {
          text: "Perfect! I've received your measurements. This will help me create the perfect fit for you.",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('conversations')
          .update({ 
            messages: [...updatedMessages, responseMessage]
          })
          .eq('id', conversationId);

        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update conversation.",
          });
        }
      }, 1000);
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

      await supabase
        .from('conversations')
        .update({ 
          messages: [...messages, orderConfirmMessage],
          status: 'ordered'
        })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit order. Please try again.",
      });
    }
  };

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
