import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users, 
  LayoutGrid, 
  FileText, 
  DollarSign, 
  Shield, 
  Briefcase, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive: boolean;
};

const SidebarItem = ({ icon, title, href, isActive }: SidebarItemProps) => {
  return (
    <li>
      <Link href={href}>
        <a
          className={cn(
            "flex items-center px-4 py-2 text-neutral-700 hover:text-primary hover:bg-primary-100/10 rounded-md group transition-colors",
            isActive && "text-primary bg-primary/10 font-medium border-l-3 border-primary"
          )}
        >
          <span className="h-5 w-5 mr-3">{icon}</span>
          {title}
        </a>
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-md hidden md:flex flex-col h-screen">
      {/* Logo & Brand */}
      <div className="h-16 flex items-center px-4 border-b border-neutral-200">
        <div className="text-primary font-semibold text-xl">HR System</div>
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
            JD
          </div>
          <div className="ml-3">
            <div className="font-medium">John Doe</div>
            <div className="text-sm text-neutral-600">HR Manager</div>
          </div>
        </div>
      </div>
      
      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1">
          <SidebarItem 
            icon={<Home size={20} />} 
            title="Dashboard" 
            href="/" 
            isActive={location === '/'} 
          />
          
          <SidebarItem 
            icon={<Users size={20} />} 
            title="Employees" 
            href="/employees" 
            isActive={location.startsWith('/employees')} 
          />
          
          <SidebarItem 
            icon={<LayoutGrid size={20} />} 
            title="Organization" 
            href="/organization" 
            isActive={location.startsWith('/organization')} 
          />
          
          <SidebarItem 
            icon={<FileText size={20} />} 
            title="Contracts" 
            href="/contracts" 
            isActive={location.startsWith('/contracts')} 
          />
          
          <SidebarItem 
            icon={<DollarSign size={20} />} 
            title="Compensation" 
            href="/compensation" 
            isActive={location.startsWith('/compensation')} 
          />
          
          <SidebarItem 
            icon={<Shield size={20} />} 
            title="Benefits" 
            href="/benefits" 
            isActive={location.startsWith('/benefits')} 
          />
          
          <SidebarItem 
            icon={<Briefcase size={20} />} 
            title="Workflows" 
            href="/workflows" 
            isActive={location.startsWith('/workflows')} 
          />
          
          <SidebarItem 
            icon={<Settings size={20} />} 
            title="Settings" 
            href="/settings" 
            isActive={location.startsWith('/settings')} 
          />
        </ul>
      </nav>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-neutral-200">
        <a href="#" className="text-neutral-600 hover:text-primary text-sm flex items-center">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
