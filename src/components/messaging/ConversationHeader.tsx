
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import { Seamstress } from "@/types/messaging";

interface ConversationHeaderProps {
  seamstress: Seamstress;
  hasMeasurements: boolean;
  onSubmitOrder: () => void;
}

export const ConversationHeader = ({ 
  seamstress, 
  hasMeasurements, 
  onSubmitOrder 
}: ConversationHeaderProps) => {
  return (
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
          onClick={onSubmitOrder}
          className="bg-accent hover:bg-accent/90 text-white"
        >
          <FileCheck className="w-4 h-4 mr-2" />
          Submit Order
        </Button>
      )}
    </div>
  );
};
