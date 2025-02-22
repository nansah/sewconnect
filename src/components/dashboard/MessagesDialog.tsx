
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ConversationMessage, Message } from "@/types/messaging";
import { Textarea } from "@/components/ui/textarea";

const DEMO_CONVERSATIONS: ConversationMessage[] = [
  {
    conversation_id: "demo-1",
    messages: [
      {
        text: "Hi, I'm interested in getting a dress made for a wedding.",
        sender: "user",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        type: "text"
      },
      {
        text: "Hello! I'd be happy to help you with your wedding dress. What style are you looking for?",
        sender: "seamstress",
        created_at: new Date(Date.now() - 3500000).toISOString(),
        type: "text"
      },
      {
        text: "I'm looking for an A-line dress with lace details.",
        sender: "user",
        created_at: new Date(Date.now() - 3400000).toISOString(),
        type: "text"
      }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3400000).toISOString(),
    status: "active",
    customer_name: "Emily Watson"
  },
  {
    conversation_id: "demo-2",
    messages: [
      {
        text: "Could you help me with alterations for my prom dress?",
        sender: "user",
        created_at: new Date(Date.now() - 7200000).toISOString(),
        type: "text"
      },
      {
        text: "Of course! What kind of alterations do you need?",
        sender: "seamstress",
        created_at: new Date(Date.now() - 7100000).toISOString(),
        type: "text"
      },
      {
        text: "The dress is a bit long and needs to be taken in at the waist.",
        sender: "user",
        created_at: new Date(Date.now() - 7000000).toISOString(),
        type: "text"
      }
    ],
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7000000).toISOString(),
    status: "active",
    customer_name: "Sarah Chen"
  }
];

interface MessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MessagesDialog = ({ open, onOpenChange }: MessagesDialogProps) => {
  const [conversations, setConversations] = useState<ConversationMessage[]>(DEMO_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<ConversationMessage | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (open) {
      fetchConversations();
      subscribeToConversations();
    }
  }, [open]);

  const fetchConversations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        messages,
        created_at,
        updated_at,
        status,
        user_id
      `)
      .eq('seamstress_id', session.user.id);

    if (!error && data) {
      const formattedConversations: ConversationMessage[] = await Promise.all(
        data.map(async (conv) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', conv.user_id)
            .single();

          return {
            conversation_id: conv.id,
            messages: (conv.messages as any[] || []).map(msg => ({
              text: msg.text || '',
              sender: msg.sender || 'user',
              type: msg.type || 'text',
              created_at: msg.created_at || new Date().toISOString()
            })),
            created_at: conv.created_at,
            updated_at: conv.updated_at,
            status: conv.status,
            customer_name: profileData 
              ? `${profileData.first_name} ${profileData.last_name}` 
              : 'Unknown Customer'
          };
        })
      );
      
      setConversations(formattedConversations);
    }
  };

  const subscribeToConversations = () => {
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      text: newMessage,
      sender: 'seamstress',
      type: 'text',
      created_at: new Date().toISOString()
    };

    // Update the local state first for immediate feedback
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      updated_at: new Date().toISOString()
    };

    setSelectedConversation(updatedConversation);
    setConversations(conversations.map(conv => 
      conv.conversation_id === updatedConversation.conversation_id ? updatedConversation : conv
    ));
    setNewMessage("");

    // Then update Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('conversations')
      .update({
        messages: updatedConversation.messages,
        updated_at: updatedConversation.updated_at
      })
      .eq('id', selectedConversation.conversation_id);

    if (error) {
      console.error('Error sending message:', error);
    }
  };

  const getLastMessage = (messages: Message[]) => {
    if (!messages || messages.length === 0) return "No messages";
    const lastMessage = messages[messages.length - 1];
    return lastMessage.text.length > 50 
      ? `${lastMessage.text.substring(0, 50)}...` 
      : lastMessage.text;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col bg-white p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {selectedConversation ? selectedConversation.customer_name : "Messages"}
          </DialogTitle>
        </DialogHeader>
        
        {selectedConversation ? (
          <div className="flex flex-col h-full">
            <Button
              variant="ghost"
              onClick={() => setSelectedConversation(null)}
              className="mb-4 mx-6"
            >
              ← Back to messages
            </Button>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {selectedConversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.sender === 'user'
                        ? 'bg-gray-100'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-4 mt-auto">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="self-end"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto p-6">
            <div className="grid gap-4">
              {conversations.map((conversation) => (
                <Card 
                  key={conversation.conversation_id}
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {conversation.customer_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {conversation.customer_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {getLastMessage(conversation.messages)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(
                        new Date(conversation.updated_at),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
