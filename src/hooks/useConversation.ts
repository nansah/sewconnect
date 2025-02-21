
import { useState, useEffect } from 'react';
import { Message, Seamstress } from '@/types/messaging';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useConversation = (seamstress: Seamstress) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeConversation();
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  const initializeConversation = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('seamstress_id', seamstress.id)
        .single();

      if (existingConv) {
        setConversationId(existingConv.id);
        // Convert JSON messages to Message type
        const convertedMessages = (existingConv.messages || []).map((msg: any) => ({
          text: msg.text,
          sender: msg.sender,
          type: msg.type || 'text',
          created_at: msg.created_at
        })) as Message[];
        setMessages(convertedMessages);
      } else {
        const initialMessage: Message = {
          text: `Hello! I'm ${seamstress.name}. How can I help you today?`,
          sender: "seamstress",
          created_at: new Date().toISOString()
        };

        const { data: newConv, error } = await supabase
          .from('conversations')
          .insert({
            user_id: session.user.id,
            seamstress_id: seamstress.id,
            messages: [{
              text: initialMessage.text,
              sender: initialMessage.sender,
              created_at: initialMessage.created_at
            }]
          })
          .select()
          .single();

        if (error) throw error;

        setConversationId(newConv.id);
        setMessages([initialMessage]);
      }

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`conversation-${existingConv?.id || 'new'}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations',
            filter: `id=eq.${existingConv?.id}`
          },
          (payload: any) => {
            if (payload.new.messages) {
              // Convert JSON messages to Message type
              const convertedMessages = (payload.new.messages || []).map((msg: any) => ({
                text: msg.text,
                sender: msg.sender,
                type: msg.type || 'text',
                created_at: msg.created_at
              })) as Message[];
              setMessages(convertedMessages);
            }
          }
        )
        .subscribe();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize conversation.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConversation = async (newMessages: Message[]) => {
    if (!conversationId) return;

    // Convert Message type to plain objects for database storage
    const messagesToStore = newMessages.map(msg => ({
      text: msg.text,
      sender: msg.sender,
      type: msg.type || 'text',
      created_at: msg.created_at
    }));

    const { error } = await supabase
      .from('conversations')
      .update({ messages: messagesToStore })
      .eq('id', conversationId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update conversation.",
      });
      return false;
    }
    return true;
  };

  return {
    messages,
    conversationId,
    loading,
    updateConversation
  };
};
