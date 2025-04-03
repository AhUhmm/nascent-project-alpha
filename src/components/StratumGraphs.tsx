
import { Stratum } from "@/contexts/StratumContext";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

type StratumGraphsProps = {
  stratum: Stratum;
};

// Mock data for charts
const generateMockData = (stratumId: string) => {
  // Generate consistent data based on stratumId for demo
  const seed = stratumId.charCodeAt(stratumId.length - 1);
  
  const timeSeriesData = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}`,
    value: 30 + Math.sin(i / 2 + seed / 10) * 20 + Math.random() * 10,
    trend: 20 + i * 3 + seed % 5,
  }));
  
  const barData = [
    { name: "Category A", value: 40 + seed % 30 },
    { name: "Category B", value: 30 + seed % 20 },
    { name: "Category C", value: 50 + seed % 40 },
    { name: "Category D", value: 35 + seed % 25 },
    { name: "Category E", value: 45 + seed % 35 },
  ];
  
  const pieData = [
    { name: "Group 1", value: 30 + seed % 20 },
    { name: "Group 2", value: 25 + seed % 15 },
    { name: "Group 3", value: 45 + seed % 30 },
  ];
  
  return { timeSeriesData, barData, pieData };
};

const COLORS = ["#1E88E5", "#26A69A", "#5C6BC0", "#7E57C2"];

const StratumGraphs = ({ stratum }: StratumGraphsProps) => {
  const { timeSeriesData, barData, pieData } = generateMockData(stratum.id);

  return (
    <div className="h-full grid grid-cols-2 grid-rows-2 gap-4 p-4 bg-background">
      {/* Line Chart */}
      <div className="bg-card rounded-md border p-3">
        <h4 className="text-sm font-medium mb-2">Time Series Data</h4>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#1E88E5" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="trend" stroke="#5C6BC0" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Bar Chart */}
      <div className="bg-card rounded-md border p-3">
        <h4 className="text-sm font-medium mb-2">Category Comparison</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#26A69A" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Area Chart */}
      <div className="bg-card rounded-md border p-3">
        <h4 className="text-sm font-medium mb-2">Cumulative Data</h4>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#7E57C2" fill="#7E57C2" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Pie Chart */}
      <div className="bg-card rounded-md border p-3">
        <h4 className="text-sm font-medium mb-2">Distribution</h4>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StratumGraphs;
