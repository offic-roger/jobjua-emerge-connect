import { useState, useRef } from 'react';
import { MapPin, Clock, Bookmark, Archive, Eye, DollarSign, Building2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  isUrgent?: boolean;
  tags?: string[];
}

interface JobCardProps {
  job: Job;
  onSave?: (job: Job) => void;
  onArchive?: (job: Job) => void;
  onClick?: () => void;
  className?: string;
}

export const JobCard = ({
  job,
  onSave,
  onArchive,
  onClick,
  className
}: JobCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(job.isSaved || false);
  const [isLiked, setIsLiked] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onSave?.({ ...job, isSaved: !isBookmarked });
    toast({
      title: isBookmarked ? "Job unsaved" : "Job saved!",
      description: isBookmarked ? "Removed from your saved jobs" : "Added to your saved jobs",
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const offset = touch.clientX - rect.left - rect.width / 2;
      setDragOffset(Math.max(-100, Math.min(100, offset)));
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0) {
        handleBookmark({ stopPropagation: () => {} } as React.MouseEvent);
      } else {
        onArchive?.(job);
        toast({
          title: "Job archived",
          description: "Job moved to archive",
        });
      }
    }
    setDragOffset(0);
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "bg-card rounded-lg shadow-card transition-all duration-300 cursor-pointer hover:shadow-card-hover border border-border/50 relative overflow-hidden",
        className
      )}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${dragOffset}px) scale(${1 - Math.abs(dragOffset) / 500})`,
        transition: dragOffset === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Swipe indicators */}
      {dragOffset > 20 && (
        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-start pl-6 z-10">
          <Bookmark className="text-green-600" size={24} />
        </div>
      )}
      {dragOffset < -20 && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-end pr-6 z-10">
          <Archive className="text-red-600" size={24} />
        </div>
      )}

      <div className="p-4 relative z-20 bg-card">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="text-primary" size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-card-foreground line-clamp-1">
                    {job.title}
                  </h3>
                  {job.isVip && (
                    <Badge className="gradient-primary text-primary-foreground text-xs">
                      VIP
                    </Badge>
                  )}
                  {job.isUrgent && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{job.company}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{job.time}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-accent font-bold text-lg mb-3">
              <DollarSign size={16} />
              <span>{job.salary}</span>
            </div>

            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {job.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-muted/50">
                    {tag}
                  </Badge>
                ))}
                {job.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                    +{job.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:scale-110 transition-transform"
              onClick={handleLike}
            >
              <Heart className={cn(
                "w-4 h-4",
                isLiked ? "fill-destructive text-destructive" : "text-muted-foreground"
              )} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:scale-110 transition-transform"
              onClick={handleBookmark}
            >
              <Bookmark className={cn(
                "w-4 h-4",
                isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"
              )} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs capitalize">
            {job.type.replace('-', ' ')}
          </Badge>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 px-4 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Apply Now
          </Button>
        </div>

        {job.isUrgent && (
          <div className="mt-2 text-xs text-destructive font-medium">
            🔥 Apply within 24 hours
          </div>
        )}
      </div>
    </div>
  );
};

export const JobCardSkeleton = () => (
  <div className="bg-card rounded-lg shadow-card border border-border/50 animate-pulse">
    <div className="p-4 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-lg"></div>
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-3 bg-muted rounded w-20"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
          <div className="h-6 bg-muted rounded w-24"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded w-16"></div>
            <div className="h-6 bg-muted rounded w-20"></div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-8 w-8 bg-muted rounded"></div>
          <div className="h-8 w-8 bg-muted rounded"></div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-muted rounded w-20"></div>
        <div className="h-8 bg-muted rounded w-20"></div>
      </div>
    </div>
  </div>
);