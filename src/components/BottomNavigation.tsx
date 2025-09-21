import { Home, Star, Gift, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: 'home' | 'vip' | 'perks' | 'profile' | 'notifications';
  onTabChange: (tab: 'home' | 'vip' | 'perks' | 'profile' | 'notifications') => void;
  notificationCount?: number;
}

export const BottomNavigation = ({
  activeTab,
  onTabChange,
  notificationCount = 0
}: BottomNavigationProps) => {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'vip' as const, icon: Star, label: 'VIP' },
    { id: 'perks' as const, icon: Gift, label: 'Perks' },
    { id: 'notifications' as const, icon: Bell, label: 'Alerts' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-mobile w-full bg-card border-t border-border shadow-elevated">
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-smooth touch-feedback",
                "relative min-w-0 flex-1",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "w-5 h-5 mb-1",
                  isActive && "animate-bounce-in"
                )} />
                
                {tab.id === 'notifications' && notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full min-w-5 h-5 flex items-center justify-center animate-bounce-in">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </div>
              
              <span className={cn(
                "text-xs font-medium truncate",
                isActive && "text-primary"
              )}>
                {tab.label}
              </span>
              
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 gradient-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};