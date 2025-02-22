import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Paperclip, CheckCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { supabase } from "@/integrations/supabase/client";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading chat...</div>;
  }

  return (
    <div className="min-h-screen bg-[#EBE2D3] py-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-accent p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{seamstress.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-white">{seamstress.name}</h2>
              <p className="text-sm text-gray-200">Online</p>
            </div>
          </div>
        </div>

        {/* Chat Messages Section */}
        <div ref={chatContainerRef} className="p-4 h-[500px] overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-xl px-4 py-2 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                {message.text}
                {message.type === 'image' && designToShare?.imageUrl && (
                  <img src={designToShare.imageUrl} alt="Shared Design" className="mt-2 max-w-full h-auto rounded-md" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input and Actions Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5 rotate-45" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Accordion type="single" collapsible>
                  <AccordionItem value="measurements">
                    <AccordionTrigger>Measurements</AccordionTrigger>
                    <AccordionContent>
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
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="delivery">
                    <AccordionTrigger>Delivery Timeframe</AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardHeader>
                          <h4 className="text-sm font-medium">Select Delivery Timeframe</h4>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <div className="flex flex-col space-y-1.5">
                            <label htmlFor="deliveryDate">Delivery Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !deliveryTimeframe.date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {deliveryTimeframe.date ? format(deliveryTimeframe.date, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="center">
                                <Calendar
                                  mode="single"
                                  selected={deliveryTimeframe.date}
                                  onSelect={(date) => setDeliveryTimeframe({ ...deliveryTimeframe, date: date || new Date() })}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  className="rounded-md border"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <label htmlFor="urgency">Urgency</label>
                            <select
                              id="urgency"
                              className="w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary focus:ring-offset-1"
                              value={deliveryTimeframe.urgency}
                              onChange={(e) => setDeliveryTimeframe({ ...deliveryTimeframe, urgency: e.target.value as "standard" | "rush" | "express" })}
                            >
                              <option value="standard">Standard</option>
                              <option value="rush">Rush</option>
                              <option value="express">Express</option>
                            </select>
                          </div>
                          <Button onClick={handleDeliveryTimeframeSubmit}>Submit Delivery Timeframe</Button>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                  {designToShare && (
                    <AccordionItem value="design">
                      <AccordionTrigger>Share Design</AccordionTrigger>
                      <AccordionContent>
                        <Card>
                          <CardHeader>
                            <h4 className="text-sm font-medium">Share Design Details</h4>
                          </CardHeader>
                          <CardContent className="grid gap-4">
                            <div className="flex flex-col space-y-1.5">
                              <img src={designToShare.imageUrl} alt="Design Preview" className="max-w-full h-auto rounded-md" />
                              <p className="text-sm">{designToShare.description}</p>
                            </div>
                            <Button onClick={handleShareDesign}>Share Design</Button>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </PopoverContent>
            </Popover>
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={handleInputChange}
              className="flex-grow rounded-full py-2 px-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={handleSendMessage} variant="ghost" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPortal;
