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
  Image
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";

const SeamstressDashboard = () => {
  const totalOrders = 11;
  const queueOrders = 8;
  const progressOrders = 3;
  
  const queuePercentage = (queueOrders / totalOrders) * 100;
  const progressPercentage = (progressOrders / totalOrders) * 100;

  // Sample progress data for each order with additional details
  const orderProgress = [
    { 
      id: 2001, 
      progress: 75, 
      customerName: "Emma Wilson",
      measurements: "Bust: 36\nWaist: 28\nHips: 38",
      price: "$250",
      timeframe: "2 weeks",
      inspiration: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6"
    },
    { 
      id: 2002, 
      progress: 45, 
      customerName: "James Smith",
      measurements: "Bust: 34\nWaist: 26\nHips: 36",
      price: "$200",
      timeframe: "10 days",
      inspiration: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6"
    },
    { 
      id: 2003, 
      progress: 90, 
      customerName: "Sarah Johnson",
      measurements: "Bust: 38\nWaist: 30\nHips: 40",
      price: "$300",
      timeframe: "3 weeks",
      inspiration: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6"
    },
  ];

  // Sample queue data with additional details
  const queuedOrders = [
    { 
      id: 1001, 
      customerName: "Michael Brown",
      measurements: "Bust: 40\nWaist: 32\nHips: 42",
      price: "$275",
      timeframe: "2 weeks",
      inspiration: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6"
    },
    { id: 1002, customerName: "Sophie Taylor" },
    { id: 1003, customerName: "David Miller" },
    { id: 1004, customerName: "Lisa Anderson" },
    { id: 1005, customerName: "Robert Clark" },
    { id: 1006, customerName: "Emily White" },
    { id: 1007, customerName: "John Davis" },
    { id: 1008, customerName: "Amy Thompson" },
  ];

  // State for showing order details
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Calculate total progress
  const totalProgress = orderProgress.reduce((sum, order) => sum + order.progress, 0) / orderProgress.length;

  return (
    <div className="min-h-screen bg-[#EBE2D3] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Seamstress Dashboard</h1>
          <Button className="bg-accent hover:bg-accent/90 text-white">
            New Order
          </Button>
        </div>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-xl transition-all duration-200 bg-white border-none">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-xl">
                <BarChart className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-3xl font-bold text-gray-800">$2,450</p>
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
                <p className="text-3xl font-bold text-gray-800">24</p>
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
                <p className="text-3xl font-bold text-gray-800">{queueOrders}</p>
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
                <p className="text-3xl font-bold text-gray-800">{progressOrders}</p>
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
              <Progress value={(queueOrders / 10) * 100} className="w-32 h-2" />
            </div>
            <div className="space-y-4">
              {queuedOrders.map((order, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                      {selectedOrder?.id === order.id && (
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Ruler className="w-4 h-4" />
                            <span className="whitespace-pre-line">{order.measurements}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Price: {order.price}
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Timeframe: {order.timeframe}
                          </p>
                          {order.inspiration && (
                            <div className="mt-2">
                              <p className="flex items-center gap-2 mb-2">
                                <Image className="w-4 h-4" />
                                Inspiration:
                              </p>
                              <img 
                                src={order.inspiration} 
                                alt="Inspiration" 
                                className="w-32 h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary"
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              ))}
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
                <Progress value={(progressOrders / 5) * 100} className="w-32 h-2" />
              </div>
            </div>
            <div className="space-y-4">
              {orderProgress.map((order, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                      {selectedOrder?.id === order.id && (
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Ruler className="w-4 h-4" />
                            <span className="whitespace-pre-line">{order.measurements}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Price: {order.price}
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Timeframe: {order.timeframe}
                          </p>
                          {order.inspiration && (
                            <div className="mt-2">
                              <p className="flex items-center gap-2 mb-2">
                                <Image className="w-4 h-4" />
                                Inspiration:
                              </p>
                              <img 
                                src={order.inspiration} 
                                alt="Inspiration" 
                                className="w-32 h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Progress value={order.progress} className="w-24 h-2" />
                    <span className="text-sm font-medium text-primary">{order.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeamstressDashboard;
