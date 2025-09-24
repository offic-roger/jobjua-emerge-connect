import { 
  BarChart3, 
  Briefcase, 
  Users, 
  CreditCard, 
  UserCheck, 
  Sparkles,
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AdminSection = 'dashboard' | 'jobs' | 'users' | 'payments' | 'agents' | 'content';

interface AppSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  userRole: 'admin' | 'agent';
}

export const AppSidebar = ({ 
  activeSection, 
  onSectionChange, 
  userRole 
}: AppSidebarProps) => {
  const { state } = useSidebar();
  const { toast } = useToast();

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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-sm">JobJua Admin</span>
              <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={isActive}
                      className="transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};