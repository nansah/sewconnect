
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
  // Sample data - in a real app this would come from your backend
  const totalOrders = 11; // 8 in queue + 3 in progress
  const queueOrders = 8;
  const progressOrders = 3;
  
  const queuePercentage = (queueOrders / totalOrders) * 100;
  const progressPercentage = (progressOrders / totalOrders) * 100;

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <BarChart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">$2,450</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Queue</p>
                <p className="text-2xl font-bold">{queueOrders}</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={queuePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{queuePercentage.toFixed(0)}% of total orders</p>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <ListChecks className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{progressOrders}</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{progressPercentage.toFixed(0)}% of total orders</p>
            </div>
          </Card>
        </div>

        {/* Orders Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Queue Table */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Orders in Queue</h2>
              <Progress value={(queueOrders / 10) * 100} className="w-32 h-2" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: queueOrders }).map((_, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">Order #{1000 + index}</p>
                      <p className="text-sm text-muted-foreground">Customer Name</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* In Progress Table */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Orders in Progress</h2>
              <Progress value={(progressOrders / 5) * 100} className="w-32 h-2" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: progressOrders }).map((_, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">Order #{2000 + index}</p>
                      <p className="text-sm text-muted-foreground">Customer Name</p>
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
