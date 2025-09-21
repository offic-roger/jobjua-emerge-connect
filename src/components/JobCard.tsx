import { useState } from 'react';
import { MapPin, Clock, Bookmark, Archive, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  time: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  isVip?: boolean;
  isSaved?: boolean;
}

interface JobCardProps {
  job: Job;
  onSave?: () => void;
  onArchive?: () => void;
  onQuickPreview?: () => void;
  className?: string;
}

export const JobCard = ({
  job,
  onSave,
  onArchive,
  onQuickPreview,
  className
}: JobCardProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div 
      className={cn(
        "bg-card rounded-lg p-4 shadow-card job-card-hover transition-smooth",
        "border border-border/50",
        isPressed && "scale-95",
        className
      )}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-card-foreground line-clamp-1">
              {job.title}
            </h3>
            {job.isVip && (
              <span className="gradient-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                VIP
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-2">{job.company}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{job.time}</span>
            </div>
          </div>
          
          <div className="text-secondary font-semibold text-lg">
            {job.salary}
          </div>
        </div>
        
        <div className="flex flex-col gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 touch-feedback"
            onClick={onSave}
          >
            <Bookmark className={cn(
              "w-4 h-4",
              job.isSaved ? "fill-secondary text-secondary" : "text-muted-foreground"
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 touch-feedback"
            onClick={onQuickPreview}
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 touch-feedback"
            onClick={onArchive}
          >
            <Archive className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-xs px-2 py-1 rounded-full",
          "bg-muted text-muted-foreground capitalize"
        )}>
          {job.type.replace('-', ' ')}
        </span>
        
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-3 text-xs touch-feedback"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export const JobCardSkeleton = () => (
  <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-muted skeleton w-3/4"></div>
          <div className="h-4 bg-muted skeleton w-1/2"></div>
          <div className="flex gap-4">
            <div className="h-3 bg-muted skeleton w-20"></div>
            <div className="h-3 bg-muted skeleton w-16"></div>
          </div>
          <div className="h-6 bg-muted skeleton w-24"></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-8 w-8 bg-muted skeleton"></div>
          <div className="h-8 w-8 bg-muted skeleton"></div>
          <div className="h-8 w-8 bg-muted skeleton"></div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-muted skeleton w-20"></div>
        <div className="h-8 bg-muted skeleton w-16"></div>
      </div>
    </div>
  </div>
);