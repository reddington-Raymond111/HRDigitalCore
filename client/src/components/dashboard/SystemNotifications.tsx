import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

type SystemNotification = {
  id: number;
  type: 'info' | 'success' | 'warning';
  message: string;
  timestamp: string;
};

const SystemNotifications = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 1,
      type: 'info',
      message: 'System maintenance scheduled for Oct 31, 10:00 PM - 12:00 AM.',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'success',
      message: 'October payroll processing completed successfully.',
      timestamp: 'Yesterday'
    },
    {
      id: 3,
      type: 'warning',
      message: '5 documents are pending your review.',
      timestamp: '2 days ago'
    }
  ]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'info':
        return (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Info className="h-4 w-4" />
          </div>
        );
      case 'success':
        return (
          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <CheckCircle className="h-4 w-4" />
          </div>
        );
      case 'warning':
        return (
          <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertTriangle className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Info className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">System Notifications</CardTitle>
        <Button variant="link" className="text-primary font-medium" onClick={clearNotifications}>
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="p-3">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-neutral-500">
            <Info className="h-10 w-10 mx-auto mb-2 text-neutral-400" />
            <p>No notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-3 hover:bg-neutral-50 rounded-md">
                <div className="flex items-start">
                  {getIconForType(notification.type)}
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-neutral-800">{notification.message}</p>
                    <p className="text-xs text-neutral-500 mt-1">{notification.timestamp}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemNotifications;
