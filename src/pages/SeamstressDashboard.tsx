import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProfileSection, type SeamstressProfile, type ProfileFormData } from "@/components/dashboard/ProfileSection";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { OrdersSection, type Order } from "@/components/dashboard/OrdersSection";

interface SeamstressDashboardProps { }

const SeamstressDashboard: React.FC<SeamstressDashboardProps> = () => {
  const [profile, setProfile] = useState<SeamstressProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [queueOrders, setQueueOrders] = useState<Order[]>([]);
  const [progressOrders, setProgressOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeamstressProfile = async () => {
      setLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('seamstress_profiles')
          .select('*')
          .eq('user_id', supabase.auth.currentUser?.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (profileData) {
          setProfile(profileData as SeamstressProfile);
        } else {
          // If no profile exists, navigate to profile creation page
          navigate('/seamstress-profile');
        }

        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('seamstress_id', supabase.auth.currentUser?.id);

        if (ordersError) {
          throw ordersError;
        }

        if (orders) {
          const queue = orders.filter(order => order.status === 'queued');
          const progress = orders.filter(order => order.status === 'in_progress');

          setQueueOrders(queue);
          setProgressOrders(progress);
        }

      } catch (error: any) {
        toast("Error", {
          description: error.message || "Could not fetch seamstress profile."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSeamstressProfile();
  }, [navigate]);

  const handleProfileUpdate = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('seamstress_profiles')
        .update({ ...data })
        .eq('user_id', supabase.auth.currentUser?.id);

      if (error) throw error;

      toast("Success!", {
        description: "Profile updated successfully."
      });

      // Refresh profile
      const { data: updatedProfile, error: profileError } = await supabase
        .from('seamstress_profiles')
        .select('*')
        .eq('user_id', supabase.auth.currentUser?.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (updatedProfile) {
        setProfile(updatedProfile as SeamstressProfile);
      }

    } catch (error: any) {
      toast("Error", {
        description: error.message || "Could not update profile."
      });
    } finally {
      setLoading(false);
    }
  };

  const totalProgress = progressOrders.length > 0 ? (progressOrders.length / (queueOrders.length + progressOrders.length)) * 100 : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Seamstress Dashboard</h1>

      <ProfileSection
        initialData={profile}
        onSubmit={handleProfileUpdate}
        isLoading={loading}
      />

      <AnalyticsSection />

      <OrdersSection
        queueOrders={queueOrders}
        progressOrders={progressOrders}
        totalProgress={totalProgress}
      />
    </div>
  );
};

export default SeamstressDashboard;
