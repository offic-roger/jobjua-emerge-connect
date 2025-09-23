import { 
  BarChart3, 
  Briefcase, 
  Users, 
  CreditCard, 
  UserCheck, 
  Sparkles,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AdminSection = 'dashboard' | 'jobs' | 'users' | 'payments' | 'agents' | 'content';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  userRole: 'admin' | 'agent';
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar = ({ 
  activeSection, 
  onSectionChange, 
  userRole, 
  collapsed,
  onToggleCollapse 
}: AdminSidebarProps) => {
  const menuItems = [
    {
      id: 'dashboard' as AdminSection,
      label: 'Dashboard',
      icon: BarChart3,
      accessible: ['admin', 'agent']
    },
    {
      id: 'jobs' as AdminSection,
      label: 'Job Management',
      icon: Briefcase,
      accessible: ['admin', 'agent']
    },
    {
      id: 'users' as AdminSection,
      label: 'User Management',
      icon: Users,
      accessible: ['admin']
    },
    {
      id: 'payments' as AdminSection,
      label: 'Payments & VIP',
      icon: CreditCard,
      accessible: ['admin']
    },
    {
      id: 'agents' as AdminSection,
      label: 'Agent Management',
      icon: UserCheck,
      accessible: ['admin']
    },
    {
      id: 'content' as AdminSection,
      label: 'VIP Content',
      icon: Sparkles,
      accessible: ['admin', 'agent']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.accessible.includes(userRole)
  );

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">JobJua Admin</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-smooth",
                  collapsed ? "px-3" : "px-4",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Role Badge */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className={cn(
            "px-3 py-2 rounded-lg text-sm font-medium text-center",
            userRole === 'admin' 
              ? "gradient-primary text-white" 
              : "bg-secondary text-secondary-foreground"
          )}>
            {userRole === 'admin' ? 'Administrator' : 'Agent'}
          </div>
        </div>
      )}
    </div>
  );
};