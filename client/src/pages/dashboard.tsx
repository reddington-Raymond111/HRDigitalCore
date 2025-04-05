import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Users, 
  UserPlus, 
  Clock, 
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import OrgChart from "@/components/dashboard/OrgChart";
import EmployeeTable from "@/components/dashboard/EmployeeTable";
import PendingApprovals from "@/components/dashboard/PendingApprovals";
import ContractRenewals from "@/components/dashboard/ContractRenewals";
import QuickActions from "@/components/dashboard/QuickActions";
import SystemNotifications from "@/components/dashboard/SystemNotifications";

const Dashboard = () => {
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });

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
              <Link href="/">
                <a className="text-primary">Dashboard</a>
              </Link>
            </li>
          </ol>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-neutral-800">HR Dashboard</h1>
          
          <div className="mt-2 md:mt-0 flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <FileText className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Button className="flex items-center">
              <UserPlus className="h-4 w-4 mr-1.5" />
              Add Employee
            </Button>
          </div>
        </div>
      </div>
      
      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard 
          title="Total Employees" 
          value={isSummaryLoading ? "..." : summary?.totalEmployees || 0} 
          icon={<Users className="h-6 w-6" />}
          trend={!isSummaryLoading && summary ? { value: "+3.2% from last month", isPositive: true } : undefined}
        />
        
        <DashboardCard 
          title="New Hires (30 days)" 
          value={isSummaryLoading ? "..." : summary?.newHires || 0} 
          icon={<UserPlus className="h-6 w-6" />}
          iconBgColor="bg-accent/10"
          iconColor="text-accent"
          trend={!isSummaryLoading && summary ? { value: "+50% from last month", isPositive: true } : undefined}
        />
        
        <DashboardCard 
          title="Pending Approvals" 
          value={isSummaryLoading ? "..." : summary?.pendingApprovals || 0} 
          icon={<Clock className="h-6 w-6" />}
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-500"
          trend={!isSummaryLoading && summary ? { value: "+2 from yesterday", isPositive: false } : undefined}
        />
        
        <DashboardCard 
          title="Contract Renewals" 
          value={isSummaryLoading ? "..." : summary?.contractRenewals || 0} 
          icon={<FileText className="h-6 w-6" />}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-500"
          trend={!isSummaryLoading && summary ? { value: "Due in next 30 days", isPositive: true } : undefined}
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <OrgChart />
          <EmployeeTable />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <PendingApprovals />
          <ContractRenewals />
          <QuickActions />
          <SystemNotifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
