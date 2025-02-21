
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
        setMessages(existingConv.messages as Message[] || []);
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
            messages: [initialMessage]
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
              setMessages(payload.new.messages as Message[]);
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

    const { error } = await supabase
      .from('conversations')
      .update({ 
        messages: newMessages.map(msg => ({
          text: msg.text,
          sender: msg.sender,
          type: msg.type || 'text',
          created_at: msg.created_at
        }))
      })
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
