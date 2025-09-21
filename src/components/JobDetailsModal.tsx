import { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Bookmark, 
  Share2, 
  Building, 
  Users, 
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    company: string;
    salary: string;
    location: string;
    time: string;
    type: 'full-time' | 'part-time' | 'contract' | 'remote';
    isVip?: boolean;
    isSaved?: boolean;
  };
}

export const JobDetailsModal = ({ isOpen, onClose, job }: JobDetailsModalProps) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isApplied, setIsApplied] = useState(false);
  const { toast } = useToast();

  // Mock additional job details
  const jobDetails = {
    description: `We're looking for a talented ${job.title} to join our growing team at ${job.company}. This is an exciting opportunity to work on cutting-edge projects and make a real impact.`,
    requirements: [
      '3+ years of experience in relevant field',
      'Strong problem-solving skills',
      'Excellent communication abilities',
      'Team player with leadership potential',
      'Bachelor\'s degree or equivalent experience'
    ],
    responsibilities: [
      'Lead development of key product features',
      'Collaborate with cross-functional teams',
      'Mentor junior team members',
      'Participate in code reviews and technical discussions',
      'Drive best practices and technical excellence'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Health insurance coverage',
      'Flexible working arrangements',
      'Professional development budget',
      'Annual performance bonuses'
    ],
    companyInfo: {
      size: '50-200 employees',
      industry: 'Technology',
      founded: '2018',
      website: 'techcorp.com'
    },
    applicationDeadline: 'March 30, 2024',
    postedDate: 'March 15, 2024'
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Job Removed" : "Job Saved",
      description: isSaved ? "Removed from saved jobs" : "Added to your saved jobs",
    });
  };

  const handleApply = () => {
    setIsApplied(true);
    toast({
      title: "Application Submitted",
      description: "Your application has been sent to the employer",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link Copied",
      description: "Job link has been copied to clipboard",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-x-0 bottom-0 max-w-mobile mx-auto">
        <Card className="rounded-t-2xl rounded-b-none max-h-[90vh] overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="gradient-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="font-bold text-lg">{job.title}</h2>
              <p className="text-primary-foreground/80 text-sm">{job.company}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{job.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-secondary">{job.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{jobDetails.applicationDeadline}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {job.type.replace('-', ' ')}
              </Badge>
              {job.isVip && (
                <Badge className="gradient-primary text-primary-foreground">
                  VIP Only
                </Badge>
              )}
              <Badge variant="secondary">{jobDetails.companyInfo.industry}</Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Job Description</h3>
              <p className="text-sm text-muted-foreground">{jobDetails.description}</p>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <ul className="space-y-1">
                {jobDetails.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div>
              <h3 className="font-semibold mb-2">Key Responsibilities</h3>
              <ul className="space-y-1">
                {jobDetails.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold mb-2">Benefits & Perks</h3>
              <ul className="space-y-1">
                {jobDetails.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Info */}
            <Card className="p-3 bg-muted/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{job.company}</h4>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{jobDetails.companyInfo.size}</span>
                    </div>
                    <div>Founded: {jobDetails.companyInfo.founded}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Application Status */}
            {isApplied && (
              <Card className="p-3 bg-primary/10 border-primary/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Application submitted successfully!
                  </span>
                </div>
              </Card>
            )}

            {/* Warning for VIP jobs */}
            {job.isVip && (
              <Card className="p-3 bg-secondary/10 border-secondary/20">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-secondary">
                    This is a VIP-only position with premium benefits
                  </span>
                </div>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex-1"
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <Button
              onClick={handleApply}
              disabled={isApplied}
              className={`w-full ${isApplied ? 'bg-primary/50' : 'gradient-primary'}`}
            >
              {isApplied ? 'Application Submitted' : 'Apply Now'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};