
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  description?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  trend?: "up" | "down";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  className,
  trend,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {trend && (
              <span
                className={cn(
                  "mr-1",
                  trend === "up" ? "text-green-500" : "text-red-500"
                )}
              >
                {trend === "up" ? "↑" : "↓"} {description?.value}%
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
