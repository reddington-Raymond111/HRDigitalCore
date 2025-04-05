import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Network,
  Search,
  Download,
  ZoomIn,
  ZoomOut,
  Plus,
  Minus,
  Users,
  Building,
  AlignCenter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";

type OrgChartNode = {
  id: number;
  name: string;
  position: string;
  department: string;
  managerId: number | null;
  level: number;
};

const OrganizationPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("chart");
  const [zoomLevel, setZoomLevel] = useState(100);

  const { data: departments } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: employees, isLoading: isEmployeesLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: positions } = useQuery({
    queryKey: ["/api/positions"],
  });

  const { data: chartData, isLoading: isChartLoading, error } = useQuery({
    queryKey: ["/api/organization/chart"],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load organization chart data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 150));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
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
              <span className="text-primary">Organization</span>
            </li>
          </ol>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-neutral-800">Organization Structure</h1>
          
          <div className="mt-2 md:mt-0 flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Link href="/departments/add">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Department
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Organization Tabs */}
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="chart" className="flex items-center">
                  <Network className="h-4 w-4 mr-1.5" />
                  Organization Chart
                </TabsTrigger>
                <TabsTrigger value="departments" className="flex items-center">
                  <Building className="h-4 w-4 mr-1.5" />
                  Departments
                </TabsTrigger>
                <TabsTrigger value="positions" className="flex items-center">
                  <AlignCenter className="h-4 w-4 mr-1.5" />
                  Positions
                </TabsTrigger>
              </TabsList>

              {activeTab === "chart" && (
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="outline" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{zoomLevel}%</span>
                  <Button size="icon" variant="outline" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value="chart" className="mt-6">
              {isChartLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
                    <p className="text-neutral-600">Loading organization chart...</p>
                  </div>
                </div>
              ) : chartData?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Network className="h-16 w-16 text-neutral-300 mb-4" />
                  <h2 className="text-xl font-medium text-neutral-800 mb-2">No Organization Data</h2>
                  <p className="text-neutral-600 mb-4">Start by adding departments and employees to build your organization structure.</p>
                  <div className="flex gap-4">
                    <Link href="/departments/add">
                      <Button variant="outline">Add Department</Button>
                    </Link>
                    <Link href="/employees/add">
                      <Button>Add Employee</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="min-h-[500px] overflow-auto bg-neutral-50 p-6 border border-neutral-200 rounded-md">
                  <div className="flex flex-col items-center" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}>
                    {/* Top Level Executive */}
                    {chartData && chartData.filter((node: OrgChartNode) => node.level === 1 && !node.managerId).map((ceo: OrgChartNode) => (
                      <div key={ceo.id} className="mb-10">
                        <div className="p-4 border-2 border-primary rounded-lg bg-primary/5 w-64 text-center">
                          <Link href={`/employees/${ceo.id}`}>
                            <a className="font-medium text-neutral-800 hover:text-primary">{ceo.name}</a>
                          </Link>
                          <p className="text-sm text-neutral-600">{ceo.position}</p>
                        </div>
                        
                        {/* Level 1 Executives */}
                        {chartData && chartData.filter((node: OrgChartNode) => node.managerId === ceo.id).length > 0 && (
                          <>
                            <div className="w-px h-8 bg-neutral-300 mx-auto"></div>
                            <div className="w-[90%] h-px bg-neutral-300 mx-auto"></div>
                            <div className="flex justify-center flex-wrap gap-6 mt-6">
                              {chartData.filter((node: OrgChartNode) => node.managerId === ceo.id).map((exec: OrgChartNode) => (
                                <div key={exec.id} className="flex flex-col items-center">
                                  <div className="w-px h-8 bg-neutral-300"></div>
                                  <div className="p-4 border border-primary-light rounded-lg bg-primary/5 w-56 text-center">
                                    <Link href={`/employees/${exec.id}`}>
                                      <a className="font-medium text-neutral-800 hover:text-primary">{exec.name}</a>
                                    </Link>
                                    <p className="text-sm text-neutral-600">{exec.position}</p>
                                    <p className="text-xs text-neutral-500">{exec.department}</p>
                                  </div>
                                  
                                  {/* Level 2 Direct Reports */}
                                  {chartData && chartData.filter((node: OrgChartNode) => node.managerId === exec.id).length > 0 && (
                                    <>
                                      <div className="w-px h-8 bg-neutral-300"></div>
                                      <div className="w-full h-px bg-neutral-300"></div>
                                      <div className="flex justify-center flex-wrap gap-4 mt-6">
                                        {chartData.filter((node: OrgChartNode) => node.managerId === exec.id).map((manager: OrgChartNode) => (
                                          <div key={manager.id} className="flex flex-col items-center">
                                            <div className="w-px h-8 bg-neutral-300"></div>
                                            <div className="p-3 border border-neutral-300 rounded-lg bg-white shadow-sm w-48 text-center">
                                              <Link href={`/employees/${manager.id}`}>
                                                <a className="font-medium text-neutral-800 hover:text-primary">{manager.name}</a>
                                              </Link>
                                              <p className="text-xs text-neutral-600">{manager.position}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="departments" className="mt-6">
              <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                  <Input 
                    type="text" 
                    placeholder="Search departments..." 
                    className="pl-10" 
                  />
                </div>
                <Link href="/departments/add">
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Department
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white border border-neutral-200 rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Parent Department</TableHead>
                      <TableHead className="text-right">Employees</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-neutral-500">
                            <Building className="h-10 w-10 mb-2" />
                            <span>No departments found</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      departments?.map((department: any) => (
                        <TableRow key={department.id}>
                          <TableCell className="font-medium">{department.name}</TableCell>
                          <TableCell>{department.description || "-"}</TableCell>
                          <TableCell>
                            {department.parentId ? departments.find((d: any) => d.id === department.parentId)?.name : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {employees?.filter((e: any) => {
                              const employeePosition = positions?.find((p: any) => p.id === e.positionId);
                              return employeePosition?.departmentId === department.id;
                            }).length || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="positions" className="mt-6">
              <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="flex flex-1 gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                    <Input 
                      type="text" 
                      placeholder="Search positions..." 
                      className="pl-10" 
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments?.map((department: any) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Link href="/positions/add">
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Position
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white border border-neutral-200 rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Pay Scale</TableHead>
                      <TableHead className="text-right">Employees</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-neutral-500">
                            <AlignCenter className="h-10 w-10 mb-2" />
                            <span>No positions found</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      positions?.map((position: any) => (
                        <TableRow key={position.id}>
                          <TableCell className="font-medium">{position.title}</TableCell>
                          <TableCell>
                            {departments?.find((d: any) => d.id === position.departmentId)?.name || "-"}
                          </TableCell>
                          <TableCell>
                            {position.payscaleMin && position.payscaleMax 
                              ? `$${position.payscaleMin.toLocaleString()} - $${position.payscaleMax.toLocaleString()}`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {employees?.filter((e: any) => e.positionId === position.id).length || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default OrganizationPage;
