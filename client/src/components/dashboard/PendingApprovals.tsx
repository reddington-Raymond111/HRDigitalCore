import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  HelpCircle,
  FileText,
  ClipboardList
} from "lucide-react";

type ApprovalItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
};

const PendingApprovals = () => {
  const { toast } = useToast();
  
  const { data: workflowInstances, isLoading, error } = useQuery({
    queryKey: ["/api/workflow-instances", { status: "pending" }],
  });

  const approveMutation = useMutation({
    mutationFn: async (instanceId: number) => {
      return apiRequest("PUT", `/api/workflow-instances/${instanceId}`, {
        status: "approved",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflow-instances"] });
      toast({
        title: "Success",
        description: "Request approved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (instanceId: number) => {
      return apiRequest("PUT", `/api/workflow-instances/${instanceId}`, {
        status: "rejected",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflow-instances"] });
      toast({
        title: "Success",
        description: "Request rejected",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    },
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'promotion':
        return <HelpCircle className="h-5 w-5" />;
      case 'contract':
        return <FileText className="h-5 w-5" />;
      case 'leave':
        return <ClipboardList className="h-5 w-5" />;
      default:
        return <HelpCircle className="h-5 w-5" />;
    }
  };

  // Mock approvals for display rendering
  const pendingApprovals: ApprovalItem[] = [
    {
      id: 1,
      type: 'promotion',
      title: 'Promotion Request',
      description: 'Maria Lopez requested a promotion to Senior UX Designer',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'contract',
      title: 'Contract Approval',
      description: 'New employment contract for Alex Kim requires approval',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      type: 'leave',
      title: 'Leave Request',
      description: 'James Taylor requested 5 days of vacation from Nov 20-24',
      timestamp: 'Yesterday'
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse text-neutral-400">Loading approvals...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">Pending Approvals</CardTitle>
        <Link href="/workflows">
          <Button variant="link" className="text-primary font-medium">View All</Button>
        </Link>
      </CardHeader>
      <CardContent className="p-3">
        <ul className="divide-y divide-neutral-200">
          {pendingApprovals.map((approval) => (
            <li key={approval.id} className="p-3 hover:bg-neutral-50 rounded-md">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                  {getIcon(approval.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-800">{approval.title}</p>
                    <p className="text-xs text-neutral-500">{approval.timestamp}</p>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">{approval.description}</p>
                  <div className="mt-2 flex space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-primary text-white text-xs rounded-md hover:bg-primary-dark"
                      onClick={() => approveMutation.mutate(approval.id)}
                      disabled={approveMutation.isPending}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border border-neutral-300 text-neutral-700 text-xs rounded-md hover:bg-neutral-50"
                      onClick={() => rejectMutation.mutate(approval.id)}
                      disabled={rejectMutation.isPending}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PendingApprovals;
