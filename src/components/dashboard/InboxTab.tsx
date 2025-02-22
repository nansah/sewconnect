
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Message {
  conversation_id: string;
  messages: any[];
  created_at: string;
  updated_at: string;
  status: string;
  customer_name: string;
}

export const InboxTab = () => {
  const [conversations, setConversations] = useState<Message[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchConversations();
    subscribeToConversations();
  }, []);

  const fetchConversations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('seamstress_messages')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
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

  const getLastMessage = (messages: any[]) => {
    if (!messages || messages.length === 0) return "No messages";
    const lastMessage = messages[messages.length - 1];
    return lastMessage.text.length > 50 
      ? `${lastMessage.text.substring(0, 50)}...` 
      : lastMessage.text;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Inbox</h2>
      <div className="grid gap-4">
        {conversations.map((conversation) => (
          <Card 
            key={conversation.conversation_id}
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/messaging', { 
              state: { 
                conversationId: conversation.conversation_id,
                customerName: conversation.customer_name
              }
            })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{conversation.customer_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">{conversation.customer_name}</h3>
                  <p className="text-sm text-gray-500">
                    {getLastMessage(conversation.messages)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                </span>
                <Button size="sm" variant="ghost">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
