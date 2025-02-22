
import React from 'react';
import { Message } from "@/types/messaging";

interface ChatMessagesProps {
  messages: Message[];
  designToShare?: {
    imageUrl: string;
    description: string;
  } | null;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages = ({ messages, designToShare, containerRef }: ChatMessagesProps) => {
  return (
    <div ref={containerRef} className="p-4 h-[500px] overflow-y-auto space-y-4">
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
  );
};
