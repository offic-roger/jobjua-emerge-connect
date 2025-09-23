import { useState } from 'react';
import { 
  User, 
  Edit3, 
  Bookmark, 
  FileText, 
  Settings, 
  Crown, 
  Moon, 
  Sun, 
  Globe, 
  Bell,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield
} from 'lucide-react';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { SavedJobsScreen } from '@/components/SavedJobsScreen';
import { ApplicationsScreen } from '@/components/ApplicationsScreen';
import { MobileLayout } from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export const ProfileScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const { toast } = useToast();

  // Mock user data
  const [user, setUser] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    jobTitle: 'Frontend Developer',
    company: 'TechCorp Ltd',
    isVIP: false,
    profileCompletion: 85,
    joinedDate: 'March 2024',
    savedJobs: 12,
    appliedJobs: 8,
    bio: 'Passionate frontend developer with 3+ years of experience in React and TypeScript.',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'Git'],
  });

  const handleVIPUpgrade = () => {
    toast({
      title: "VIP Upgrade",
      description: "Redirecting to subscription page...",
    });
  };

  const handleAdminAccess = () => {
    // Navigate to admin panel
    window.location.href = '/admin';
  };

  const handleSettingToggle = (setting: string, value: boolean) => {
    if (setting === 'darkMode') {
      setIsDarkMode(value);
    } else if (setting === 'notifications') {
      setNotifications(value);
    }
    
    toast({
      title: "Settings Updated",
      description: `${setting} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const headerContent = (
    <div className="text-center">
      <h1 className="text-xl font-bold">Profile</h1>
      <p className="text-primary-foreground/80 text-sm">Manage your account</p>
    </div>
  );

  return (
    <MobileLayout headerContent={headerContent} className="p-4">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/api/placeholder/64/64" />
              <AvatarFallback className="text-lg font-semibold gradient-primary text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold">{user.name}</h2>
                {user.isVIP && (
                  <Crown className="w-5 h-5 text-secondary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{user.jobTitle}</p>
              <p className="text-xs text-muted-foreground">{user.location}</p>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setShowEditProfile(true)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Profile Completion */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-muted-foreground">{user.profileCompletion}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${user.profileCompletion}%` }}
              />
            </div>
          </div>

          {/* VIP Status */}
          {!user.isVIP && (
            <div className="gradient-primary rounded-lg p-4 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Upgrade to VIP</h3>
                  <p className="text-xs text-primary-foreground/80">
                    Get access to premium jobs
                  </p>
                </div>
                <Button 
                  onClick={handleVIPUpgrade}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  size="sm"
                >
                  Upgrade
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center shadow-card">
            <div className="text-2xl font-bold text-primary mb-1">
              {user.savedJobs}
            </div>
            <div className="text-sm text-muted-foreground">Saved Jobs</div>
          </Card>
          
          <Card className="p-4 text-center shadow-card">
            <div className="text-2xl font-bold text-secondary mb-1">
              {user.appliedJobs}
            </div>
            <div className="text-sm text-muted-foreground">Applications</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12"
              onClick={() => setShowSavedJobs(true)}
            >
              <Bookmark className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">Saved Jobs</span>
              <span className="text-sm text-muted-foreground">{user.savedJobs}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12"
              onClick={() => setShowApplications(true)}
            >
              <FileText className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">My Applications</span>
              <span className="text-sm text-muted-foreground">{user.appliedJobs}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12"
              onClick={() => setShowEditProfile(true)}
            >
              <User className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">Edit Profile</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-3">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>Push Notifications</span>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => handleSettingToggle('notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
                <span>Dark Mode</span>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={(checked) => handleSettingToggle('darkMode', checked)}
              />
            </div>
            
            <Button variant="ghost" className="w-full justify-start h-12 px-0">
              <Globe className="w-5 h-5 mr-3 text-muted-foreground" />
              <span className="flex-1 text-left">Language</span>
              <span className="text-sm text-muted-foreground">{language}</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start h-12 px-0">
              <MessageSquare className="w-5 h-5 mr-3 text-muted-foreground" />
              <span className="flex-1 text-left">WhatsApp Integration</span>
            </Button>
          </div>
        </Card>

        {/* Support */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-3">Support</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start h-12">
              <HelpCircle className="w-5 h-5 mr-3 text-muted-foreground" />
              <span>Help & FAQ</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start h-12">
              <MessageSquare className="w-5 h-5 mr-3 text-muted-foreground" />
              <span>Contact Support</span>
            </Button>
          </div>
        </Card>

        {/* Admin Access */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-3">Administration</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12"
              onClick={handleAdminAccess}
            >
              <Shield className="w-5 h-5 mr-3 text-muted-foreground" />
              <span className="flex-1 text-left">Admin Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>

        {/* Modals and Screens */}
        <ProfileEditModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          user={user}
          onSave={(updatedUser) => setUser(updatedUser)}
        />
        
        {/* Conditional Screen Rendering */}
        {showSavedJobs && (
          <div className="fixed inset-0 bg-background z-50">
            <SavedJobsScreen />
            <Button
              className="absolute top-4 right-4 z-10"
              variant="outline"
              size="sm"
              onClick={() => setShowSavedJobs(false)}
            >
              Back
            </Button>
          </div>
        )}
        
        {showApplications && (
          <div className="fixed inset-0 bg-background z-50">
            <ApplicationsScreen />
            <Button
              className="absolute top-4 right-4 z-10"
              variant="outline"
              size="sm"
              onClick={() => setShowApplications(false)}
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};