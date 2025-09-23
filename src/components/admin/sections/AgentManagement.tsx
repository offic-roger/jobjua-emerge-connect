import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search,
  UserCheck,
  MapPin,
  BarChart3,
  Calendar,
  Activity,
  Users,
  Shield,
  Briefcase
} from 'lucide-react';

interface AgentManagementProps {
  userRole: 'admin' | 'agent';
}

interface Agent {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone_number: string;
  assigned_at: string;
  regions: string[];
  job_count: number;
  verified_jobs: number;
}

export const AgentManagement = ({ userRole }: AgentManagementProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const { toast } = useToast();

  const regions = [
    'Dodoma', 'Arusha', 'Kilimanjaro', 'Tanga', 'Morogoro', 
    'Pwani', 'Dar es Salaam', 'Lindi', 'Mtwara', 'Ruvuma',
    'Iringa', 'Mbeya', 'Singida', 'Tabora', 'Rukwa',
    'Kigoma', 'Shinyanga', 'Kagera', 'Mwanza', 'Mara',
    'Simiyu', 'Geita', 'Katavi', 'Njombe', 'Songwe'
  ];

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      // Get users with agent role and their profiles
      const { data: agentRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, assigned_at')
        .eq('role', 'agent');

      if (rolesError) throw rolesError;

      if (!agentRoles || agentRoles.length === 0) {
        setAgents([]);
        return;
      }

      // Get profiles for agent users
      const agentUserIds = agentRoles.map(role => role.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, phone_number')
        .in('user_id', agentUserIds);

      if (profilesError) throw profilesError;

      // Get auth users
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Auth error:', authError);
      }

      // Get agent regions
      const { data: regionsData, error: regionsError } = await supabase
        .from('agent_regions')
        .select('agent_id, region_name');

      if (regionsError) throw regionsError;

      // Combine data
      const combinedAgents = agentRoles.map(role => {
        const profile = profilesData?.find(p => p.user_id === role.user_id);
        const authUser = authUsers?.find((u: any) => u.id === role.user_id);
        const agentRegions = regionsData?.filter(r => r.agent_id === role.user_id).map(r => r.region_name) || [];
        
        return {
          id: role.user_id,
          user_id: role.user_id,
          email: authUser?.email || '',
          full_name: profile?.full_name || 'No name',
          phone_number: profile?.phone_number || '',
          assigned_at: role.assigned_at,
          regions: agentRegions,
          job_count: Math.floor(Math.random() * 50), // Mock data
          verified_jobs: Math.floor(Math.random() * 30) // Mock data
        };
      });

      setAgents(combinedAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = async () => {
    if (!newAgentEmail || !selectedRegion) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // First, invite the user (this would typically be done through auth admin)
      // For now, we'll assume the user exists and just add the role
      
      // Get user by email
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      const user = users?.find((u: any) => u.email === newAgentEmail);
      if (!user) {
        toast({
          title: "Error",
          description: "User not found. Please ensure the user has an account.",
          variant: "destructive"
        });
        return;
      }

      // Add agent role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'agent',
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (roleError) throw roleError;

      // Assign region
      const { error: regionError } = await supabase
        .from('agent_regions')
        .insert({
          agent_id: user.id,
          region_name: selectedRegion,
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (regionError) throw regionError;

      toast({
        title: "Success",
        description: "Agent added successfully"
      });
      
      setShowAddDialog(false);
      setNewAgentEmail('');
      setSelectedRegion('');
      fetchAgents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add agent",
        variant: "destructive"
      });
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.regions.some(region => region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    totalAgents: agents.length,
    totalJobsManaged: agents.reduce((sum, agent) => sum + agent.job_count, 0),
    totalVerifications: agents.reduce((sum, agent) => sum + agent.verified_jobs, 0),
    averagePerformance: agents.length > 0 ? Math.round(agents.reduce((sum, agent) => sum + agent.verified_jobs, 0) / agents.length) : 0
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
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
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Admin Access Required</h3>
            <p className="text-muted-foreground">
              Agent management is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agent Management</h2>
          <p className="text-muted-foreground">
            Manage agents, assign regions, and track performance
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
              <DialogDescription>
                Assign a user as an agent for a specific region
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAgentEmail}
                  onChange={(e) => setNewAgentEmail(e.target.value)}
                  placeholder="agent@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Assign Region</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAgent} className="gradient-primary">
                  Add Agent
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalAgents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jobs Managed</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalJobsManaged}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verifications</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalVerifications}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold text-foreground">{stats.averagePerformance}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search agents by name, email, or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Agents ({filteredAgents.length})</CardTitle>
          <CardDescription>
            Manage agent assignments and track performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Assigned Regions</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="gradient-primary text-white text-sm">
                            {agent.full_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{agent.full_name}</p>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Agent
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{agent.email}</p>
                        {agent.phone_number && (
                          <p className="text-sm text-muted-foreground">{agent.phone_number}</p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {agent.regions.map(region => (
                          <Badge key={region} variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {region}
                          </Badge>
                        ))}
                        {agent.regions.length === 0 && (
                          <span className="text-sm text-muted-foreground">No regions assigned</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Briefcase className="w-3 h-3 mr-1 text-muted-foreground" />
                          {agent.job_count} jobs managed
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                          <Shield className="w-3 h-3 mr-1" />
                          {agent.verified_jobs} verified
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(agent.assigned_at).toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          Edit Regions
                        </Button>
                        <Button size="sm" variant="outline">
                          View Reports
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No agents found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start by adding your first agent'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};