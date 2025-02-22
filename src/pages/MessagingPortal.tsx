import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Ruler, Paperclip, Calendar } from 'lucide-react';
import { useConversation } from "@/hooks/useConversation";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { Message, Measurements } from '@/types/messaging';

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
  const { seamstress, designToShare } = (location.state as any) || { 
    seamstress: {
      id: "demo-seamstress-123",
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=400&h=400&fit=crop"
    }
  };

  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>(DEFAULT_MEASUREMENTS);
  const [showDeliveryTimeframe, setShowDeliveryTimeframe] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const { updateConversation } = useConversation(seamstress);

  useEffect(() => {
    if (designToShare && conversationId) {
      const designMessage: Message = {
        text: designToShare.imageUrl,
        sender: "user",
        type: "image",
        created_at: new Date().toISOString()
      };
      const descriptionMessage: Message = {
        text: `I'm interested in this design: ${designToShare.description}`,
        sender: "user",
        created_at: new Date().toISOString()
      };
      updateConversation([...messages, designMessage, descriptionMessage]);
    }
  }, [conversationId, designToShare]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage: Message = {
      text: message.trim(),
      sender: "user",
      created_at: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage("");

    if (seamstress.id === "demo-seamstress-123") {
      setTimeout(() => {
        const response: Message = {
          text: "Hello! I'd be happy to help you with your clothing alterations. Could you please share your measurements and preferred delivery timeframe?",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    } else {
      await updateConversation(updatedMessages);
    }
  };

  const handleMeasurementsSubmit = () => {
    const measurementsMessage = `Measurements: Bust - ${measurements.bust}, Waist - ${measurements.waist}, Hips - ${measurements.hips}, Length - ${measurements.height}`;
    const newMessage: Message = {
      text: measurementsMessage,
      sender: "user",
      created_at: new Date().toISOString(),
      type: "text",
    };
    updateConversation([...messages, newMessage]);
    setShowMeasurements(false);
    simulateSeamstressResponse(newMessage);
  };

  const handleDeliveryTimeframeSubmit = () => {
    if (!selectedDate) return;
    
    const deliveryMessage = `Preferred delivery date: ${selectedDate.toLocaleDateString()}`;
    const newMessage: Message = {
      text: deliveryMessage,
      sender: "user",
      created_at: new Date().toISOString(),
      type: "text",
    };
    updateConversation([...messages, newMessage]);
    setShowDeliveryTimeframe(false);
    simulateSeamstressResponse(newMessage);
  };

  // Enhanced payment handling
  const handlePaymentSubmit = () => {
    const paymentMessage = "I've submitted the deposit payment and booked the appointment.";
    const newMessage: Message = {
      text: paymentMessage,
      sender: "user",
      created_at: new Date().toISOString(),
      type: "text",
    };
    
    const seamstressResponse: Message = {
      text: "Thank you for your payment! I've confirmed your appointment and will start working on your dress. I'll keep you updated on the progress. Feel free to message me if you have any questions!",
      sender: "seamstress",
      created_at: new Date(Date.now() + 1000).toISOString(),
      type: "text",
    };
    
    updateConversation([...messages, newMessage, seamstressResponse]);
    setShowPaymentDialog(false);
    
    toast({
      title: "Booking Confirmed!",
      description: "Your deposit has been processed and your appointment is confirmed. The seamstress will begin working on your order.",
    });
  };

  const handleToggleMeasurements = () => {
    setShowMeasurements(!showMeasurements);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDesignShare = () => {
    navigate("/");
    toast({
      title: "Design Shared",
      description: "Your design has been shared with the seamstress.",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Show loading state
      toast({
        title: "Uploading image...",
        description: "Please wait while we upload your image.",
      });

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(filePath);

      // Create and send the message with the image
      const newMessage: Message = {
        text: publicUrl,
        sender: "user",
        created_at: new Date().toISOString(),
        type: "image"
      };

      updateConversation([...messages, newMessage]);
      simulateSeamstressResponse(newMessage);

      toast({
        title: "Image uploaded successfully",
        description: "Your image has been shared in the conversation.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
      });
    }
  };

  const initializeConversation = async () => {
    console.log("Initializing conversation with seamstress:", seamstress);
    try {
      if (seamstress.id === "demo-seamstress-123") {
        // Initialize demo conversation
        const initialMessage: Message = {
          text: `Hello! I'm ${seamstress.name}. How can I help you today?`,
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
        setConversationId('demo-conversation');
        setMessages([initialMessage]);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No active session found");
          setLoading(false);
          return;
        }

        // Handle real seamstress conversation
        const { data: existingConv, error: fetchError } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('seamstress_id', seamstress.id)
          .single();

        if (!fetchError) {
          setConversationId(existingConv.id);
          const convertedMessages = existingConv.messages.map((msg: any) => ({
            text: msg.text,
            sender: msg.sender as "user" | "seamstress" | "system",
            type: msg.type || 'text',
            created_at: msg.created_at
          }));
          setMessages(convertedMessages);
        } else if (fetchError.code === 'PGRST116') {
          // Create new conversation
          const initialMessage: Message = {
            text: `Hello! I'm ${seamstress.name}. How can I help you today?`,
            sender: "seamstress",
            created_at: new Date().toISOString()
          };
          
          const { data: newConv, error: createError } = await supabase
            .from('conversations')
            .insert({
              user_id: session.user.id,
              seamstress_id: seamstress.id,
              messages: [initialMessage]
            })
            .select()
            .single();

          if (createError) throw createError;

          setConversationId(newConv.id);
          setMessages([initialMessage]);
        } else {
          throw fetchError;
        }
      }
    } catch (error: any) {
      console.error("Error in initializeConversation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize conversation: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeConversation();
  }, [seamstress]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading messages...</div>;
  }

  const simulateSeamstressResponse = (userMessage: Message) => {
    setTimeout(() => {
      let response: Message;
      const lowerCaseMsg = userMessage.text.toLowerCase();
      
      if (lowerCaseMsg.includes('measurement') || lowerCaseMsg.includes('size')) {
        response = {
          text: "Great! Please click the ruler icon below to share your measurements. I need them to ensure a perfect fit.",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
      } else if (lowerCaseMsg.includes('delivery') || lowerCaseMsg.includes('when') || lowerCaseMsg.includes('time')) {
        response = {
          text: "Please click the calendar icon below to select your preferred delivery date. This will help me plan the work accordingly.",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
      } else if (lowerCaseMsg.includes('price') || lowerCaseMsg.includes('cost') || lowerCaseMsg.includes('payment')) {
        response = {
          text: "The total cost will be $500. I require a 50% deposit ($250) to begin working on your order. Would you like to proceed with the booking?",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
      } else if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi')) {
        response = {
          text: "Hello! I'd be happy to help you with your clothing alterations. Could you please share your measurements and preferred delivery timeframe?",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
      } else {
        response = {
          text: "Thank you for your message. To proceed with your order, I'll need your measurements and preferred delivery timeframe. You can use the ruler and calendar icons below to provide these details.",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
      }
      
      updateConversation([...messages, response]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#EBE2D3] py-6">
      <div className="max-w-4xl mx-auto px-4 shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-accent/80 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={seamstress.image} alt={seamstress.name} />
              <AvatarFallback>{seamstress.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{seamstress.name}</h2>
              <p className="text-sm text-white/80">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => setShowPaymentDialog(true)}
              className="bg-white text-accent hover:bg-white/90"
            >
              Book Appointment
            </Button>
            <Button 
              size="sm" 
              onClick={handleDesignShare} 
              className="bg-primary hover:bg-primary/90"
            >
              Share Design
            </Button>
          </div>
        </div>

        {/* Chat Messages Section */}
        <div className="bg-white h-[500px] overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-4 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-xs rounded-xl p-3 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.type === "image" ? (
                  <img src={msg.text} alt="Shared Design" className="max-w-full h-auto rounded-md" />
                ) : (
                  msg.text
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        {/* Input and Actions Section */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          {/* Measurements Form */}
          {showMeasurements && (
            <Card className="mb-4">
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="bust" className="text-sm font-medium block mb-1">Bust</label>
                    <Input type="text" id="bust" name="bust" value={measurements.bust} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="waist" className="text-sm font-medium block mb-1">Waist</label>
                    <Input type="text" id="waist" name="waist" value={measurements.waist} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="hips" className="text-sm font-medium block mb-1">Hips</label>
                    <Input type="text" id="hips" name="hips" value={measurements.hips} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="height" className="text-sm font-medium block mb-1">Height</label>
                    <Input type="text" id="height" name="height" value={measurements.height} onChange={handleInputChange} />
                  </div>
                </div>
                <Button onClick={handleMeasurementsSubmit} className="bg-primary hover:bg-primary/90">Submit Measurements</Button>
              </CardContent>
            </Card>
          )}

          {/* Delivery Timeframe */}
          {showDeliveryTimeframe && (
            <Card className="mb-4">
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <Button 
                  onClick={handleDeliveryTimeframeSubmit}
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                  disabled={!selectedDate}
                >
                  Confirm Delivery Date
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleMeasurements}
              className="hover:bg-gray-200"
            >
              <Ruler className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-200"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Paperclip className="w-5 h-5" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeliveryTimeframe(!showDeliveryTimeframe)}
              className="hover:bg-gray-200"
            >
              <Calendar className="w-5 h-5" />
            </Button>
            <Input
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-grow rounded-full py-2 px-4 bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button 
              onClick={handleSendMessage} 
              className="bg-primary hover:bg-primary/90 rounded-full"
            >
              <Send className="w-5 h-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold mb-2">Book Your Appointment</DialogTitle>
            <DialogDescription>
              Please provide your payment details to secure your booking. A 50% deposit is required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 bg-white">
            <div className="space-y-2">
              <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">Card Number</label>
              <Input 
                type="text" 
                id="cardNumber" 
                placeholder="1234 5678 9012 3456" 
                className="font-mono text-lg tracking-wider bg-white"
                maxLength={16}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="expiry" className="text-sm font-medium text-gray-700">Expiry Date</label>
                <Input 
                  type="text" 
                  id="expiry" 
                  placeholder="MM/YY"
                  maxLength={5}
                  className="font-mono bg-white"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cvc" className="text-sm font-medium text-gray-700">Security Code</label>
                <Input 
                  type="text" 
                  id="cvc" 
                  placeholder="123"
                  maxLength={3}
                  className="font-mono bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Name on Card</label>
              <Input 
                type="text" 
                id="name" 
                placeholder="John Smith"
                className="font-sans bg-white"
              />
            </div>
            <div className="border-t pt-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Service Total</span>
                  <span className="font-semibold">$500.00</span>
                </div>
                <div className="flex justify-between text-primary font-medium">
                  <span>Deposit Required (50%)</span>
                  <span>$250.00</span>
                </div>
              </div>
              <Button 
                onClick={handlePaymentSubmit} 
                className="w-full bg-primary hover:bg-primary/90 text-white py-3"
              >
                Pay Deposit & Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagingPortal;
