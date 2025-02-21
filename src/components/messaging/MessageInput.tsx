
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image, Ruler } from "lucide-react";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMeasurementsClick: () => void;
}

export const MessageInput = ({
  message,
  setMessage,
  onSend,
  onImageUpload,
  onMeasurementsClick,
}: MessageInputProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2 mb-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onMeasurementsClick}
        >
          <Ruler className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Image className="h-4 w-4" />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageUpload}
          />
        </Button>
      </div>
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && onSend()}
          className="flex-1"
        />
        <Button onClick={onSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
