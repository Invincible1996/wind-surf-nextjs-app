'use client';

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { Users, DollarSign, Clock, MousePointerClick } from "lucide-react";

const monthlyData = [
  { name: 'Jan', users: 4000, revenue: 2400, sessions: 6000 },
  { name: 'Feb', users: 3000, revenue: 1398, sessions: 5000 },
  { name: 'Mar', users: 2000, revenue: 9800, sessions: 4000 },
  { name: 'Apr', users: 2780, revenue: 3908, sessions: 7000 },
  { name: 'May', users: 1890, revenue: 4800, sessions: 4500 },
  { name: 'Jun', users: 2390, revenue: 3800, sessions: 6000 },
  { name: 'Jul', users: 3490, revenue: 4300, sessions: 7500 },
  { name: 'Aug', users: 4000, revenue: 2400, sessions: 8000 },
  { name: 'Sep', users: 3000, revenue: 1398, sessions: 7000 },
  { name: 'Oct', users: 2000, revenue: 9800, sessions: 6500 },
  { name: 'Nov', users: 2780, revenue: 3908, sessions: 7800 },
  { name: 'Dec', users: 3890, revenue: 4800, sessions: 8500 },
];

const deviceData = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 20 },
];

const locationData = [
  { name: 'North America', value: 40 },
  { name: 'Europe', value: 30 },
  { name: 'Asia', value: 20 },
  { name: 'Others', value: 10 },
];

const hourlyData = [
  { hour: '00:00', users: 200 },
  { hour: '03:00', users: 150 },
  { hour: '06:00', users: 300 },
  { hour: '09:00', users: 800 },
  { hour: '12:00', users: 1200 },
  { hour: '15:00', users: 1000 },
  { hour: '18:00', users: 900 },
  { hour: '21:00', users: 500 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics Overview</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Select defaultValue="30">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="1">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
          <button className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm">
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="24,571"
          change={12}
          description="Active users this month"
          icon={<Users className="w-4 h-4 text-primary" />}
        />
        <StatCard
          title="Revenue"
          value="$45,233"
          change={8.2}
          description="Total revenue this month"
          icon={<DollarSign className="w-4 h-4 text-primary" />}
        />
        <StatCard
          title="Avg. Session"
          value="4m 32s"
          change={-2.3}
          description="Average session duration"
          icon={<Clock className="w-4 h-4 text-primary" />}
        />
        <StatCard
          title="Conversion"
          value="3.42%"
          change={4.1}
          description="Conversion rate this month"
          icon={<MousePointerClick className="w-4 h-4 text-primary" />}
        />
      </div>

      {/* Monthly Overview */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Monthly Overview</h3>
        <div className="h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#0088FE"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#00C49F"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Device Distribution */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Device Distribution</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Geographic Distribution */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Geographic Distribution</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Hourly Traffic */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">24-Hour Traffic</h3>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Session Duration */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Monthly Sessions</h3>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="sessions"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              >
                {monthlyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${index * 30}, 70%, 60%)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
