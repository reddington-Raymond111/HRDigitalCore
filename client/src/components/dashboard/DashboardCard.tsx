import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

type DashboardCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
};

const DashboardCard = ({
  title,
  value,
  icon,
  trend,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary"
}: DashboardCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-full ${iconBgColor} ${iconColor} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className={`mt-4 flex items-center text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
