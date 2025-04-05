import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  FileDown, 
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { WorkflowInstance } from "@/lib/types";

const WorkflowsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: workflowInstances, isLoading, error } = useQuery({
    queryKey: ["/api/workflow-instances", { status: statusFilter !== "all" ? statusFilter : undefined }],
  });

  const { data: workflows } = useQuery({
    queryKey: ["/api/workflows"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  // Mutation for updating workflow instance status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return apiRequest("PUT", `/api/workflow-instances/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflow-instances"] });
      toast({
        title: "Success",
        description: "Workflow status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update workflow status",
        variant: "destructive",
      });
    },
  });

  // Mutation for advancing workflow step
  const advanceStepMutation = useMutation({
    mutationFn: async ({ id, currentStep }: { id: number, currentStep: number }) => {
      return apiRequest("PUT", `/api/workflow-instances/${id}`, { currentStep: currentStep + 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflow-instances"] });
      toast({
        title: "Success",
        description: "Workflow advanced to next step",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to advance workflow",
        variant: "destructive",
      });
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load workflows data",
      variant: "destructive",
    });
  }

  const filteredInstances = workflowInstances?.filter((instance: WorkflowInstance) => {
    if (!searchQuery) return true;
    
    const employee = employees?.find((e: any) => e.id === instance.employeeId);
    if (!employee) return false;
    
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const workflow = workflows?.find((w: any) => w.id === instance.workflowId);
    const workflowName = workflow?.name.toLowerCase() || "";
    
    return fullName.includes(searchQuery.toLowerCase()) || 
           workflowName.includes(searchQuery.toLowerCase());
  });

  const paginatedInstances = filteredInstances?.slice((page - 1) * limit, page * limit);
  const totalPages = filteredInstances ? Math.ceil(filteredInstances.length / limit) : 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmployeeName = (employeeId?: number | null) => {
    if (!employeeId) return "N/A";
    const employee = employees?.find((e: any) => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown";
  };

  const getWorkflowName = (workflowId: number) => {
    const workflow = workflows?.find((w: any) => w.id === workflowId);
    return workflow ? workflow.name : "Unknown";
  };

  const getStepName = (workflowId: number, stepNumber: number) => {
    const workflow = workflows?.find((w: any) => w.id === workflowId);
    if (!workflow || !workflow.steps || stepNumber >= workflow.steps.length) {
      return `Step ${stepNumber + 1}`;
    }
    return workflow.steps[stepNumber]?.name || `Step ${stepNumber + 1}`;
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm text-neutral-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1">
            <li>
              <Link href="/">
                <a className="hover:text-primary">Home</a>
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <span>/</span>
              <span className="text-primary">Workflows</span>
            </li>
          </ol>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-neutral-800">Workflow Management</h1>
          
          <div className="mt-2 md:mt-0 flex space-x-2">
            <Link href="/workflows/create">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-1.5" />
                Create Workflow
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Workflow Tabs */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Workflows</CardTitle>
          <CardDescription>
            Manage workflow processes and approvals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="active" className="flex items-center">
                <Play className="h-4 w-4 mr-1.5" />
                Active Workflows
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1.5" />
                Workflow Templates
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Filter & Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              <Input 
                type="text" 
                placeholder="Search workflows..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select 
                defaultValue="all"
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-1.5" />
                More Filters
              </Button>
              <Button variant="outline" className="flex items-center">
                <FileDown className="h-4 w-4 mr-1.5" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflows Table */}
      <TabsContent value="active" className="mt-0">
        <Card>
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg font-semibold">Active Workflow Instances</CardTitle>
          </CardHeader>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Current Step</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-neutral-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <span>Loading workflows...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedInstances?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-neutral-500">
                        <Briefcase className="h-10 w-10 mb-2" />
                        <span>No active workflows found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInstances?.map((instance: WorkflowInstance) => (
                    <TableRow key={instance.id} className="hover:bg-neutral-50">
                      <TableCell className="font-medium">
                        {getWorkflowName(instance.workflowId)}
                      </TableCell>
                      <TableCell>
                        {instance.employeeId ? (
                          <Link href={`/employees/${instance.employeeId}`}>
                            <a className="text-primary hover:underline">
                              {getEmployeeName(instance.employeeId)}
                            </a>
                          </Link>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {getStepName(instance.workflowId, instance.currentStep)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(instance.status)} variant="outline">
                          {instance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(instance.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(instance.updatedAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => advanceStepMutation.mutate({
                              id: instance.id,
                              currentStep: instance.currentStep
                            })}
                            disabled={instance.status !== 'pending'}
                          >
                            <Play className="h-4 w-4" />
                            <span className="sr-only">Advance</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600"
                            onClick={() => updateStatusMutation.mutate({
                              id: instance.id,
                              status: 'approved'
                            })}
                            disabled={instance.status !== 'pending'}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => updateStatusMutation.mutate({
                              id: instance.id,
                              status: 'rejected'
                            })}
                            disabled={instance.status !== 'pending'}
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                          <Link href={`/workflows/${instance.id}`}>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <CardFooter className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
              <div className="text-sm text-neutral-600">
                Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(page * limit, filteredInstances?.length || 0)}
                </span> of{" "}
                <span className="font-medium">{filteredInstances?.length || 0}</span> results
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page >= totalPages} 
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="templates" className="mt-0">
        <Card>
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg font-semibold">Workflow Templates</CardTitle>
          </CardHeader>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Steps</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-neutral-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <span>Loading workflow templates...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : workflows?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-neutral-500">
                        <Briefcase className="h-10 w-10 mb-2" />
                        <span>No workflow templates found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  workflows?.map((workflow: any) => (
                    <TableRow key={workflow.id} className="hover:bg-neutral-50">
                      <TableCell className="font-medium">
                        {workflow.name}
                      </TableCell>
                      <TableCell>
                        {workflow.description || "No description"}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(workflow.steps) ? workflow.steps.length : 0} steps
                      </TableCell>
                      <TableCell>
                        {getEmployeeName(workflow.createdBy)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/workflows/templates/${workflow.id}`}>
                            <Button variant="outline" size="sm">
                              <ArrowRight className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                          <Link href={`/workflows/start/${workflow.id}`}>
                            <Button variant="outline" size="sm" className="text-green-600">
                              <Play className="h-4 w-4 mr-1" />
                              <span>Start</span>
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="completed" className="mt-0">
        <Card>
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg font-semibold">Completed Workflows</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <h3 className="text-lg font-medium text-neutral-700 mb-1">No Completed Workflows Yet</h3>
              <p className="text-neutral-500 mb-4">Completed workflows will appear here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default WorkflowsPage;
