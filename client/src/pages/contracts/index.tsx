import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  FileDown, 
  ArrowRight,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  CardFooter
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format, differenceInDays } from "date-fns";

const ContractsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: contracts, isLoading, error } = useQuery({
    queryKey: ["/api/contracts"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load contracts data",
      variant: "destructive",
    });
  }

  const filteredContracts = contracts?.filter((contract: any) => {
    if (statusFilter !== "all" && contract.status !== statusFilter) {
      return false;
    }
    
    if (!searchQuery) return true;
    
    const employee = employees?.find((e: any) => e.id === contract.employeeId);
    if (!employee) return false;
    
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const paginatedContracts = filteredContracts?.slice((page - 1) * limit, page * limit);
  const totalPages = filteredContracts ? Math.ceil(filteredContracts.length / limit) : 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilRenewal = (renewalDate: string) => {
    if (!renewalDate) return null;
    
    const days = differenceInDays(new Date(renewalDate), new Date());
    
    if (days <= 0) {
      return { label: "Overdue", color: "text-red-600" };
    } else if (days <= 14) {
      return { label: `${days} days`, color: "text-red-600" };
    } else if (days <= 30) {
      return { label: `${days} days`, color: "text-amber-600" };
    } else {
      return { label: `${days} days`, color: "text-neutral-600" };
    }
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
              <span className="text-primary">Contracts</span>
            </li>
          </ol>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-neutral-800">Contracts & Documents</h1>
          
          <div className="mt-2 md:mt-0 flex space-x-2">
            <Link href="/contracts/create">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-1.5" />
                Create Contract
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              <Input 
                type="text" 
                placeholder="Search by employee name..." 
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
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

      {/* Contracts Table */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200">
          <CardTitle className="text-lg font-semibold">Contract List</CardTitle>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Contract Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Renewal Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <span>Loading contracts...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedContracts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <FileText className="h-10 w-10 mb-2" />
                      <span>No contracts found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedContracts?.map((contract: any) => {
                  const employee = employees?.find((e: any) => e.id === contract.employeeId);
                  const renewalInfo = getDaysUntilRenewal(contract.renewalDate);
                  
                  return (
                    <TableRow key={contract.id} className="hover:bg-neutral-50">
                      <TableCell>
                        {employee ? (
                          <Link href={`/employees/${employee.id}`}>
                            <a className="font-medium text-primary hover:underline">
                              {employee.firstName} {employee.lastName}
                            </a>
                          </Link>
                        ) : (
                          <span className="text-neutral-500">Unknown Employee</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {contract.contractType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(contract.startDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {contract.endDate ? format(new Date(contract.endDate), 'MMM dd, yyyy') : 'Indefinite'}
                      </TableCell>
                      <TableCell>
                        {contract.renewalDate ? (
                          <div className="flex items-center">
                            <Clock className={`h-4 w-4 mr-1.5 ${renewalInfo?.color}`} />
                            <span className={renewalInfo?.color}>
                              {renewalInfo?.label}
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contract.status)} variant="outline">
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/contracts/${contract.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        <CardFooter className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="text-sm text-neutral-600">
              Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * limit, filteredContracts?.length || 0)}
              </span> of{" "}
              <span className="font-medium">{filteredContracts?.length || 0}</span> results
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
    </div>
  );
};

export default ContractsPage;
