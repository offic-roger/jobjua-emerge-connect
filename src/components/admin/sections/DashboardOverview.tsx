import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { 
  Briefcase, 
  Users, 
  Crown, 
  TrendingUp, 
  DollarSign,
  UserCheck,
  Bell,
  Activity
} from 'lucide-react';

interface DashboardOverviewProps {
  userRole: 'admin' | 'agent';
}

interface DashboardStats {
  totalJobs: number;
  activeVipUsers: number;
  monthlyRevenue: number;
  agentActivity: number;
}

export const DashboardOverview = ({ userRole }: DashboardOverviewProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [jobsResult, vipResult, revenueResult, agentResult] = await Promise.all([
        supabase.from('jobs').select('id').eq('status', 'approved'),
        supabase.from('profiles').select('id').eq('is_vip', true),
        supabase.from('vip_subscriptions').select('amount').eq('status', 'approved'),
        supabase.from('user_roles').select('id').eq('role', 'agent')
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, sub) => sum + Number(sub.amount), 0) || 0;

      setStats({
        totalJobs: jobsResult.data?.length || 0,
        activeVipUsers: vipResult.data?.length || 0,
        monthlyRevenue: totalRevenue,
        agentActivity: agentResult.data?.length || 0
      });

      // Fetch recent notifications
      const { data: notificationData } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setNotifications(notificationData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      description: 'Active job postings',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'VIP Users',
      value: stats?.activeVipUsers || 0,
      icon: Crown,
      description: 'Active VIP subscribers',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      description: 'This month\'s earnings',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Agent Activity',
      value: stats?.agentActivity || 0,
      icon: UserCheck,
      description: 'Active agents',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with JobJua.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with JobJua.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="shadow-card transition-smooth hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {card.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.description}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gradient-primary hover:opacity-90">
              <Briefcase className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Review Applications
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Crown className="w-4 h-4 mr-2" />
              Manage VIP Subscriptions
            </Button>
            {userRole === 'admin' && (
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="w-4 h-4 mr-2" />
                Agent Management
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <span>Recent Notifications</span>
              <Badge variant="secondary" className="ml-auto">
                {notifications.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Latest system updates and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'error' ? 'bg-destructive' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'success' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>VIP Subscriptions</CardTitle>
            <CardDescription>Monthly subscription revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};