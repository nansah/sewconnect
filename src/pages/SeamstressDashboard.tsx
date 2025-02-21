import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProfileSection, type SeamstressProfile, type ProfileFormData } from "@/components/dashboard/ProfileSection";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import OrdersSection, { type Order } from "@/components/dashboard/OrdersSection";

const SeamstressDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SeamstressProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        await Promise.all([fetchProfile(), fetchOrders()]);
      }
      setLoading(false);
    };

    initializeDashboard();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return false;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single();

    if (profile?.user_type !== 'seamstress') {
      navigate('/');
      toast("Access Denied", {
        description: "This area is only for seamstresses."
      });
      return false;
    }

    return true;
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('seamstress_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      toast("Error", {
        description: error.message
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seamstress_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data.map(order => ({
        ...order,
        status: order.status as 'queued' | 'in_progress' | 'completed'
      })));
    } catch (error: any) {
      console.error('Error in fetchOrders:', error);
      toast("Error", {
        description: error.message
      });
    }
  };

  const handleUpdateProfile = async (formData: ProfileFormData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast("Error", {
          description: "You must be logged in to update your profile."
        });
        return;
      }

      const { error } = await supabase
        .from('seamstress_profiles')
        .update(formData)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast("Success", {
        description: "Profile updated successfully."
      });
      
      await fetchProfile();
    } catch (error: any) {
      console.error('Error in handleUpdateProfile:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBE2D3] p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const queueOrders = orders.filter(order => order.status === 'queued');
  const progressOrders = orders.filter(order => order.status === 'in_progress');
  const totalOrders = orders.length;
  
  const queuePercentage = totalOrders ? (queueOrders.length / totalOrders) * 100 : 0;
  const progressPercentage = totalOrders ? (progressOrders.length / totalOrders) * 100 : 0;

  const totalProgress = progressOrders.length > 0 
    ? progressOrders.reduce((sum, order) => sum + (order.conversation?.progress || 0), 0) / progressOrders.length 
    : 0;

  const totalSales = orders.reduce((sum, order) => {
    const price = order.conversation?.orderDetails?.price || "0";
    return sum + parseInt(price.replace(/\D/g, ''));
  }, 0);

  const uniqueCustomers = new Set(orders.map(order => order.customer_name)).size;

  return (
    <div className="min-h-screen bg-[#EBE2D3] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <ProfileSection 
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
        />
        
        <AnalyticsSection 
          totalSales={totalSales}
          uniqueCustomers={uniqueCustomers}
          queueOrders={queueOrders.length}
          progressOrders={progressOrders.length}
          totalOrders={totalOrders}
          queuePercentage={queuePercentage}
          progressPercentage={progressPercentage}
          totalProgress={totalProgress}
        />

        <OrdersSection 
          queueOrders={queueOrders}
          progressOrders={progressOrders}
          totalProgress={totalProgress}
        />
      </div>
    </div>
  );
};

export default SeamstressDashboard;
