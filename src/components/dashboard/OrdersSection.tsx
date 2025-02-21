
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Order {
  id: string;
  customer_name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conversation: {
    progress?: number;
    orderDetails?: {
      price: string;
    };
  };
  created_at: string;
}

interface OrdersSectionProps {
  queueOrders: Order[];
  progressOrders: Order[];
  totalProgress: number;
}

export const OrdersSection = ({ queueOrders, progressOrders, totalProgress }: OrdersSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-8 bg-white border-none shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Orders in Queue</h2>
          <Progress value={(queueOrders.length / 10) * 100} className="w-32 h-2" />
        </div>
        <div className="space-y-4">
          {queueOrders.map((order, index) => (
            <div 
              key={order.id} 
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-medium">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">{order.customer_name}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
          {queueOrders.length === 0 && (
            <p className="text-center text-gray-500 py-4">No orders in queue</p>
          )}
        </div>
      </Card>

      <Card className="p-8 bg-white border-none shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Orders in Progress</h2>
          <div className="text-right">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-600">Total Progress</span>
              <span className="ml-2 text-lg font-bold text-primary">{totalProgress.toFixed(0)}%</span>
            </div>
            <Progress value={totalProgress} className="w-32 h-2" />
          </div>
        </div>
        <div className="space-y-4">
          {progressOrders.map((order, index) => (
            <div 
              key={order.id} 
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-medium">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">{order.customer_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  <Progress value={order.conversation?.progress || 0} className="w-24 h-2" />
                  <span className="text-sm font-medium text-primary">
                    {order.conversation?.progress || 0}%
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))}
          {progressOrders.length === 0 && (
            <p className="text-center text-gray-500 py-4">No orders in progress</p>
          )}
        </div>
      </Card>
    </div>
  );
};
