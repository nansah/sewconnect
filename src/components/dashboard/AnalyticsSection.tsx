
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Users, ListChecks, Clock } from "lucide-react";

interface AnalyticsSectionProps {
  totalSales: number;
  uniqueCustomers: number;
  queueOrders: number;
  progressOrders: number;
  totalOrders: number;
  queuePercentage: number;
  progressPercentage: number;
  totalProgress: number;
}

export const AnalyticsSection = ({
  totalSales,
  uniqueCustomers,
  queueOrders,
  progressOrders,
  totalOrders,
  queuePercentage,
  progressPercentage,
  totalProgress
}: AnalyticsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 hover:shadow-xl transition-all duration-200 bg-white border-none">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-4 rounded-xl">
            <BarChart className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <p className="text-3xl font-bold text-gray-800">${totalSales}</p>
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
            <p className="text-3xl font-bold text-gray-800">{uniqueCustomers}</p>
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
  );
};
