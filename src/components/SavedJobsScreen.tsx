import { useState } from 'react';
import { Search, Filter, Trash2, ExternalLink, MapPin, Clock, Building } from 'lucide-react';
import { MobileLayout } from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SavedJob {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  savedDate: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  isVip: boolean;
  tags: string[];
}

const mockSavedJobs: SavedJob[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    salary: 'KSh 280,000/month',
    location: 'Nairobi, Kenya',
    savedDate: '2 days ago',
    type: 'full-time',
    isVip: true,
    tags: ['React', 'TypeScript', 'Node.js']
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'DesignHub Africa',
    salary: '₦250,000/month',
    location: 'Lagos, Nigeria',
    savedDate: '1 week ago',
    type: 'remote',
    isVip: false,
    tags: ['Figma', 'Adobe XD', 'Prototyping']
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'StartupVenture',
    salary: 'GHS 12,000/month',
    location: 'Accra, Ghana',
    savedDate: '3 days ago',
    type: 'full-time',
    isVip: true,
    tags: ['Strategy', 'Analytics', 'Agile']
  }
];

export const SavedJobsScreen = () => {
  const [jobs, setJobs] = useState(mockSavedJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'vip' | 'recent'>('all');
  const { toast } = useToast();

  const handleRemoveJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    toast({
      title: "Job Removed",
      description: "Job has been removed from your saved list",
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'vip') return matchesSearch && job.isVip;
    if (selectedFilter === 'recent') return matchesSearch && job.savedDate.includes('day');
    
    return matchesSearch;
  });

  const headerContent = (
    <div className="text-center">
      <h1 className="text-xl font-bold">Saved Jobs</h1>
      <p className="text-primary-foreground/80 text-sm">
        {jobs.length} jobs in your list
      </p>
    </div>
  );

  return (
    <MobileLayout headerContent={headerContent} className="p-4">
      <div className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              All ({jobs.length})
            </Button>
            <Button
              variant={selectedFilter === 'vip' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('vip')}
            >
              VIP ({jobs.filter(j => j.isVip).length})
            </Button>
            <Button
              variant={selectedFilter === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('recent')}
            >
              Recent
            </Button>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="p-4 shadow-card">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{job.title}</h3>
                    {job.isVip && (
                      <Badge variant="secondary" className="text-xs">
                        VIP
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Building className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>

                  <div className="text-secondary font-semibold mb-2">
                    {job.salary}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Saved {job.savedDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleRemoveJob(job.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <Button size="sm" className="flex-1">
                  Apply Now
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No saved jobs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Start saving jobs you\'re interested in'}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};