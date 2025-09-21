import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { MobileLayout } from '@/components/MobileLayout';
import { JobCard, JobCardSkeleton } from '@/components/JobCard';
import { JobDetailsModal } from '@/components/JobDetailsModal';
import { FilterModal, JobFilters } from '@/components/FilterModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp Ltd',
    salary: '₦150,000/month',
    location: 'Lagos, Nigeria',
    time: '2h ago',
    type: 'full-time' as const,
    isVip: false,
    isSaved: false,
  },
  {
    id: '2',
    title: 'Digital Marketing Manager',
    company: 'StartupHub',
    salary: '₦200,000/month',
    location: 'Abuja, Nigeria',
    time: '4h ago',
    type: 'remote' as const,
    isVip: true,
    isSaved: true,
  },
  {
    id: '3',
    title: 'Sales Representative',
    company: 'RetailPlus',
    salary: '₦80,000/month',
    location: 'Port Harcourt',
    time: '6h ago',
    type: 'full-time' as const,
    isVip: false,
    isSaved: false,
  },
  {
    id: '4',
    title: 'Graphic Designer',
    company: 'Creative Studios',
    salary: '₦120,000/month',
    location: 'Kano, Nigeria',
    time: '1d ago',
    type: 'contract' as const,
    isVip: true,
    isSaved: false,
  },
];

export const HomeScreen = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);
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

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Jobs Updated",
        description: "Found new opportunities for you!",
      });
    }, 1500);
  };

  const handleSaveJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
    ));
    
    const job = jobs.find(j => j.id === jobId);
    toast({
      title: job?.isSaved ? "Job Removed" : "Job Saved",
      description: job?.isSaved ? "Removed from saved jobs" : "Added to your saved jobs",
    });
  };

  const handleArchiveJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
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
    // In a real app, this would trigger an API call with the filters
    toast({
      title: "Filters Applied",
      description: "Job listings have been updated",
    });
  };

  const filteredJobs = jobs.filter(job => {
    // Search query filter
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Location filter
    const matchesLocation = activeFilters.locations.length === 0 ||
                           activeFilters.locations.includes(job.location);
    
    // Job type filter
    const matchesJobType = activeFilters.jobTypes.length === 0 ||
                          activeFilters.jobTypes.includes(job.type);
    
    // VIP filter
    const matchesVIP = !activeFilters.isVipOnly || job.isVip;
    
    return matchesSearch && matchesLocation && matchesJobType && matchesVIP;
  });

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
            {filteredJobs.length} jobs found
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
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSave={() => handleSaveJob(job.id)}
                onArchive={() => handleArchiveJob(job.id)}
                onQuickPreview={() => handleQuickPreview(job.id)}
                className="animate-fade-in"
              />
            ))
          )}
        </div>

        {filteredJobs.length === 0 && !isLoading && (
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