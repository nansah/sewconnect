
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrdersTables } from "@/components/dashboard/OrdersTables";
import { Progress } from "@/components/ui/progress";
import { Package, Truck, Clock } from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  seamstress: {
    name: string;
  };
  current_status: {
    status: string;
    notes: string;
    photo_url: string;
    status_updated_at: string;
  };
  conversation: {
    progress: number;
  };
}

const CustomerDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // For demo purposes, we'll create some sample orders
    const demoOrders: Order[] = [
      {
        id: "ord-001-2024",
        customer_name: "John Doe",
        seamstress: { name: "Amara Okafor" },
        current_status: {
          status: "in_production",
          notes: "Working on final details",
          photo_url: "",
          status_updated_at: new Date().toISOString()
        },
        conversation: { progress: 40 }
      },
      {
        id: "ord-002-2024",
        customer_name: "John Doe",
        seamstress: { name: "Zainab Ahmed" },
        current_status: {
          status: "fabric_sourced",
          notes: "Fabric selection completed",
          photo_url: "",
          status_updated_at: new Date().toISOString()
        },
        conversation: { progress: 25 }
      },
      {
        id: "ord-003-2024",
        customer_name: "John Doe",
        seamstress: { name: "Grace Mbeki" },
        current_status: {
          status: "completed",
          notes: "Order completed and delivered",
          photo_url: "",
          status_updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        conversation: { progress: 100 }
      }
    ];

    setOrders(demoOrders);
  }, []);

  const calculateProgress = (status: string) => {
    const statusWeights: Record<string, number> = {
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

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'in_production':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'in_transit':
        return <Truck className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

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
                      <p className="font-medium text-gray-800">Order #{order.id}</p>
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
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      {renderStatusIcon(order.current_status?.status)}
                      <span className="text-sm font-medium text-gray-700">
                        {order.current_status?.notes}
                      </span>
                    </div>
                    <Progress 
                      value={calculateProgress(order.current_status?.status)} 
                      className="h-2"
                    />
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
