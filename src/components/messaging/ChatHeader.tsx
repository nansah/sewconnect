
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Seamstress } from "@/types/messaging";
import { useToast } from "@/components/ui/use-toast";

interface ChatHeaderProps {
  seamstress: Seamstress;
}

export const ChatHeader = ({ seamstress }: ChatHeaderProps) => {
  const { toast } = useToast();

  const handleSubmitOrder = () => {
    toast({
      title: "Order Confirmation",
      description: "Your order has been submitted successfully!",
    });
  };

  return (
    <div className="bg-accent p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{seamstress.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-white">{seamstress.name}</h2>
            <p className="text-sm text-gray-200">Online</p>
          </div>
        </div>
        <Button 
          onClick={handleSubmitOrder}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Submit Order
        </Button>
      </div>
    </div>
  );
};
