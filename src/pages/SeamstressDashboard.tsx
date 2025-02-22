import { Card } from "../components/ui/card";
import { Edit, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subMonths, startOfYear, endOfYear, parseISO } from 'date-fns';
import { ProfileEditForm } from "@/components/dashboard/ProfileEditForm";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { OrdersTables } from "@/components/dashboard/OrdersTables";
import { MessagesDialog } from "@/components/dashboard/MessagesDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEMO_ORDERS = [
  {
    id: 'demo-1',
    customer_name: 'Sarah Johnson',
    status: 'queued',
    created_at: '2024-03-15T10:00:00.000Z',
    conversation: {
      orderDetails: { price: '$250' },
      progress: 0
    }
  },
  {
    id: 'demo-2',
    customer_name: 'Emily Davis',
    status: 'in_progress',
    created_at: '2024-03-10T15:30:00.000Z',
    conversation: {
      orderDetails: { price: '$350' },
      progress: 45
    }
  },
  {
    id: 'demo-3',
    customer_name: 'Maria Garcia',
    status: 'queued',
    created_at: '2024-03-08T09:15:00.000Z',
    conversation: {
      orderDetails: { price: '$180' },
      progress: 0
    }
  },
  {
    id: 'demo-4',
    customer_name: 'Jessica Taylor',
    status: 'in_progress',
    created_at: '2024-02-28T14:20:00.000Z',
    conversation: {
      orderDetails: { price: '$420' },
      progress: 75
    }
  },
  {
    id: 'demo-5',
    customer_name: 'Linda Wilson',
    status: 'in_progress',
    created_at: '2024-02-25T11:45:00.000Z',
    conversation: {
      orderDetails: { price: '$290' },
      progress: 90
    }
  }
];

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
  const [dateFilter, setDateFilter] = useState('month');
  const [salesData, setSalesData] = useState([]);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      processOrdersData();
    }
  }, [orders, dateFilter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

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
      return;
    }

    fetchProfile();
    fetchOrders();
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
      console.error("Error fetching profile:", error);
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
        name: data.name || '',
        specialty: data.specialty || '',
        location: data.location || '',
        price: data.price || ''
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
      console.error("Error fetching orders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch orders.",
      });
      return;
    }

    setOrders(data?.length ? data : DEMO_ORDERS);
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('seamstress_profiles')
      .update({
        name: editForm.name,
        specialty: editForm.specialty,
        location: editForm.location,
        price: editForm.price,
      })
      .eq('user_id', session.user.id);

    if (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile: " + error.message,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully.",
    });
    
    setIsEditing(false);
    await fetchProfile();
  };

  const processOrdersData = () => {
    let filteredOrders = [...orders];
    let data = [];

    switch (dateFilter) {
      case 'year':
        // Group by month for the current year
        const startDate = startOfYear(new Date());
        const endDate = endOfYear(new Date());
        filteredOrders = orders.filter(order => {
          const orderDate = parseISO(order.created_at);
          return orderDate >= startDate && orderDate <= endDate;
        });

        // Create monthly data points
        for (let i = 0; i < 12; i++) {
          const monthOrders = filteredOrders.filter(order => 
            parseISO(order.created_at).getMonth() === i
          );
          const totalSales = monthOrders.reduce((sum, order) => {
            const price = order.conversation?.orderDetails?.price || "0";
            return sum + parseInt(price.replace(/\D/g, ''));
          }, 0);

          data.push({
            name: format(new Date(2024, i), 'MMM'),
            sales: totalSales
          });
        }
        break;

      case 'month':
        // Group by week for the current month
        const lastMonth = subMonths(new Date(), 1);
        filteredOrders = orders.filter(order => 
          parseISO(order.created_at) >= lastMonth
        );

        // Create weekly data points
        for (let i = 0; i < 4; i++) {
          const weekOrders = filteredOrders.filter(order => {
            const orderDate = parseISO(order.created_at);
            const weekOfMonth = Math.floor((orderDate.getDate() - 1) / 7);
            return weekOfMonth === i;
          });

          const totalSales = weekOrders.reduce((sum, order) => {
            const price = order.conversation?.orderDetails?.price || "0";
            return sum + parseInt(price.replace(/\D/g, ''));
          }, 0);

          data.push({
            name: `Week ${i + 1}`,
            sales: totalSales
          });
        }
        break;

      default:
        break;
    }

    setSalesData(data);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#EBE2D3] p-8 flex items-center justify-center">
      Loading...
    </div>;
  }

  const totalSales = orders.reduce((sum, order) => {
    const price = order.conversation?.orderDetails?.price || "0";
    return sum + parseInt(price.replace(/\D/g, ''));
  }, 0);

  const queueOrders = orders.filter(order => order.status === 'queued');
  const progressOrders = orders.filter(order => order.status === 'in_progress');
  const totalOrders = orders.length;
  
  const queuePercentage = totalOrders ? (queueOrders.length / totalOrders) * 100 : 0;
  const progressPercentage = totalOrders ? (progressOrders.length / totalOrders) * 100 : 0;

  const totalProgressPercentage = progressOrders.length > 0
    ? progressOrders.reduce((sum, order) => sum + (order.conversation?.progress || 0), 0) / progressOrders.length
    : 0;

  const totalCustomers = new Set(orders.map(order => order.customer_name)).size;

  return (
    <div className="min-h-screen bg-[#EBE2D3] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Seamstress Dashboard</h1>
          <div className="flex gap-4">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time Period</SelectLabel>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
            <Button 
              onClick={() => setIsMessagesOpen(true)}
              className="bg-primary hover:bg-primary/90"
              variant="default"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </Button>
          </div>
        </div>

        {isEditing && (
          <ProfileEditForm
            editForm={editForm}
            setEditForm={setEditForm}
            onSave={handleUpdateProfile}
          />
        )}
        
        {/* Analytics Cards */}
        <AnalyticsCards
          totalSales={totalSales}
          totalCustomers={totalCustomers}
          queueOrders={queueOrders}
          progressOrders={progressOrders}
          totalOrders={totalOrders}
          queuePercentage={queuePercentage}
          progressPercentage={progressPercentage}
        />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-8">
              {/* Sales Chart */}
              <SalesChart salesData={salesData} />

              {/* Orders Tables */}
              <OrdersTables
                queueOrders={queueOrders}
                progressOrders={progressOrders}
                totalProgressPercentage={totalProgressPercentage}
              />
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTables
              queueOrders={queueOrders}
              progressOrders={progressOrders}
              totalProgressPercentage={totalProgressPercentage}
            />
          </TabsContent>
        </Tabs>

        <MessagesDialog 
          open={isMessagesOpen} 
          onOpenChange={setIsMessagesOpen} 
        />
      </div>
    </div>
  );
};

export default SeamstressDashboard;
