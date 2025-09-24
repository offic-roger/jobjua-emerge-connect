import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import { MobileLayout } from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

type ApplicationStatus = 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: ApplicationStatus;
  stage: string;
  progress: number;
  nextStep?: string;
  lastUpdate: string;
  salary: string;
  location: string;
}

const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    appliedDate: '3 days ago',
    status: 'interview',
    stage: 'Technical Interview',
    progress: 75,
    nextStep: 'Final interview scheduled for tomorrow',
    lastUpdate: '2 hours ago',
    salary: 'KSh 280,000/month',
    location: 'Nairobi, Kenya'
  },
  {
    id: '2',
    jobTitle: 'Product Designer',
    company: 'DesignHub Africa',
    appliedDate: '1 week ago',
    status: 'reviewed',
    stage: 'Application Review',
    progress: 50,
    nextStep: 'Waiting for hiring manager feedback',
    lastUpdate: '1 day ago',
    salary: '₦250,000/month',
    location: 'Lagos, Nigeria'
  },
  {
    id: '3',
    jobTitle: 'Marketing Manager',
    company: 'StartupVenture',
    appliedDate: '2 weeks ago',
    status: 'rejected',
    stage: 'Application Rejected',
    progress: 25,
    lastUpdate: '3 days ago',
    salary: 'GHS 12,000/month',
    location: 'Accra, Ghana'
  },
  {
    id: '4',
    jobTitle: 'Full Stack Developer',
    company: 'InnovateNow',
    appliedDate: '5 days ago',
    status: 'pending',
    stage: 'Application Submitted',
    progress: 25,
    nextStep: 'Application under review',
    lastUpdate: '5 days ago',
    salary: 'R35,000/month',
    location: 'Cape Town, SA'
  },
  {
    id: '5',
    jobTitle: 'Data Scientist',
    company: 'DataTech Ltd',
    appliedDate: '3 weeks ago',
    status: 'accepted',
    stage: 'Offer Accepted',
    progress: 100,
    lastUpdate: '1 week ago',
    salary: 'KSh 320,000/month',
    location: 'Nairobi, Kenya'
  }
];

const statusConfig = {
  pending: { 
    icon: Clock, 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50', 
    label: 'Pending',
    borderColor: 'border-yellow-200'
  },
  reviewed: { 
    icon: Eye, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50', 
    label: 'Reviewed',
    borderColor: 'border-blue-200'
  },
  interview: { 
    icon: MessageSquare, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50', 
    label: 'Interview',
    borderColor: 'border-purple-200'
  },
  rejected: { 
    icon: XCircle, 
    color: 'text-red-600', 
    bgColor: 'bg-red-50', 
    label: 'Rejected',
    borderColor: 'border-red-200'
  },
  accepted: { 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bgColor: 'bg-green-50', 
    label: 'Accepted',
    borderColor: 'border-green-200'
  }
};

export const ApplicationsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState<ApplicationStatus | 'all'>('all');
  const { user } = useAuth();

  // Fetch applications from Supabase
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return mockApplications;
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            company_name,
            salary_min,
            salary_max,
            location
          )
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return mockApplications;
      }

      // Transform data to match expected format
      return data.map((app: any) => ({
        id: app.id,
        jobTitle: app.jobs?.title || 'Job Title',
        company: app.jobs?.company_name || 'Company',
        appliedDate: new Date(app.applied_at).toLocaleDateString(),
        status: app.status as ApplicationStatus,
        stage: getStageFromStatus(app.status),
        progress: getProgressFromStatus(app.status),
        nextStep: getNextStepFromStatus(app.status),
        lastUpdate: new Date(app.updated_at).toLocaleDateString(),
        salary: app.jobs?.salary_min && app.jobs?.salary_max 
          ? `KSh ${app.jobs.salary_min.toLocaleString()} - KSh ${app.jobs.salary_max.toLocaleString()}/month`
          : 'Salary negotiable',
        location: app.jobs?.location || 'Location not specified',
      }));
    },
    enabled: !!user,
  });
  
  const filteredApplications = applications.filter(app => 
    selectedFilter === 'all' ? true : app.status === selectedFilter
  );

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    interview: applications.filter(app => app.status === 'interview').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
  };

  // Helper functions
  function getStageFromStatus(status: string): string {
    const stages = {
      pending: 'Application Submitted',
      reviewed: 'Application Review',
      interview: 'Technical Interview',
      rejected: 'Application Rejected',
      accepted: 'Offer Accepted',
      applied: 'Application Submitted'
    };
    return stages[status as keyof typeof stages] || 'Unknown Stage';
  }

  function getProgressFromStatus(status: string): number {
    const progress = {
      pending: 25,
      applied: 25,
      reviewed: 50,
      interview: 75,
      rejected: 25,
      accepted: 100
    };
    return progress[status as keyof typeof progress] || 0;
  }

  function getNextStepFromStatus(status: string): string | undefined {
    const nextSteps = {
      pending: 'Application under review',
      applied: 'Application under review',
      reviewed: 'Waiting for hiring manager feedback',
      interview: 'Interview scheduled',
      rejected: undefined,
      accepted: undefined
    };
    return nextSteps[status as keyof typeof nextSteps];
  }

  const headerContent = (
    <div className="text-center">
      <h1 className="text-xl font-bold">My Applications</h1>
      <p className="text-primary-foreground/80 text-sm">
        Track your job application progress
      </p>
    </div>
  );

  return (
    <MobileLayout headerContent={headerContent} className="p-4">
      <div className="space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className="whitespace-nowrap"
          >
            All ({statusCounts.all})
          </Button>
          <Button
            variant={selectedFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('pending')}
            className="whitespace-nowrap"
          >
            Pending ({statusCounts.pending})
          </Button>
          <Button
            variant={selectedFilter === 'interview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('interview')}
            className="whitespace-nowrap"
          >
            Interview ({statusCounts.interview})
          </Button>
          <Button
            variant={selectedFilter === 'accepted' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('accepted')}
            className="whitespace-nowrap"
          >
            Accepted ({statusCounts.accepted})
          </Button>
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {filteredApplications.map((application) => {
            const config = statusConfig[application.status];
            const StatusIcon = config.icon;
            
            return (
              <Card 
                key={application.id} 
                className={`p-4 shadow-card border-l-4 ${config.borderColor}`}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {application.jobTitle}
                      </h3>
                      <p className="text-muted-foreground">{application.company}</p>
                      <p className="text-secondary font-semibold text-sm">
                        {application.salary}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor}`}>
                      <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      <span className={`text-sm font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{application.stage}</span>
                      <span className="text-sm text-muted-foreground">
                        {application.progress}%
                      </span>
                    </div>
                    <Progress value={application.progress} className="h-2" />
                  </div>

                  {/* Next Step */}
                  {application.nextStep && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-1">Next Step:</h4>
                      <p className="text-sm text-muted-foreground">
                        {application.nextStep}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <span>Applied {application.appliedDate}</span>
                    <span>Updated {application.lastUpdate}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    {application.status === 'interview' && (
                      <Button size="sm" className="flex-1">
                        Prepare Interview
                      </Button>
                    )}
                    {application.status === 'accepted' && (
                      <Button size="sm" className="flex-1">
                        View Offer
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredApplications.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {user ? 'No applications found' : 'Sign in to view applications'}
            </h3>
            <p className="text-muted-foreground">
              {user ? 'Start applying to jobs to track your progress here' : 'Please sign in to see your job applications'}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg p-4 h-32"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};