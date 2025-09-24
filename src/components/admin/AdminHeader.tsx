import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bell, 
  Moon, 
  Sun, 
  User as UserIcon 
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface AdminHeaderProps {
  user: User;
  userRole: 'admin' | 'agent';
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const AdminHeader = ({ 
  user, 
  userRole
}: AdminHeaderProps) => {
  const [notificationCount] = useState(3);
  const { theme, setTheme } = useTheme();

  const getUserInitials = () => {
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-3">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="h-8 w-8 p-0"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
        <Bell className="w-4 h-4" />
        {notificationCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs p-0 animate-pulse"
          >
            {notificationCount}
          </Badge>
        )}
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="gradient-primary text-white text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none truncate">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userRole === 'admin' ? 'Administrator' : 'Agent'}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="md:hidden" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark mode</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};