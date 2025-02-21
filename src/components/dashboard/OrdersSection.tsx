import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Order {
  id: string;
  customer_name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conversation: any;
  created_at: string;
  measurements?: string;
  seamstress_id: string;
  updated_at?: string;
}

interface OrdersSectionProps {
  queueOrders: Order[];
  progressOrders: Order[];
  totalProgress: number;
}

export const OrdersSection = ({ queueOrders, progressOrders, totalProgress }: OrdersSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Orders</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-2">Queued Orders</h4>
          <ul className="space-y-2">
            {queueOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between">
                <span>{order.customer_name}</span>
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </li>
            ))}
            {queueOrders.length === 0 && <p className="text-sm text-gray-500">No orders in queue.</p>}
          </ul>
        </Card>
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-2">In Progress</h4>
          <ul className="space-y-2">
            {progressOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between">
                <span>{order.customer_name}</span>
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </li>
            ))}
            {progressOrders.length === 0 && <p className="text-sm text-gray-500">No orders in progress.</p>}
          </ul>
        </Card>
      </div>
      <Card className="p-4">
        <h4 className="text-lg font-semibold mb-2">Overall Progress</h4>
        <Progress value={totalProgress} />
        <p className="text-sm text-gray-500 mt-2">You're {totalProgress}% towards completing all your active orders.</p>
      </Card>
    </section>
  );
};
