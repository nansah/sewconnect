
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ruler, CalendarIcon, Image, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onMeasurementsClick: () => void;
  onDeliveryTimeframeClick: () => void;
}

export const ChatInput = ({
  input,
  onInputChange,
  onSendMessage,
  onMeasurementsClick,
  onDeliveryTimeframeClick,
}: ChatInputProps) => {
  const { toast } = useToast();

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMeasurementsClick}
          >
            <Ruler className="h-5 w-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={onDeliveryTimeframeClick}
          >
            <CalendarIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            <Image className="h-5 w-5" />
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={() => {
                toast({
                  title: "Photo Upload",
                  description: "Photo upload functionality will be implemented soon.",
                });
              }}
            />
          </Button>
        </div>

        <Input
          type="text"
          placeholder="Type your message here..."
          value={input}
          onChange={onInputChange}
          className="flex-grow rounded-full py-2 px-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={onSendMessage} variant="ghost" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
