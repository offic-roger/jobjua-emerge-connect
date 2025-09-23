import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter,
  CreditCard,
  DollarSign,
  Crown,
  Check,
  X,
  Calendar,
  Smartphone,
  TrendingUp
} from 'lucide-react';

interface PaymentsSubscriptionsProps {
  userRole: 'admin' | 'agent';
}

interface VipSubscription {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  payment_method: string;
  payment_reference: string;
  status: string;
  starts_at: string;
  expires_at: string;
  created_at: string;
  profile?: {
    full_name: string;
    phone_number: string;
  };
}

export const PaymentsSubscriptions = ({ userRole }: PaymentsSubscriptionsProps) => {
  const [subscriptions, setSubscriptions] = useState<VipSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('vip_subscriptions')
        .select(`
          *,
          profiles!inner(full_name, phone_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (subscriptionId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'approved') {
        const subscription = subscriptions.find(s => s.id === subscriptionId);
        if (subscription) {
          updateData.starts_at = new Date().toISOString();
          // Set expiry to 1 month from now
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);
          updateData.expires_at = expiryDate.toISOString();
        }
      }

      const { error } = await supabase
        .from('vip_subscriptions')
        .update(updateData)
        .eq('id', subscriptionId);

      if (error) throw error;

      // Update local state
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, ...updateData }
          : sub
      ));

      // If approved, also update the user's profile
      if (newStatus === 'approved') {
        const subscription = subscriptions.find(s => s.id === subscriptionId);
        if (subscription) {
          await supabase
            .from('profiles')
            .update({ 
              is_vip: true,
              vip_expires_at: updateData.expires_at
            })
            .eq('user_id', subscription.user_id);
        }
      }

      toast({
        title: "Success",
        description: `Subscription ${newStatus} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      failed: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || statusColors.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      vodacom: <Smartphone className="w-4 h-4 text-red-600" />,
      tigo: <Smartphone className="w-4 h-4 text-blue-600" />,
      halotel: <Smartphone className="w-4 h-4 text-purple-600" />,
      airtel: <Smartphone className="w-4 h-4 text-red-500" />,
      mpesa: <Smartphone className="w-4 h-4 text-green-600" />
    };

    return icons[method as keyof typeof icons] || <CreditCard className="w-4 h-4" />;
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      (sub.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sub.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sub.plan_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || sub.payment_method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    totalRevenue: subscriptions
      .filter(s => s.status === 'approved')
      .reduce((sum, s) => sum + Number(s.amount), 0),
    pendingPayments: subscriptions.filter(s => s.status === 'pending').length,
    approvedSubscriptions: subscriptions.filter(s => s.status === 'approved').length,
    monthlyGrowth: 12.5 // Mock data
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
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

  if (userRole !== 'admin') {
    return (
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Admin Access Required</h3>
            <p className="text-muted-foreground">
              Payment and subscription management is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Payments & Subscriptions</h2>
        <p className="text-muted-foreground">
          Manage VIP subscriptions and payment confirmations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.monthlyGrowth}% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-foreground">{stats.pendingPayments}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active VIP</p>
                <p className="text-2xl font-bold text-foreground">{stats.approvedSubscriptions}</p>
                <p className="text-xs text-muted-foreground mt-1">Active subscriptions</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold text-foreground">{stats.monthlyGrowth}%</p>
                <p className="text-xs text-muted-foreground mt-1">Monthly growth</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, reference, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="vodacom">Vodacom</SelectItem>
                <SelectItem value="tigo">Tigo</SelectItem>
                <SelectItem value="halotel">Halotel</SelectItem>
                <SelectItem value="airtel">Airtel</SelectItem>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>VIP Subscriptions ({filteredSubscriptions.length})</CardTitle>
          <CardDescription>
            Review and manage VIP subscription payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan & Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {subscription.profile?.full_name || 'No name'}
                        </p>
                        {subscription.profile?.phone_number && (
                          <p className="text-sm text-muted-foreground">
                            {subscription.profile.phone_number}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{subscription.plan_name}</p>
                        <p className="text-lg font-bold text-green-600">
                          ${subscription.amount}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(subscription.payment_method)}
                        <div>
                          <p className="font-medium capitalize">
                            {subscription.payment_method}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subscription.payment_reference}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(subscription.status)}
                    </TableCell>

                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <br />
                          {new Date(subscription.created_at).toLocaleDateString()}
                        </div>
                        {subscription.expires_at && (
                          <div>
                            <span className="text-muted-foreground">Expires:</span>
                            <br />
                            {new Date(subscription.expires_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {subscription.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleStatusUpdate(subscription.id, 'approved')}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(subscription.id, 'rejected')}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {subscription.status !== 'pending' && (
                        <div className="text-sm text-muted-foreground">
                          {subscription.status === 'approved' ? 'Processed' : 'No actions'}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No subscriptions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || methodFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No VIP subscriptions have been created yet'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};