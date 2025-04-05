import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";

type OrgChartNode = {
  id: number;
  name: string;
  position: string;
  managerId: number | null;
  level: number;
};

const OrgChart = () => {
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ["/api/organization/chart"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Organization Structure</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-60">
            <div className="animate-pulse text-neutral-400">Loading organization chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Organization Structure</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-60">
            <div className="text-red-500">Error loading organization chart</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find CEO (top level)
  const ceo = chartData?.find((node: OrgChartNode) => node.level === 1);
  
  // Find direct reports to CEO (level 2)
  const executives = chartData?.filter(
    (node: OrgChartNode) => node.managerId === ceo?.id && node.level === 1
  );

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">Organization Structure</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5 text-neutral-600" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto" style={{ minHeight: "240px" }}>
          <div className="flex flex-col items-center">
            {/* CEO */}
            {ceo && (
              <div className="p-3 border border-primary rounded-lg bg-primary/5 mb-6 w-64 text-center">
                <p className="font-medium">{ceo.name}</p>
                <p className="text-sm text-neutral-600">{ceo.position}</p>
              </div>
            )}
            
            {/* Level 1 */}
            <div className="w-full flex justify-center">
              <div className="border-t-2 border-primary absolute w-1/2"></div>
            </div>
            <div className="flex justify-center space-x-8 mb-6 relative">
              {executives?.map((executive: OrgChartNode) => (
                <div key={executive.id} className="p-3 border border-primary-light rounded-lg bg-primary/5 w-52 text-center">
                  <p className="font-medium">{executive.name}</p>
                  <p className="text-sm text-neutral-600">{executive.position}</p>
                </div>
              ))}
            </div>
            
            {/* Show more prompt */}
            <div className="flex justify-center mb-2">
              <div className="text-center">
                <div className="text-sm font-medium text-neutral-600 mb-2">+ {(chartData?.length || 0) - (executives?.length || 0) - 1} more positions</div>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                  View Full Chart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrgChart;
