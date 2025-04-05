import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  FileDown, 
  ArrowRight,
  HeartPulse,
  PiggyBank,
  Activity,
  CalendarClock
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BenefitsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState("all");

  const { data: benefits, isLoading, error } = useQuery({
    queryKey: ["/api/benefits"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load benefits data",
      variant: "destructive",
    });
  }

  const getBenefitTypeIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <HeartPulse className="h-4 w-4 mr-1.5 text-red-500" />;
      case 'retirement':
        return <PiggyBank className="h-4 w-4 mr-1.5 text-amber-500" />;
      case 'insurance':
        return <Shield className="h-4 w-4 mr-1.5 text-green-500" />;
      case 'leave':
        return <CalendarClock className="h-4 w-4 mr-1.5 text-blue-500" />;
      case 'wellness':
        return <Activity className="h-4 w-4 mr-1.5 text-purple-500" />;
      default:
        return <Shield className="h-4 w-4 mr-1.5 text-primary" />;
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
              <span className="text-primary">Benefits</span>
            </li>
          </ol>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-neutral-800">Benefits & Insurance</h1>
          
          <div className="mt-2 md:mt-0 flex space-x-2">
            <Link href="/benefits/add">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Benefit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="md:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Benefits Overview</CardTitle>
            <CardDescription>
              Manage employee benefits and social insurance programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="all" className="flex items-center">
                  <Shield className="h-4 w-4 mr-1.5" />
                  All
                </TabsTrigger>
                <TabsTrigger value="health" className="flex items-center">
                  <HeartPulse className="h-4 w-4 mr-1.5" />
                  Health
                </TabsTrigger>
                <TabsTrigger value="retirement" className="flex items-center">
                  <PiggyBank className="h-4 w-4 mr-1.5" />
                  Retirement
                </TabsTrigger>
                <TabsTrigger value="insurance" className="flex items-center">
                  <Shield className="h-4 w-4 mr-1.5" />
                  Insurance
                </TabsTrigger>
                <TabsTrigger value="others" className="flex items-center">
                  <Activity className="h-4 w-4 mr-1.5" />
                  Others
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Benefit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
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

      {/* Benefits Table */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-neutral-200">
          <CardTitle className="text-lg font-semibold">Employee Benefits</CardTitle>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Benefit Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <span>Loading benefits data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  <TableRow className="hover:bg-neutral-50">
                    <TableCell>
                      <Link href="/employees/1">
                        <a className="font-medium text-primary hover:underline">
                          Sarah Chen
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getBenefitTypeIcon('health')}
                        <span>Health Insurance</span>
                      </div>
                    </TableCell>
                    <TableCell>BlueCross Health</TableCell>
                    <TableCell>Jan 01, 2023</TableCell>
                    <TableCell>Dec 31, 2023</TableCell>
                    <TableCell>$450/month</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow className="hover:bg-neutral-50">
                    <TableCell>
                      <Link href="/employees/2">
                        <a className="font-medium text-primary hover:underline">
                          Michael Rodriguez
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getBenefitTypeIcon('retirement')}
                        <span>401(k) Plan</span>
                      </div>
                    </TableCell>
                    <TableCell>Fidelity Investments</TableCell>
                    <TableCell>Feb 15, 2021</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>5% match</TableCell>
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
                          Jennifer Smith
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getBenefitTypeIcon('insurance')}
                        <span>Life Insurance</span>
                      </div>
                    </TableCell>
                    <TableCell>MetLife</TableCell>
                    <TableCell>Mar 10, 2022</TableCell>
                    <TableCell>Mar 10, 2032</TableCell>
                    <TableCell>$500,000</TableCell>
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
                          David Johnson
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getBenefitTypeIcon('leave')}
                        <span>Paid Time Off</span>
                      </div>
                    </TableCell>
                    <TableCell>Company Policy</TableCell>
                    <TableCell>Jan 01, 2023</TableCell>
                    <TableCell>Dec 31, 2023</TableCell>
                    <TableCell>20 days/year</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow className="hover:bg-neutral-50">
                    <TableCell>
                      <Link href="/employees/5">
                        <a className="font-medium text-primary hover:underline">
                          Alex Kim
                        </a>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getBenefitTypeIcon('wellness')}
                        <span>Wellness Program</span>
                      </div>
                    </TableCell>
                    <TableCell>FitLife Corporate</TableCell>
                    <TableCell>Apr 01, 2023</TableCell>
                    <TableCell>Mar 31, 2024</TableCell>
                    <TableCell>$100/month</TableCell>
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
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">5</span> of{" "}
              <span className="font-medium">5</span> results
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
                disabled={true} 
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

export default BenefitsPage;
