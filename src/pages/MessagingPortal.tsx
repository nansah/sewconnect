import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Ruler, Paperclip, Calendar, CreditCard } from 'lucide-react';
import { useConversation } from "@/hooks/useConversation";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface LocationState {
  seamstress: {
    id: string;
    name: string;
    image: string;
  };
}

interface Message {
  text: string;
  sender: "user" | "seamstress";
  created_at: string;
  type?: "text" | "image";
}

interface Measurements {
  bust: string;
  waist: string;
  hips: string;
  length: string;
}

const DEFAULT_MEASUREMENTS: Measurements = {
  bust: "",
  waist: "",
  hips: "",
  length: "",
};

const MessagingPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seamstress, designToShare } = (location.state as LocationState & { designToShare?: { imageUrl: string; description: string } }) || { 
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const { messages, conversationId, loading, updateConversation } = useConversation(seamstress);

  // Handle shared design when component mounts
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
  }, [conversationId, designToShare, messages, updateConversation]);

  // Simulated seamstress responses
  const simulateSeamstressResponse = (userMessage: Message) => {
    setTimeout(() => {
      let response: Message;
      
      if (userMessage.type === "image") {
        response = {
          text: "Thank you for sharing the design! Could you please provide your measurements and when you'd like to receive the dress? Also, I'll need a deposit to secure your booking.",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
      } else if (userMessage.text.includes("measurements")) {
        response = {
          text: "Great, thanks for sharing your measurements! When would you like to have the dress ready?",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
      } else if (userMessage.text.includes("delivery") || userMessage.text.includes("timeframe")) {
        response = {
          text: "Perfect! For this timeline, I'll need a 50% deposit to begin working on your dress. Would you like to proceed with the booking?",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
      } else {
        response = {
          text: "Could you please share your measurements and preferred delivery timeframe?",
          sender: "seamstress",
          created_at: new Date().toISOString()
        };
      }
      
      updateConversation([...messages, response]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage: Message = {
      text: message,
      sender: "user",
      created_at: new Date().toISOString(),
      type: "text",
    };

    updateConversation([...messages, newMessage]);
    setMessage("");
    simulateSeamstressResponse(newMessage);
  };

  const handleMeasurementsSubmit = () => {
    const measurementsMessage = `Measurements: Bust - ${measurements.bust}, Waist - ${measurements.waist}, Hips - ${measurements.hips}, Length - ${measurements.length}`;
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

  const handlePaymentSubmit = () => {
    const paymentMessage = "I've submitted the deposit payment.";
    const newMessage: Message = {
      text: paymentMessage,
      sender: "user",
      created_at: new Date().toISOString(),
      type: "text",
    };
    updateConversation([...messages, newMessage]);
    setShowPaymentDialog(false);
    toast({
      title: "Payment Successful",
      description: "Your deposit has been processed. The seamstress will begin working on your order.",
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
    if (file) {
      // For now, we'll just create a temporary URL for the image
      const imageUrl = URL.createObjectURL(file);
      const newMessage: Message = {
        text: imageUrl,
        sender: "user",
        created_at: new Date().toISOString(),
        type: "image"
      };
      updateConversation([...messages, newMessage]);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading messages...</div>;
  }

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
          <div>
            <Button size="sm" onClick={handleDesignShare} className="bg-primary hover:bg-primary/90">Share Design</Button>
          </div>
        </div>

        {/* Chat Messages Section */}
        <div className="bg-white h-[500px] overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-xs rounded-xl p-3 text-sm ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.type === "image" ? (
                  <img src={msg.text} alt="Shared Design" className="max-w-full h-auto rounded-md" />
                ) : (
                  msg.text
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>

        {/* Input and Actions Section */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
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
                    <label htmlFor="length" className="text-sm font-medium block mb-1">Length</label>
                    <Input type="text" id="length" name="length" value={measurements.length} onChange={handleInputChange} />
                  </div>
                </div>
                <Button onClick={handleMeasurementsSubmit} className="bg-primary hover:bg-primary/90">Submit Measurements</Button>
              </CardContent>
            </Card>
          )}

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPaymentDialog(true)}
              className="hover:bg-gray-200"
            >
              <CreditCard className="w-5 h-5" />
            </Button>
            <Input
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex-grow rounded-full py-2 px-4 bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90 rounded-full">
              <Send className="w-5 h-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Deposit</DialogTitle>
            <DialogDescription>
              Please provide your payment details to secure your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="text-sm font-medium block mb-1">Card Number</label>
              <Input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="text-sm font-medium block mb-1">Expiry Date</label>
                <Input type="text" id="expiry" placeholder="MM/YY" />
              </div>
              <div>
                <label htmlFor="cvc" className="text-sm font-medium block mb-1">CVC</label>
                <Input type="text" id="cvc" placeholder="123" />
              </div>
            </div>
            <Button onClick={handlePaymentSubmit} className="w-full">
              Pay Deposit ($250)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagingPortal;
