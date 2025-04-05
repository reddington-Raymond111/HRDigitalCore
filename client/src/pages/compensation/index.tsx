import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  FileDown, 
  ArrowRight,
  ArrowUp,
  ArrowDown
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
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const CompensationPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: compensations, isLoading, error } = useQuery({
    queryKey: ["/api/compensations"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load compensation data",
      variant: "destructive",
    });
  }

  const filteredCompensations = compensations?.filter((compensation: any) => {
    if (reasonFilter !== "all" && compensation.reason !== reasonFilter) {
      return false;
    }
    
    if (!searchQuery) return true;
    
    const employee = employees?.find((e: any) => e.id === compensation.employeeId);
    if (!employee) return false;
    
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const paginatedCompensations = filteredCompensations?.slice((page - 1) * limit, page * limit);
  const totalPages = filteredCompensations ? Math.ceil(filteredCompensations.length / limit) : 0;

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
              <span className="text-primary">Compensation</span>
            </li>
          </ol>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-neutral-800">Salary & Compensation</h1>
          
          <div className="mt-2 md:mt-0 flex space-x-2">
            <Link href="/compensation/add">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Compensation Change
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Average Salary</p>
                <p className="text-2xl font-semibold mt-1">$89,450</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Payroll</p>
                <p className="text-2xl font-semibold mt-1">$1,789,000</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Salary Changes (YTD)</p>
                <p className="text-2xl font-semibold mt-1">+4.2%</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                <ArrowUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
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
                value={reasonFilter}
                onValueChange={setReasonFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="annual_review">Annual Review</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="initial">Initial Salary</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
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

      {/* Compensation Table */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200">
          <CardTitle className="text-lg font-semibold">Compensation History</CardTitle>
          <CardDescription>
            Track salary changes and compensation history for all employees
          </CardDescription>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <span>Loading compensation data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  <TableRow className="hover:bg-neutral-50">
                    <TableCell>
                      <Link href="/employees/5">
                        <a className="font-medium text-primary hover:underline">
                          Maria Lopez
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell>Oct 01, 2023</TableCell>
                    <TableCell>$85,000 USD</TableCell>
                    <TableCell>
                      <div className="flex items-center text-green-600">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <span>+6.25%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Promotion</Badge>
                    </TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow className="hover:bg-neutral-50">
                    <TableCell>
                      <Link href="/employees/3">
                        <a className="font-medium text-primary hover:underline">
                          Alex Kim
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell>Sep 15, 2023</TableCell>
                    <TableCell>$95,000 USD</TableCell>
                    <TableCell>
                      <div className="flex items-center text-green-600">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <span>+5.56%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Annual Review</Badge>
                    </TableCell>
                    <TableCell>Michael Rodriguez</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow className="hover:bg-neutral-50">
                    <TableCell>
                      <Link href="/employees/7">
                        <a className="font-medium text-primary hover:underline">
                          James Taylor
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell>Aug 01, 2023</TableCell>
                    <TableCell>$75,000 USD</TableCell>
                    <TableCell>
                      <div className="flex items-center text-neutral-600">
                        <span>Initial</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Initial Salary</Badge>
                    </TableCell>
                    <TableCell>Jennifer Smith</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow className="hover:bg-neutral-50">
                    <TableCell>
                      <Link href="/employees/4">
                        <a className="font-medium text-primary hover:underline">
                          Rebecca Park
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell>Jul 15, 2023</TableCell>
                    <TableCell>$80,000 USD</TableCell>
                    <TableCell>
                      <div className="flex items-center text-green-600">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <span>+3.90%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Annual Review</Badge>
                    </TableCell>
                    <TableCell>David Johnson</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
        
        <CardFooter className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="text-sm text-neutral-600">
              Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * limit, filteredCompensations?.length || 4)}
              </span> of{" "}
              <span className="font-medium">{filteredCompensations?.length || 4}</span> results
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

export default CompensationPage;
