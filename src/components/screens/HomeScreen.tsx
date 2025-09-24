import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { MobileLayout } from '@/components/MobileLayout';
import { JobCard, JobCardSkeleton } from '@/components/JobCard';
import { JobDetailsModal } from '@/components/JobDetailsModal';
import { FilterModal, JobFilters } from '@/components/FilterModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Mock job data with enhanced realistic data
const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Solutions',
    salary: 'KSh 250,000/month',
    location: 'Nairobi, Kenya',
    time: '2h ago',
    type: 'full-time' as const,
    isVip: false,
    isSaved: false,
    isUrgent: false,
    tags: ['React', 'Node.js', 'TypeScript', 'AWS']
  },
  {
    id: '2',
    title: 'Digital Marketing Manager',
    company: 'StartupHub Africa',
    salary: '₦320,000/month',
    location: 'Lagos, Nigeria', 
    time: '4h ago',
    type: 'remote' as const,
    isVip: true,
    isSaved: true,
    isUrgent: true,
    tags: ['Digital Marketing', 'SEO', 'Analytics', 'Social Media']
  },
  {
    id: '3',
    title: 'Sales Representative',
    company: 'RetailPlus Kenya',
    salary: 'KSh 75,000/month',
    location: 'Mombasa, Kenya',
    time: '6h ago',
    type: 'full-time' as const,
    isVip: false,
    isSaved: false,
    isUrgent: true,
    tags: ['Sales', 'Customer Relations', 'CRM']
  },
  {
    id: '4',
    title: 'Mobile App Developer',
    company: 'AppMakers Ltd',
    salary: 'GHS 8,500/month',
    location: 'Accra, Ghana',
    time: '1d ago',
    type: 'contract' as const,
    isVip: true,
    isSaved: false,
    isUrgent: false,
    tags: ['React Native', 'Flutter', 'iOS', 'Android']
  },
  {
    id: '5',
    title: 'UX/UI Designer',
    company: 'DesignStudio Africa',
    salary: 'RWF 650,000/month',
    location: 'Kigali, Rwanda',
    time: '2d ago',
    type: 'full-time' as const,
    isVip: false,
    isSaved: true,
    isUrgent: false,
    tags: ['Figma', 'User Research', 'Prototyping']
  },
  {
    id: '6',
    title: 'Data Analyst',
    company: 'DataFlow Inc',
    salary: 'R45,000/month',
    location: 'Cape Town, SA',
    time: '3d ago',
    type: 'remote' as const,
    isVip: true,
    isSaved: false,
    isUrgent: false,
    tags: ['Python', 'SQL', 'Tableau', 'Power BI']
  },
];

export const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<JobFilters>({
    locations: [],
    salaryRange: [0, 1000000],
    jobTypes: [],
    experience: [],
    postedWithin: 'anytime',
    isVipOnly: false,
  });
  const { toast } = useToast();

  // Fetch jobs from Supabase with real-time updates
  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ['jobs', searchQuery, activeFilters],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply location filter
      if (activeFilters.locations.length > 0) {
        query = query.in('location', activeFilters.locations);
      }

      // Apply VIP filter
      if (activeFilters.isVipOnly) {
        query = query.eq('category', 'vip');
      }

      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again.",
          variant: "destructive",
        });
        return [];
      }

      // Transform data to match expected format
      return data.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company_name || 'Company Name',
        salary: job.salary_min && job.salary_max 
          ? `KSh ${job.salary_min.toLocaleString()} - KSh ${job.salary_max.toLocaleString()}/month`
          : 'Salary negotiable',
        location: job.location,
        time: new Date(job.created_at).toLocaleDateString(),
        type: 'full-time' as const,
        isVip: job.category === 'vip',
        isSaved: false,
        isUrgent: job.expires_at && new Date(job.expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tags: job.requirements?.slice(0, 4) || [],
        description: job.description,
        contactEmail: job.contact_email,
        contactPhone: job.contact_phone,
        benefits: job.benefits,
        companyLogoUrl: job.company_logo_url,
      }));
    },
    staleTime: 30 * 1000, // 30 seconds for faster updates
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Set up real-time subscription for new jobs
  useEffect(() => {
    const channel = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
          filter: 'status=eq.approved'
        },
        (payload) => {
          console.log('Job update received:', payload);
          refetch(); // Refetch jobs when there's a change
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Job Posted!",
              description: "Check out the latest opportunities",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Jobs Updated",
      description: "Found new opportunities for you!",
    });
  };

  const handleSaveJob = async (jobId: string) => {
    // TODO: Implement save job functionality with user authentication
    const job = jobs.find(j => j.id === jobId);
    toast({
      title: "Job Saved",
      description: "Added to your saved jobs",
    });
  };

  const handleArchiveJob = (jobId: string) => {
    // TODO: Implement archive job functionality
    toast({
      title: "Job Archived",
      description: "You won't see this job again",
    });
  };

  const handleQuickPreview = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
    }
  };

  const handleApplyFilters = (filters: JobFilters) => {
    setActiveFilters(filters);
    toast({
      title: "Filters Applied",
      description: "Job listings have been updated",
    });
  };

  const headerContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Good morning!</h1>
          <p className="text-primary-foreground/80 text-sm">Ready to find your dream job?</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={() => setShowFilters(true)}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <MobileLayout headerContent={headerContent} className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {jobs.length} jobs found
          </h2>
          <span className="text-sm text-muted-foreground">
            Swipe to save/archive
          </span>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))
          ) : (
            jobs.map((job, index) => (
              <div
                key={job.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <JobCard
                  job={job}
                  onSave={(job) => handleSaveJob(job.id)}
                  onArchive={(job) => handleArchiveJob(job.id)}
                  onClick={() => handleQuickPreview(job.id)}
                />
              </div>
            ))
          )}
        </div>

        {jobs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria
            </p>
            <Button onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          </div>
        )}

        {/* Job Details Modal */}
        {selectedJob && (
          <JobDetailsModal
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            job={selectedJob}
          />
        )}

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </MobileLayout>
  );
};