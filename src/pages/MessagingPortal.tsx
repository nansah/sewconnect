import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatHeader } from "@/components/messaging/ChatHeader";
import { ChatMessages } from "@/components/messaging/ChatMessages";
import { ChatInput } from "@/components/messaging/ChatInput";
import {
  Message,
  Seamstress,
  LocationState,
  Measurements,
  DeliveryTimeframe
} from "@/types/messaging";

const MessagingPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [seamstress, setSeamstress] = useState<Seamstress>({ id: '', name: '', image: '' });
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>({
    bust: '',
    waist: '',
    hips: '',
    height: '',
    shoulderToWaist: '',
    waistToKnee: ''
  });
  const [isDeliveryTimeframeOpen, setIsDeliveryTimeframeOpen] = useState(false);
  const [deliveryTimeframe, setDeliveryTimeframe] = useState<DeliveryTimeframe>({
    date: new Date(),
    urgency: "standard"
  });
  const [designToShare, setDesignToShare] = useState<{ imageUrl: string; description: string; } | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const locationState = location.state as LocationState | null;

    if (locationState?.seamstress) {
      setSeamstress(locationState.seamstress);
    }

    if (locationState?.designToShare) {
      setDesignToShare(locationState.designToShare);
    }

    const conversationIdFromState = (location.state as any)?.conversationId;
    if (conversationIdFromState) {
      setConversationId(conversationIdFromState);
      fetchMessages(conversationIdFromState);
    } else if (locationState?.seamstress?.id) {
      // If no conversationId, check for an existing conversation or create a new one
      checkExistingConversation(locationState.seamstress.id);
    } else {
      setIsLoading(false);
    }
  }, [location.state, location, navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const checkExistingConversation = async (seamstressId: string) => {
    // For demo seamstress, just set up demo conversation
    if (seamstressId === "demo-seamstress-123") {
      setConversationId("demo-conversation-123");
      setMessages([{
        text: "Hello! How can I help you today?",
        sender: "seamstress",
        created_at: new Date().toISOString()
      }]);
      setIsLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('seamstress_id', seamstressId)
        .maybeSingle();

      if (error) {
        console.error("Error checking for existing conversation:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check for existing conversation.",
        });
        setIsLoading(false);
        return;
      }

      if (data) {
        // Existing conversation found
        setConversationId(data.id);
        fetchMessages(data.id);
      } else {
        // No existing conversation, create a new one
        startNewConversation(seamstressId);
      }
    } catch (error) {
      console.error("Error in checkExistingConversation:", error);
      setIsLoading(false);
    }
  };

  const startNewConversation = async (seamstressId: string) => {
    // For demo seamstress, don't create actual conversation
    if (seamstressId === "demo-seamstress-123") {
      setConversationId("demo-conversation-123");
      setMessages([{
        text: "Hello! How can I help you today?",
        sender: "seamstress",
        created_at: new Date().toISOString()
      }]);
      setIsLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          {
            user_id: session.user.id,
            seamstress_id: seamstressId,
            messages: [],
            status: 'active',
            updated_at: new Date().toISOString()
          }
        ])
        .select('id')
        .single();

      if (error) {
        console.error("Error starting new conversation:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to start a new conversation.",
        });
        setIsLoading(false);
        return;
      }

      setConversationId(data.id);
      setMessages([]); // Initialize with an empty array
      setIsLoading(false);
    } catch (error) {
      console.error("Error in startNewConversation:", error);
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    // For demo conversation, keep existing messages
    if (conversationId === "demo-conversation-123") {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('messages')
        .eq('id', conversationId)
        .single();

      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch messages.",
        });
        setIsLoading(false);
        return;
      }

      if (data?.messages) {
        const validatedMessages = (data.messages as any[]).map(msg => ({
          text: msg.text || '',
          sender: msg.sender || 'system',
          type: msg.type || 'text',
          created_at: msg.created_at || new Date().toISOString()
        })) as Message[];
        setMessages(validatedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error in fetchMessages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      text: input,
      sender: "user",
      created_at: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');

    if (seamstress.id !== "demo-seamstress-123") {
      const messagesToStore = updatedMessages.map(msg => ({
        text: msg.text,
        sender: msg.sender,
        type: msg.type || 'text',
        created_at: msg.created_at
      }));

      const { error } = await supabase
        .from('conversations')
        .update({
          messages: messagesToStore,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) {
        console.error("Error updating messages:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send message.",
        });
      }
    }
  };

  const handleMeasurementsSubmit = async () => {
    const newMessage: Message = {
      text: "Measurements submitted",
      sender: "system",
      type: "measurements",
      created_at: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsMeasurementsOpen(false);

    if (seamstress.id !== "demo-seamstress-123") {
      const messagesToStore = updatedMessages.map(msg => ({
        text: msg.text,
        sender: msg.sender,
        type: msg.type || 'text',
        created_at: msg.created_at
      }));

      supabase
        .from('conversations')
        .update({
          messages: messagesToStore,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    }
  };

  const handleDeliveryTimeframeSubmit = async () => {
    const newMessage: Message = {
      text: "Delivery timeframe submitted",
      sender: "system",
      type: "delivery",
      created_at: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsDeliveryTimeframeOpen(false);

    if (seamstress.id !== "demo-seamstress-123") {
      const messagesToStore = updatedMessages.map(msg => ({
        text: msg.text,
        sender: msg.sender,
        type: msg.type || 'text',
        created_at: msg.created_at
      }));

      supabase
        .from('conversations')
        .update({
          messages: messagesToStore,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    }
  };

  const handleShareDesign = async () => {
    if (!designToShare) return;

    const newMessage: Message = {
      text: `Shared design: ${designToShare.description}`,
      sender: "system",
      type: "image",
      created_at: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setDesignToShare(null);

    if (seamstress.id !== "demo-seamstress-123") {
      const messagesToStore = updatedMessages.map(msg => ({
        text: msg.text,
        sender: msg.sender,
        type: msg.type || 'text',
        created_at: msg.created_at
      }));

      supabase
        .from('conversations')
        .update({
          messages: messagesToStore,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    }
  };

  const handleBookOrder = () => {
    toast({
      title: "Order Confirmation",
      description: "Your order has been submitted successfully!",
    });
    // Add your order submission logic here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading chat...</div>;
  }

  return (
    <div className="min-h-screen bg-[#EBE2D3] py-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <ChatHeader seamstress={seamstress} />
        
        <ChatMessages 
          messages={messages}
          designToShare={designToShare}
          containerRef={chatContainerRef}
        />

        <ChatInput 
          input={input}
          onInputChange={handleInputChange}
          onSendMessage={handleSendMessage}
          onMeasurementsClick={() => setIsMeasurementsOpen(true)}
          onDeliveryTimeframeClick={() => setIsDeliveryTimeframeOpen(true)}
        />

        {/* Measurements Modal */}
        <Popover open={isMeasurementsOpen} onOpenChange={setIsMeasurementsOpen}>
          <PopoverContent className="w-80">
            <Card>
              <CardHeader>
                <h4 className="text-sm font-medium">Enter Measurements</h4>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="bust">Bust</label>
                  <Input id="bust" placeholder="Enter bust size" value={measurements.bust} onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="waist">Waist</label>
                  <Input id="waist" placeholder="Enter waist size" value={measurements.waist} onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="hips">Hips</label>
                  <Input id="hips" placeholder="Enter hips size" value={measurements.hips} onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="height">Height</label>
                  <Input id="height" placeholder="Enter height" value={measurements.height} onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="shoulderToWaist">Shoulder to Waist</label>
                  <Input id="shoulderToWaist" placeholder="Enter shoulder to waist" value={measurements.shoulderToWaist} onChange={(e) => setMeasurements({ ...measurements, shoulderToWaist: e.target.value })} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="waistToKnee">Waist to Knee</label>
                  <Input id="waistToKnee" placeholder="Enter waist to knee" value={measurements.waistToKnee} onChange={(e) => setMeasurements({ ...measurements, waistToKnee: e.target.value })} />
                </div>
                <Button onClick={handleMeasurementsSubmit}>Submit Measurements</Button>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>

        {/* Delivery Timeframe Modal */}
        <Popover open={isDeliveryTimeframeOpen} onOpenChange={setIsDeliveryTimeframeOpen}>
          <PopoverContent className="w-80">
            <Card>
              <CardHeader>
                <h4 className="text-sm font-medium">Select Delivery Timeframe</h4>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label>Delivery Date</label>
                  <Calendar
                    mode="single"
                    selected={deliveryTimeframe.date}
                    onSelect={(date) => setDeliveryTimeframe({ ...deliveryTimeframe, date: date || new Date() })}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="urgency">Urgency</label>
                  <select
                    id="urgency"
                    className="w-full rounded-md border border-gray-200 px-3 py-2"
                    value={deliveryTimeframe.urgency}
                    onChange={(e) => setDeliveryTimeframe({ ...deliveryTimeframe, urgency: e.target.value as "standard" | "rush" | "express" })}
                  >
                    <option value="standard">Standard</option>
                    <option value="rush">Rush</option>
                    <option value="express">Express</option>
                  </select>
                </div>
                <Button onClick={handleDeliveryTimeframeSubmit}>Submit Timeframe</Button>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MessagingPortal;
