
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface SalesChartProps {
  salesData: Array<{
    name: string;
    sales: number;
  }>;
}

export const SalesChart = ({ salesData }: SalesChartProps) => {
  return (
    <Card className="p-6 bg-white border-none shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Sales Overview</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

