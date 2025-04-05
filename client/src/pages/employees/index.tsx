import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  UserPlus,
  Search,
  Filter,
  FileDown,
  FileUp,
  MoreHorizontal,
  ArrowUpDown
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
  CardFooter
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Employee } from "@/lib/types";

const EmployeesList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load employees data",
      variant: "destructive",
    });
  }

  const filteredEmployees = data?.filter(employee => {
    if (!searchQuery) return true;
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const paginatedEmployees = filteredEmployees?.slice((page - 1) * limit, page * limit);
  const totalPages = filteredEmployees ? Math.ceil(filteredEmployees.length / limit) : 0;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'onboarding':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              <Link href="/employees">
                <a className="text-primary">Employees</a>
              </Link>
            </li>
          </ol>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-neutral-800">Employees</h1>
          
          <div className="mt-2 md:mt-0 flex space-x-2">
            <Link href="/employees/add">
              <Button className="flex items-center">
                <UserPlus className="h-4 w-4 mr-1.5" />
                Add Employee
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
                placeholder="Search employees..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-1.5" />
                Filters
              </Button>
              <Button variant="outline" className="flex items-center">
                <FileDown className="h-4 w-4 mr-1.5" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center">
                <FileUp className="h-4 w-4 mr-1.5" />
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200">
          <CardTitle className="text-lg font-semibold">Employee Directory</CardTitle>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <div className="flex items-center">
                    Employee
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <span>Loading employees...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedEmployees?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <Users className="h-10 w-10 mb-2" />
                      <span>No employees found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmployees?.map((employee: Employee) => (
                  <TableRow key={employee.id} className="hover:bg-neutral-50">
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-white">
                            {getInitials(employee.firstName, employee.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="font-medium text-neutral-800">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-neutral-600">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {employee.positionId ? employee.positionId : "-"}
                    </TableCell>
                    <TableCell>
                      Engineering
                    </TableCell>
                    <TableCell>
                      {employee.hireDate ? format(new Date(employee.hireDate), 'MMM dd, yyyy') : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(employee.status || "active")} variant="outline">
                        {employee.status || "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/employees/${employee.id}`}>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                          </Link>
                          <Link href={`/employees/${employee.id}/edit`}>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>Add Contract</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                {Math.min(page * limit, filteredEmployees?.length || 0)}
              </span> of{" "}
              <span className="font-medium">{filteredEmployees?.length || 0}</span> results
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

export default EmployeesList;
