'use client';

import { Card } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, ArrowUpRight } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "2,543",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Active Sessions",
    value: "456",
    change: "+8.2%",
    icon: BarChart3,
  },
  {
    title: "Revenue",
    value: "$45,678",
    change: "+15.3%",
    icon: DollarSign,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Here's an overview of your business
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                {stat.change}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Placeholder for charts and other dashboard content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4 p-6">
          <h3 className="font-semibold mb-4">Activity Overview</h3>
          <div className="h-[300px] flex items-center justify-center border rounded-lg">
            Chart placeholder
          </div>
        </Card>
        <Card className="md:col-span-3 p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 border-b pb-4">
                <div className="h-8 w-8 rounded-full bg-gray-100" />
                <div>
                  <p className="text-sm font-medium">User Activity {i}</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
