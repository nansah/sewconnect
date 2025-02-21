
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { 
  BarChart, 
  Users, 
  ListChecks, 
  Clock,
  ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";

const SeamstressDashboard = () => {
  const totalOrders = 11;
  const queueOrders = 8;
  const progressOrders = 3;
  
  const queuePercentage = (queueOrders / totalOrders) * 100;
  const progressPercentage = (progressOrders / totalOrders) * 100;

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
              {Array.from({ length: queueOrders }).map((_, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order #{1000 + index}</p>
                      <p className="text-sm text-gray-500">Customer Name</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary"
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
              <Progress value={(progressOrders / 5) * 100} className="w-32 h-2" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: progressOrders }).map((_, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order #{2000 + index}</p>
                      <p className="text-sm text-gray-500">Customer Name</p>
                    </div>
                  </div>
                  <Progress value={65} className="w-24 h-2" />
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
