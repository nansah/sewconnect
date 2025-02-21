
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { 
  BarChart, 
  Users, 
  ListChecks, 
  Clock,
  ChevronRight,
  Ruler,
  DollarSign,
  Calendar,
  Image,
  Edit
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const SeamstressDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    specialty: '',
    location: '',
    price: ''
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchProfile();
    fetchOrders();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    // Check if user is a seamstress
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single();

    if (profile?.user_type !== 'seamstress') {
      navigate('/');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "This area is only for seamstresses.",
      });
    }
  };

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('seamstress_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch profile.",
      });
      return;
    }

    if (data) {
      setProfile(data);
      setEditForm({
        name: data.name,
        specialty: data.specialty,
        location: data.location,
        price: data.price
      });
    }
  };

  const fetchOrders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('seamstress_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch orders.",
      });
      return;
    }

    setOrders(data || []);
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('seamstress_profiles')
      .update(editForm)
      .eq('user_id', session.user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully.",
    });
    
    setIsEditing(false);
    fetchProfile();
  };

  if (loading) {
    return <div className="min-h-screen bg-[#EBE2D3] p-8 flex items-center justify-center">
      Loading...
    </div>;
  }

  const queueOrders = orders.filter(order => order.status === 'queued');
  const progressOrders = orders.filter(order => order.status === 'in_progress');
  const totalOrders = orders.length;
  
  const queuePercentage = totalOrders ? (queueOrders.length / totalOrders) * 100 : 0;
  const progressPercentage = totalOrders ? (progressOrders.length / totalOrders) * 100 : 0;

  // Calculate total progress for orders in progress
  const totalProgress = progressOrders.length > 0 
    ? progressOrders.reduce((sum, order) => {
        const conversation = order.conversation || {};
        return sum + (conversation.progress || 0);
      }, 0) / progressOrders.length 
    : 0;

  return (
    <div className="min-h-screen bg-[#EBE2D3] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Seamstress Dashboard</h1>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </Button>
        </div>

        {/* Profile Edit Form */}
        {isEditing && (
          <Card className="p-6 bg-white border-none shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialty</label>
                <Input
                  value={editForm.specialty}
                  onChange={(e) => setEditForm(prev => ({ ...prev, specialty: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price Range</label>
                <Input
                  value={editForm.price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </div>
          </Card>
        )}
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-xl transition-all duration-200 bg-white border-none">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-xl">
                <BarChart className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-3xl font-bold text-gray-800">
                  ${orders.reduce((sum, order) => {
                    const price = order.conversation?.orderDetails?.price || "0";
                    return sum + parseInt(price.replace(/\D/g, ''));
                  }, 0)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-xl transition-all duration-200 bg-white border-none">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-xl">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customers</p>
                <p className="text-3xl font-bold text-gray-800">
                  {new Set(orders.map(order => order.customer_name)).size}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-xl transition-all duration-200 bg-white border-none">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-xl">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Queue</p>
                <p className="text-3xl font-bold text-gray-800">{queueOrders.length}</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={queuePercentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">{queuePercentage.toFixed(0)}% of total orders</p>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-xl transition-all duration-200 bg-white border-none">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-xl">
                <ListChecks className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-3xl font-bold text-gray-800">{progressOrders.length}</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">{progressPercentage.toFixed(0)}% of total orders</p>
            </div>
          </Card>
        </div>

        {/* Orders Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Queue Table */}
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

          {/* In Progress Table */}
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
      </div>
    </div>
  );
};

export default SeamstressDashboard;
