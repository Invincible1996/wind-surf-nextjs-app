'use client';

import { Card } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  description: string;
  icon: React.ReactNode;
}

export function StatCard({ title, value, change, description, icon }: StatCardProps) {
  const isPositive = change > 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
        </div>
        <div className={cn(
          "flex items-center space-x-1 text-sm",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4" />
          ) : (
            <ArrowDownIcon className="w-4 h-4" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
