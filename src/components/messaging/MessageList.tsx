
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/messaging";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="h-[500px] p-4">
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-secondary"
              }`}
            >
              {msg.type === "image" ? (
                <img src={msg.text} alt="Uploaded" className="max-w-full rounded" />
              ) : msg.type === "measurements" ? (
                <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
              ) : (
                <div className="break-words">{msg.text}</div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
