
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrdersTables } from "@/components/dashboard/OrdersTables";

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          seamstress:seamstress_profiles(name),
          current_status:order_current_status(
            status,
            notes,
            photo_url,
            status_updated_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching orders",
          description: "Please try again later.",
        });
        return;
      }

      const processedOrders = data.map(order => ({
        ...order,
        customer_name: order.customer_name,
        conversation: {
          ...order.conversation,
          progress: calculateProgress(order.current_status?.status)
        }
      }));

      setOrders(processedOrders);
    };

    fetchOrders();
  }, [toast]);

  const calculateProgress = (status) => {
    const statusWeights = {
      'pending_acceptance': 0,
      'accepted': 10,
      'fabric_sourced': 25,
      'in_production': 40,
      'quality_check': 70,
      'ready_for_shipping': 80,
      'picked_up': 85,
      'in_transit': 90,
      'out_for_delivery': 95,
      'delivered': 98,
      'completed': 100
    };

    return statusWeights[status] || 0;
  };

  const activeOrders = orders.filter(order => 
    !['delivered', 'completed'].includes(order.current_status?.status)
  );

  const completedOrders = orders.filter(order => 
    ['delivered', 'completed'].includes(order.current_status?.status)
  );

  const totalProgressPercentage = activeOrders.length > 0
    ? activeOrders.reduce((acc, order) => acc + (order.conversation?.progress || 0), 0) / activeOrders.length
    : 0;

  return (
    <div className="min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <div className="text-sm text-gray-500">
            {activeOrders.length} Active Orders
          </div>
        </div>

        <OrdersTables
          queueOrders={[]}
          progressOrders={activeOrders}
          totalProgressPercentage={totalProgressPercentage}
        />

        {completedOrders.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Completed Orders</h2>
            <div className="grid gap-6">
              {completedOrders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-500">
                        Seamstress: {order.seamstress?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {order.current_status?.status.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.current_status?.status_updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
