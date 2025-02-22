
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
  }, [seamstress]);  // Add seamstress as dependency

  const initializeConversation = async () => {
    console.log("Initializing conversation with seamstress:", seamstress);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No active session found");
      setLoading(false);
      return;
    }

    try {
      // Convert demo-seamstress-123 to a valid UUID if needed
      const seamstressId = seamstress.id === 'demo-seamstress-123' 
        ? '00000000-0000-0000-0000-000000000000'  // Use a valid UUID for demo seamstress
        : seamstress.id;

      console.log("Fetching existing conversation...");
      const { data: existingConv, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('seamstress_id', seamstressId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {  // PGRST116 is "no rows returned"
        console.error("Error fetching conversation:", fetchError);
        throw fetchError;
      }

      if (existingConv) {
        console.log("Found existing conversation:", existingConv);
        setConversationId(existingConv.id);
        const convertedMessages = (existingConv.messages || []).map((msg: any) => ({
          text: msg.text,
          sender: msg.sender,
          type: msg.type || 'text',
          created_at: msg.created_at
        })) as Message[];
        setMessages(convertedMessages);
      } else {
        console.log("Creating new conversation...");
        const initialMessage: Message = {
          text: `Hello! I'm ${seamstress.name}. How can I help you today?`,
          sender: "seamstress",
          created_at: new Date().toISOString()
        };

        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            user_id: session.user.id,
            seamstress_id: seamstressId,
            messages: [{
              text: initialMessage.text,
              sender: initialMessage.sender,
              created_at: initialMessage.created_at
            }]
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating conversation:", createError);
          throw createError;
        }

        console.log("New conversation created:", newConv);
        setConversationId(newConv.id);
        setMessages([initialMessage]);
      }

      // Subscribe to real-time updates
      const channelId = existingConv?.id || 'new';
      console.log("Setting up real-time subscription for channel:", channelId);
      const channel = supabase
        .channel(`conversation-${channelId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations',
            filter: `id=eq.${existingConv?.id}`
          },
          (payload: any) => {
            console.log("Received real-time update:", payload);
            if (payload.new.messages) {
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

    } catch (error: any) {
      console.error("Error in initializeConversation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize conversation: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConversation = async (newMessages: Message[]) => {
    if (!conversationId) {
      console.error("No conversation ID available");
      return false;
    }

    const messagesToStore = newMessages.map(msg => ({
      text: msg.text,
      sender: msg.sender,
      type: msg.type || 'text',
      created_at: msg.created_at
    }));

    console.log("Updating conversation with messages:", messagesToStore);
    const { error } = await supabase
      .from('conversations')
      .update({ messages: messagesToStore })
      .eq('id', conversationId);

    if (error) {
      console.error("Error updating conversation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update conversation: " + error.message,
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
