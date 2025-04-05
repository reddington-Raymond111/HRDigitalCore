import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format, differenceInDays } from "date-fns";

const ContractRenewals = () => {
  const { data: contracts, isLoading, error } = useQuery({
    queryKey: ["/api/contracts", { renewalDays: 30 }],
  });

  const getDueSeverity = (daysUntil: number) => {
    if (daysUntil <= 14) return "text-red-600";
    if (daysUntil <= 21) return "text-amber-600";
    return "text-neutral-600";
  };

  const formatDaysRemaining = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const daysRemaining = differenceInDays(renewal, today);
    
    return {
      days: daysRemaining,
      text: `Due in ${daysRemaining} days`,
      severity: getDueSeverity(daysRemaining)
    };
  };

  // Mock contract renewals data for display rendering
  const contractRenewals = [
    {
      id: 1,
      employeeName: "Rebecca Park",
      position: "Financial Analyst",
      renewalDate: "2023-11-15",
    },
    {
      id: 2,
      employeeName: "Marcus Johnson",
      position: "Sales Representative",
      renewalDate: "2023-11-22",
    },
    {
      id: 3,
      employeeName: "Sophia Chen",
      position: "Customer Support",
      renewalDate: "2023-11-29",
    },
    {
      id: 4,
      employeeName: "Ethan Williams",
      position: "Data Analyst",
      renewalDate: "2023-12-01",
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Contract Renewals</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse text-neutral-400">Loading contracts...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">Contract Renewals</CardTitle>
        <Link href="/contracts">
          <Button variant="link" className="text-primary font-medium">View All</Button>
        </Link>
      </CardHeader>
      <CardContent className="p-3">
        <ul className="divide-y divide-neutral-200">
          {contractRenewals.map((contract) => {
            const renewal = formatDaysRemaining(contract.renewalDate);
            
            return (
              <li key={contract.id} className="p-3 hover:bg-neutral-50 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{contract.employeeName}</p>
                    <p className="text-xs text-neutral-600 mt-1">{contract.position}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${renewal.severity}`}>{renewal.text}</p>
                    <p className="text-xs text-neutral-600 mt-1">{format(new Date(contract.renewalDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ContractRenewals;
