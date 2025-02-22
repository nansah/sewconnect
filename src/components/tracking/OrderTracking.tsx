
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface SeamstressProfile {
  name: string;
}

interface OrderWithSeamstress {
  id: string;
  status: string;
  seamstress_id: string;
  delivered_at: string;
  conversation: any;
  created_at: string;
  updated_at: string;
  customer_name: string;
  measurements: string;
  seamstress: SeamstressProfile;
}

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderWithSeamstress | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            seamstress:seamstress_profiles(name)
          `)
          .eq('id', orderId)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch order details.",
          });
          return;
        }

        if (data) {
          setOrder({
            ...data,
            seamstress: {
              name: data.seamstress?.name || 'Unknown Seamstress'
            }
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred.",
        });
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Order Status</h2>
            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
              {order.status}
            </Badge>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Seamstress</h2>
            <p>{order.seamstress.name}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Order Date</h2>
            <p>{format(new Date(order.created_at), 'PPP')}</p>
          </div>
          {order.delivered_at && (
            <div>
              <h2 className="text-lg font-semibold">Delivery Date</h2>
              <p>{format(new Date(order.delivered_at), 'PPP')}</p>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">Customer Name</h2>
            <p>{order.customer_name}</p>
          </div>
          {order.measurements && (
            <div>
              <h2 className="text-lg font-semibold">Measurements</h2>
              <p className="whitespace-pre-wrap">{order.measurements}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OrderTracking;
