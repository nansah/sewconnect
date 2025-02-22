
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Package, Truck, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface StatusUpdate {
  id: string;
  order_id: string;
  status: string;
  notes: string;
  photo_url: string | null;
  created_by: string;
  created_at: string;
}

export const OrderTracking = () => {
  const { orderId } = useParams();
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // For demo purposes, we'll create sample status updates
    const demoUpdates: StatusUpdate[] = [
      {
        id: "1",
        order_id: orderId,
        status: "accepted",
        notes: "Order accepted and initial review completed",
        photo_url: null,
        created_by: "seamstress-1",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "2",
        order_id: orderId,
        status: "fabric_sourced",
        notes: "Premium fabric selected and purchased",
        photo_url: null,
        created_by: "seamstress-1",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        order_id: orderId,
        status: "in_production",
        notes: "Working on final details and embellishments",
        photo_url: null,
        created_by: "seamstress-1",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setStatusUpdates(demoUpdates);
    setLoading(false);
  }, [orderId]);

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in_production':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'in_transit':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delayed':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <div className="space-y-8">
          {statusUpdates.map((update, index) => (
            <div key={update.id} className="relative">
              {index !== statusUpdates.length - 1 && (
                <div className="absolute top-8 left-3 w-0.5 h-full bg-gray-200" />
              )}
              <div className="flex gap-4">
                <div className="relative z-10">
                  {renderStatusIcon(update.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {update.status.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(update.created_at).toLocaleString()}
                  </p>
                  <p className="mt-1 text-gray-600">{update.notes}</p>
                  {update.photo_url && (
                    <img 
                      src={update.photo_url} 
                      alt="Status update" 
                      className="mt-2 rounded-lg max-w-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
