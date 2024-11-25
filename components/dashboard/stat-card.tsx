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
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <h3 className="text-2xl font-bold truncate">{value}</h3>
          </div>
        </div>
        <div className={cn(
          "flex items-center space-x-1 text-sm whitespace-nowrap flex-shrink-0",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-1">{description}</p>
    </Card>
  );
}
