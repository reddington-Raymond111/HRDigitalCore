import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
  Shield,
  User,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Employee } from "@/lib/types";

const ViewEmployee = () => {
  const { toast } = useToast();
  const [, params] = useRoute("/employees/:id");
  const employeeId = params?.id ? parseInt(params.id) : 0;

  const { data: employee, isLoading, error } = useQuery<Employee>({
    queryKey: [`/api/employees/${employeeId}`],
    enabled: !!employeeId,
  });

  const { data: position } = useQuery({
    queryKey: [`/api/positions/${employee?.positionId}`],
    enabled: !!employee?.positionId,
  });

  const { data: manager } = useQuery({
    queryKey: [`/api/employees/${employee?.managerId}`],
    enabled: !!employee?.managerId,
  });

  const { data: contracts } = useQuery({
    queryKey: ["/api/contracts", { employeeId: employeeId }],
    enabled: !!employeeId,
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load employee data",
      variant: "destructive",
    });
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "??";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
          <p className="text-neutral-600">Loading employee information...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <User className="h-16 w-16 text-neutral-300 mb-4" />
        <h2 className="text-xl font-medium text-neutral-800 mb-2">Employee Not Found</h2>
        <p className="text-neutral-600 mb-4">The employee you're looking for doesn't exist or was removed.</p>
        <Link href="/employees">
          <Button>Go Back to Employees</Button>
        </Link>
      </div>
    );
  }

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
                <a className="hover:text-primary">Employees</a>
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <span>/</span>
              <span className="text-primary">{employee.firstName} {employee.lastName}</span>
            </li>
          </ol>
        </nav>
        
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-neutral-800">Employee Profile</h1>
          
          <div className="flex space-x-2">
            <Link href="/employees">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
            </Link>
            <Link href={`/employees/${employeeId}/edit`}>
              <Button className="flex items-center">
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Employee Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarFallback className="text-2xl bg-primary text-white">
                {getInitials(employee.firstName, employee.lastName)}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-semibold text-center">
              {employee.firstName} {employee.lastName}
            </h2>
            
            <p className="text-neutral-600 text-center mb-3">
              {position?.title || "No Position Assigned"}
            </p>
            
            <Badge className={`${getStatusColor(employee.status)} mb-4`} variant="outline">
              {employee.status || "Unknown"}
            </Badge>
            
            <Separator className="mb-4" />
            
            <div className="w-full space-y-3">
              {employee.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-neutral-500 mr-2" />
                  <a href={`mailto:${employee.email}`} className="text-sm text-neutral-700 hover:text-primary">
                    {employee.email}
                  </a>
                </div>
              )}
              
              {employee.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-neutral-500 mr-2" />
                  <a href={`tel:${employee.phone}`} className="text-sm text-neutral-700 hover:text-primary">
                    {employee.phone}
                  </a>
                </div>
              )}
              
              {employee.address && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-neutral-500 mr-2 mt-0.5" />
                  <span className="text-sm text-neutral-700">{employee.address}</span>
                </div>
              )}
              
              {employee.hireDate && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-neutral-500 mr-2" />
                  <span className="text-sm text-neutral-700">
                    Hired: {format(new Date(employee.hireDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
              
              {manager && (
                <div className="flex items-center">
                  <User className="h-4 w-4 text-neutral-500 mr-2" />
                  <Link href={`/employees/${manager.id}`}>
                    <a className="text-sm text-neutral-700 hover:text-primary">
                      Manager: {manager.firstName} {manager.lastName}
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="info" className="flex items-center justify-center">
                <User className="h-4 w-4 mr-1.5" />
                Information
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center justify-center">
                <FileText className="h-4 w-4 mr-1.5" />
                Contracts
              </TabsTrigger>
              <TabsTrigger value="compensation" className="flex items-center justify-center">
                <DollarSign className="h-4 w-4 mr-1.5" />
                Compensation
              </TabsTrigger>
              <TabsTrigger value="benefits" className="flex items-center justify-center">
                <Shield className="h-4 w-4 mr-1.5" />
                Benefits
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Full Name</h4>
                      <p>{employee.firstName} {employee.lastName}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Email</h4>
                      <p>{employee.email}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Phone</h4>
                      <p>{employee.phone || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Date of Birth</h4>
                      <p>{employee.dateOfBirth ? format(new Date(employee.dateOfBirth), 'MMMM dd, yyyy') : "Not provided"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Address</h4>
                      <p>{employee.address || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Emergency Contact</h4>
                      <p>{employee.emergencyContact || "Not provided"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Employment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Position</h4>
                      <p>{position?.title || "Not assigned"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Department</h4>
                      <p>{position?.departmentId || "Not assigned"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Manager</h4>
                      <p>{manager ? `${manager.firstName} ${manager.lastName}` : "Not assigned"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Hire Date</h4>
                      <p>{employee.hireDate ? format(new Date(employee.hireDate), 'MMMM dd, yyyy') : "Not provided"}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Status</h4>
                      <Badge className={getStatusColor(employee.status)} variant="outline">
                        {employee.status || "Unknown"}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Employee ID</h4>
                      <p>{employee.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contracts">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Contracts</CardTitle>
                  <CardDescription>
                    View and manage employment contracts for {employee.firstName} {employee.lastName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!contracts || contracts.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-neutral-700 mb-1">No Contracts Found</h3>
                      <p className="text-neutral-500 mb-4">This employee doesn't have any contracts yet.</p>
                      <Button>
                        Add New Contract
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contracts.map((contract: any) => (
                        <Card key={contract.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  {contract.contractType}
                                </Badge>
                                <h3 className="font-medium">Contract #{contract.id}</h3>
                                <p className="text-sm text-neutral-600">
                                  {format(new Date(contract.startDate), 'MMM dd, yyyy')} - 
                                  {contract.endDate ? format(new Date(contract.endDate), ' MMM dd, yyyy') : ' Present'}
                                </p>
                                <p className="text-sm font-medium mt-2">
                                  ${contract.salary?.toLocaleString()} {contract.currency || 'USD'} per year
                                </p>
                              </div>
                              <Badge variant={contract.status === 'active' ? 'default' : 'outline'}>
                                {contract.status}
                              </Badge>
                            </div>
                            {contract.renewalDate && (
                              <div className="mt-3 text-sm">
                                <span className="text-amber-600 font-medium">
                                  Renewal due: {format(new Date(contract.renewalDate), 'MMM dd, yyyy')}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-end mt-3">
                              <Button size="sm" variant="outline" className="mr-2">View</Button>
                              <Button size="sm">Renew</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compensation">
              <Card>
                <CardHeader>
                  <CardTitle>Compensation History</CardTitle>
                  <CardDescription>
                    View salary history and compensation details for {employee.firstName} {employee.lastName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-neutral-700 mb-1">No Compensation Records</h3>
                    <p className="text-neutral-500 mb-4">This employee doesn't have any compensation records yet.</p>
                    <Button>
                      Add Compensation Record
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="benefits">
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Insurance</CardTitle>
                  <CardDescription>
                    View benefits and insurance records for {employee.firstName} {employee.lastName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-neutral-700 mb-1">No Benefits Records</h3>
                    <p className="text-neutral-500 mb-4">This employee doesn't have any benefits assigned yet.</p>
                    <Button>
                      Add Benefits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Direct Reports Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Direct Reports
          </CardTitle>
          <CardDescription>
            Employees reporting to {employee.firstName} {employee.lastName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-700 mb-1">No Direct Reports</h3>
            <p className="text-neutral-500">This employee doesn't have any direct reports yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewEmployee;
