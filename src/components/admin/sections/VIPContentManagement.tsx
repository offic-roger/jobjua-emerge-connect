import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search,
  Sparkles,
  Lightbulb,
  Percent,
  Heart,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Image
} from 'lucide-react';

interface VIPContentManagementProps {
  userRole: 'admin' | 'agent';
}

interface VIPContent {
  id: string;
  title: string;
  content: string;
  content_type: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const VIPContentManagement = ({ userRole }: VIPContentManagementProps) => {
  const [contents, setContents] = useState<VIPContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<VIPContent | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content_type: 'tip',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('vip_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch VIP content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      if (editingContent) {
        // Update existing content
        const { error } = await supabase
          .from('vip_content')
          .update({
            title: formData.title,
            content: formData.content,
            content_type: formData.content_type,
            image_url: formData.image_url,
            is_active: formData.is_active
          })
          .eq('id', editingContent.id);

        if (error) throw error;

        setContents(contents.map(content => 
          content.id === editingContent.id 
            ? { ...content, ...formData, updated_at: new Date().toISOString() }
            : content
        ));

        toast({
          title: "Success",
          description: "Content updated successfully"
        });
      } else {
        // Create new content
        const { data, error } = await supabase
          .from('vip_content')
          .insert({
            ...formData,
            created_by: user.data.user.id
          })
          .select()
          .single();

        if (error) throw error;

        setContents([data, ...contents]);

        toast({
          title: "Success",
          description: "Content created successfully"
        });
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        content_type: 'tip',
        image_url: '',
        is_active: true
      });
      setShowCreateDialog(false);
      setEditingContent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (content: VIPContent) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      content: content.content,
      content_type: content.content_type,
      image_url: content.image_url || '',
      is_active: content.is_active
    });
    setShowCreateDialog(true);
  };

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('vip_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      setContents(contents.filter(content => content.id !== contentId));

      toast({
        title: "Success",
        description: "Content deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (contentId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('vip_content')
        .update({ is_active: isActive })
        .eq('id', contentId);

      if (error) throw error;

      setContents(contents.map(content => 
        content.id === contentId 
          ? { ...content, is_active: isActive }
          : content
      ));

      toast({
        title: "Success",
        description: `Content ${isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content status",
        variant: "destructive"
      });
    }
  };

  const getContentTypeIcon = (type: string) => {
    const icons = {
      tip: <Lightbulb className="w-4 h-4 text-yellow-600" />,
      discount: <Percent className="w-4 h-4 text-green-600" />,
      motivation: <Heart className="w-4 h-4 text-red-600" />
    };
    return icons[type as keyof typeof icons] || <Sparkles className="w-4 h-4" />;
  };

  const getContentTypeBadge = (type: string) => {
    const badges = {
      tip: <Badge className="bg-yellow-100 text-yellow-800">💡 Tip</Badge>,
      discount: <Badge className="bg-green-100 text-green-800">💰 Discount</Badge>,
      motivation: <Badge className="bg-red-100 text-red-800">❤️ Motivation</Badge>
    };
    return badges[type as keyof typeof badges] || <Badge>{type}</Badge>;
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = 
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || content.content_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && content.is_active) ||
      (statusFilter === 'inactive' && !content.is_active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: contents.length,
    active: contents.filter(c => c.is_active).length,
    tips: contents.filter(c => c.content_type === 'tip').length,
    discounts: contents.filter(c => c.content_type === 'discount').length,
    motivations: contents.filter(c => c.content_type === 'motivation').length
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">VIP Content Management</h2>
          <p className="text-muted-foreground">
            Create and manage exclusive content for VIP users
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) {
            setEditingContent(null);
            setFormData({
              title: '',
              content: '',
              content_type: 'tip',
              image_url: '',
              is_active: true
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'Edit Content' : 'Create New VIP Content'}
              </DialogTitle>
              <DialogDescription>
                {editingContent ? 'Update the content details below' : 'Fill in the details to create new VIP content'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Content title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Content Type *</Label>
                  <Select value={formData.content_type} onValueChange={(value: any) => setFormData({ ...formData, content_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tip">💡 Career Tip</SelectItem>
                      <SelectItem value="discount">💰 Discount/Offer</SelectItem>
                      <SelectItem value="motivation">❤️ Motivation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your content here..."
                  className="min-h-32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Make content active immediately</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="gradient-primary">
                  {editingContent ? 'Update Content' : 'Create Content'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tips</p>
                <p className="text-2xl font-bold text-foreground">{stats.tips}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Discounts</p>
                <p className="text-2xl font-bold text-foreground">{stats.discounts}</p>
              </div>
              <Percent className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Motivation</p>
                <p className="text-2xl font-bold text-foreground">{stats.motivations}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
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
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tip">Tips</SelectItem>
                <SelectItem value="discount">Discounts</SelectItem>
                <SelectItem value="motivation">Motivation</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>VIP Content ({filteredContents.length})</CardTitle>
          <CardDescription>
            Manage exclusive content for VIP users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content) => (
                  <TableRow key={content.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        {content.image_url && (
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Image className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{content.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {content.content}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getContentTypeBadge(content.content_type)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {content.is_active ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(content.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(content)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(content.id, !content.is_active)}
                        >
                          {content.is_active ? (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Show
                            </>
                          )}
                        </Button>

                        {userRole === 'admin' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(content.id)}
                          >
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

          {filteredContents.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No content found</h3>
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by creating your first VIP content'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};