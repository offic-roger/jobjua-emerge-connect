import { useState } from 'react';
import { 
  Bell, 
  Briefcase, 
  MessageSquare, 
  Crown, 
  Check, 
  X, 
  Settings, 
  Filter 
} from 'lucide-react';
import { MobileLayout } from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'job-match' | 'application' | 'message' | 'vip' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionRequired?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'job-match',
    title: 'New Job Match',
    message: 'Frontend Developer position at TechStart matches your profile',
    time: '5 min ago',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '2',
    type: 'vip',
    title: 'VIP Room Unlocked',
    message: '23 new exclusive jobs available in Quick Gig Room',
    time: '1 hour ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'application',
    title: 'Application Update',
    message: 'Your application to Digital Marketing Manager has been reviewed',
    time: '3 hours ago',
    isRead: true,
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'TechCorp Ltd sent you a message about your application',
    time: '1 day ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Completion',
    message: 'Complete your profile to get better job matches (85% done)',
    time: '2 days ago',
    isRead: false,
  },
];

export const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'job-match':
        return <Briefcase className="w-5 h-5 text-primary" />;
      case 'application':
        return <Check className="w-5 h-5 text-secondary" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'vip':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been cleared",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted",
      description: "Notification has been removed from your list",
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const headerContent = (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-xl font-bold">Notifications</h1>
        <p className="text-primary-foreground/80 text-sm">
          {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up!'}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <MobileLayout headerContent={headerContent} className="p-4">
      <div className="space-y-4">
        {/* Notification Settings */}
        {showSettings && (
          <Card className="p-4 shadow-card animate-fade-in">
            <h3 className="font-semibold mb-3">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Push Notifications</span>
                <Switch
                  checked={pushEnabled}
                  onCheckedChange={setPushEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Notifications</span>
                <Switch
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        {unreadCount > 0 && (
          <Card className="p-3 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {unreadCount} unread notifications
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
                className="h-8 text-xs"
              >
                Mark all read
              </Button>
            </div>
          </Card>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="p-8 text-center shadow-card">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! We'll notify you when something new happens.
              </p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 shadow-card cursor-pointer transition-smooth ${
                  !notification.isRead 
                    ? 'border-l-4 border-l-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-medium text-sm ${
                        !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                      
                      {notification.actionRequired && !notification.isRead && (
                        <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Empty State Actions */}
        {notifications.length === 0 && (
          <Card className="p-4 shadow-card">
            <h4 className="font-medium mb-2">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Enable notifications to never miss important updates about jobs and applications.
            </p>
            <Button className="w-full" size="sm">
              Enable Notifications
            </Button>
          </Card>
        )}
      </div>
    </MobileLayout>
  );
};