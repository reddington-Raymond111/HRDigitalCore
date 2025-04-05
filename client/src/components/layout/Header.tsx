import { useState } from "react";
import { Menu, Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  toggleSidebar: () => void;
};

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [notifications] = useState(3);

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 md:px-6">
      {/* Mobile Menu Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden" 
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6 text-neutral-700" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-lg ml-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
          <Input 
            type="text" 
            placeholder="Search employees, documents..." 
            className="pl-10 pr-4 py-2 w-full" 
          />
        </div>
      </div>
      
      {/* Header Actions */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6 text-neutral-700" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
        
        {/* Help */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-6 w-6 text-neutral-700" />
          <span className="sr-only">Help</span>
        </Button>
        
        {/* User Menu (Mobile) */}
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 rounded-full bg-primary text-white p-0">
          JD
        </Button>
      </div>
    </header>
  );
};

export default Header;
