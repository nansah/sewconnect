
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ConversationMessage, Message } from "@/types/messaging";

const DEMO_CONVERSATIONS: ConversationMessage[] = [
  {
    conversation_id: "demo-1",
    messages: [
      {
        text: "Hi, I'm interested in getting a dress made for a wedding.",
        sender: "user",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        type: "text"
      }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
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
      }
    ],
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    status: "active",
    customer_name: "Sarah Chen"
  }
];

export const InboxTab = () => {
  const [conversations, setConversations] = useState<ConversationMessage[]>(DEMO_CONVERSATIONS);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchConversations();
    subscribeToConversations();
  }, []);

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
        profiles:user_id (
          first_name,
          last_name
        )
      `)
      .eq('seamstress_id', session.user.id);

    if (!error && data) {
      const formattedConversations: ConversationMessage[] = data.map(conv => ({
        conversation_id: conv.id,
        messages: (conv.messages || []) as Message[],
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        status: conv.status,
        customer_name: conv.profiles ? `${conv.profiles.first_name} ${conv.profiles.last_name}` : 'Unknown Customer'
      }));
      
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
