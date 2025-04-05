import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, FileText, Network, Download } from "lucide-react";
import { Link } from "wouter";

const QuickActions = () => {
  const actions = [
    {
      title: "Add Employee",
      icon: <UserPlus className="h-6 w-6 text-primary" />,
      href: "/employees/add"
    },
    {
      title: "Create Contract",
      icon: <FileText className="h-6 w-6 text-primary" />,
      href: "/contracts/create"
    },
    {
      title: "Org Chart",
      icon: <Network className="h-6 w-6 text-primary" />,
      href: "/organization"
    },
    {
      title: "Export Data",
      icon: <Download className="h-6 w-6 text-primary" />,
      href: "/export"
    }
  ];

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <button className="p-3 border border-neutral-200 rounded-md flex flex-col items-center justify-center hover:bg-neutral-50 hover:border-primary transition-colors w-full">
                {action.icon}
                <span className="text-xs font-medium mt-2 text-neutral-700">{action.title}</span>
              </button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
