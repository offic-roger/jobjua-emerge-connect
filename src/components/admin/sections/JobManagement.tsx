import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  MapPin,
  DollarSign
} from 'lucide-react';

interface JobManagementProps {
  userRole: 'admin' | 'agent';
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  category: string;
  status: string;
  company_name: string;
  view_count: number;
  application_count: number;
  created_at: string;
}

export const JobManagement = ({ userRole }: JobManagementProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    description: '',
    location: '',
    category: 'normal' as 'normal' | 'vip' | 'quick_gig' | 'verified',
    salary_min: '',
    salary_max: '',
    contact_email: '',
    contact_phone: '',
    requirements: '',
    benefits: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const jobData = {
        title: formData.title,
        company_name: formData.company_name,
        description: formData.description,
        location: formData.location,
        category: formData.category as 'normal' | 'vip' | 'quick_gig' | 'verified',
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        requirements: formData.requirements ? formData.requirements.split(',').map(r => r.trim()).filter(r => r) : [],
        benefits: formData.benefits ? formData.benefits.split(',').map(b => b.trim()).filter(b => b) : [],
        posted_by: user?.id,
        status: (userRole === 'admin' ? 'approved' : 'pending') as 'draft' | 'pending' | 'approved' | 'rejected' | 'expired'
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single();

      if (error) throw error;

      setJobs([data, ...jobs]);
      setShowCreateDialog(false);
      setFormData({
        title: '',
        company_name: '',
        description: '',
        location: '',
        category: 'normal' as 'normal' | 'vip' | 'quick_gig' | 'verified',
        salary_min: '',
        salary_max: '',
        contact_email: '',
        contact_phone: '',
        requirements: '',
        benefits: ''
      });

      toast({
        title: "Success",
        description: "Job created successfully!",
      });
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleStatusUpdate = async (jobId: string, newStatus: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired') => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;

      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));

      toast({
        title: "Success",
        description: `Job ${newStatus} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-600'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || statusColors.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      normal: 'bg-blue-100 text-blue-800',
      vip: 'bg-purple-100 text-purple-800',
      quick_gig: 'gradient-secondary text-white',
      verified: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={categoryColors[category as keyof typeof categoryColors] || categoryColors.normal}>
        {category.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        {/* Mobile-optimized header skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-full sm:w-32 bg-muted rounded animate-pulse" />
        </div>
        
        {/* Mobile-optimized filter skeleton */}
        <div className="bg-card rounded-lg border p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full sm:w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full sm:w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Mobile-optimized table skeleton */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/20 rounded">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Job Management</h2>
          <p className="text-muted-foreground">
            Manage job postings, approvals, and categories
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new job posting
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="Software Developer"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input 
                    id="company" 
                    placeholder="Tech Corp"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Job description..."
                  className="min-h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input 
                    id="location" 
                    placeholder="Nairobi, Kenya"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value: 'normal' | 'vip' | 'quick_gig' | 'verified') => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Job</SelectItem>
                      <SelectItem value="vip">VIP Job</SelectItem>
                      <SelectItem value="quick_gig">Quick Gig</SelectItem>
                      <SelectItem value="verified">Verified Job</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary_min">Min Salary (KSh)</Label>
                  <Input 
                    id="salary_min" 
                    type="number" 
                    placeholder="50000"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({...formData, salary_min: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_max">Max Salary (KSh)</Label>
                  <Input 
                    id="salary_max" 
                    type="number" 
                    placeholder="80000"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input 
                    id="contact_email" 
                    type="email" 
                    placeholder="hr@company.com"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input 
                    id="contact_phone" 
                    placeholder="+254700000000"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (comma separated)</Label>
                <Input 
                  id="requirements" 
                  placeholder="React, Node.js, TypeScript"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (comma separated)</Label>
                <Input 
                  id="benefits" 
                  placeholder="Health insurance, Remote work, Flexible hours"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  className="gradient-primary" 
                  onClick={handleCreateJob}
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Job'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="normal">Normal Jobs</SelectItem>
                <SelectItem value="vip">VIP Jobs</SelectItem>
                <SelectItem value="quick_gig">Quick Gigs</SelectItem>
                <SelectItem value="verified">Verified Jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Jobs ({filteredJobs.length})</CardTitle>
          <CardDescription>
            Manage and review all job postings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Details</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{job.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{job.company_name || 'N/A'}</p>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(job.category)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(job.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {job.view_count} views
                        </div>
                        <div className="text-muted-foreground">
                          {job.application_count} applications
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {job.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusUpdate(job.id, 'approved')}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(job.id, 'rejected')}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        
                        {userRole === 'admin' && (
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 text-muted-foreground mx-auto mb-4 flex items-center justify-center">
                📋
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by creating your first job posting'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};