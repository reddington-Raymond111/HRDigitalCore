import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  status: string;
  position: string;
  department: string;
};

const EmployeeTable = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard/employees"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Recent Employees</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-60">
            <div className="animate-pulse text-neutral-400">Loading employees...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load employee data",
      variant: "destructive",
    });
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Recent Employees</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-60">
            <div className="text-red-500">Error loading employee data</div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">Recent Employees</CardTitle>
        <Link href="/employees">
          <Button variant="link" className="text-primary font-medium">View All</Button>
        </Link>
      </CardHeader>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead className="w-[250px]">Employee</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((employee: Employee) => (
              <TableRow key={employee.id} className="hover:bg-neutral-50">
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 bg-primary-light text-white">
                      <AvatarFallback>{getInitials(employee.firstName, employee.lastName)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="font-medium text-neutral-800">{employee.firstName} {employee.lastName}</div>
                      <div className="text-sm text-neutral-600">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{format(new Date(employee.hireDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(employee.status)} variant="outline">
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/employees/${employee.id}`}>
                    <Button variant="link" className="text-primary mr-3">View</Button>
                  </Link>
                  <Link href={`/employees/${employee.id}/edit`}>
                    <Button variant="link" className="text-neutral-600">Edit</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CardFooter className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-neutral-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{data?.length || 0}</span> of <span className="font-medium">{data?.length || 0}</span> results
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
              disabled 
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmployeeTable;
