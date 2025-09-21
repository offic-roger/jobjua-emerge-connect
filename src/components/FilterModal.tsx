import { useState } from 'react';
import { X, Filter, MapPin, DollarSign, Briefcase, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: JobFilters) => void;
}

export interface JobFilters {
  locations: string[];
  salaryRange: [number, number];
  jobTypes: string[];
  experience: string[];
  postedWithin: string;
  isVipOnly: boolean;
}

const defaultFilters: JobFilters = {
  locations: [],
  salaryRange: [0, 1000000],
  jobTypes: [],
  experience: [],
  postedWithin: 'anytime',
  isVipOnly: false,
};

export const FilterModal = ({ isOpen, onClose, onApplyFilters }: FilterModalProps) => {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const { toast } = useToast();

  const locations = [
    'Lagos, Nigeria',
    'Abuja, Nigeria', 
    'Port Harcourt, Nigeria',
    'Kano, Nigeria',
    'Ibadan, Nigeria',
    'Remote'
  ];

  const jobTypes = [
    { id: 'full-time', label: 'Full Time' },
    { id: 'part-time', label: 'Part Time' },
    { id: 'contract', label: 'Contract' },
    { id: 'remote', label: 'Remote' },
    { id: 'internship', label: 'Internship' }
  ];

  const experienceLevels = [
    { id: 'entry', label: 'Entry Level (0-2 years)' },
    { id: 'mid', label: 'Mid Level (2-5 years)' },
    { id: 'senior', label: 'Senior Level (5+ years)' },
    { id: 'executive', label: 'Executive' }
  ];

  const postedWithinOptions = [
    { id: 'anytime', label: 'Anytime' },
    { id: '24h', label: 'Last 24 hours' },
    { id: '3d', label: 'Last 3 days' },
    { id: '7d', label: 'Last week' },
    { id: '30d', label: 'Last month' }
  ];

  const handleLocationChange = (location: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      locations: checked 
        ? [...prev.locations, location]
        : prev.locations.filter(l => l !== location)
    }));
  };

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      jobTypes: checked 
        ? [...prev.jobTypes, jobType]
        : prev.jobTypes.filter(t => t !== jobType)
    }));
  };

  const handleExperienceChange = (level: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      experience: checked 
        ? [...prev.experience, level]
        : prev.experience.filter(e => e !== level)
    }));
  };

  const handleSalaryChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      salaryRange: [value[0], value[1]]
    }));
  };

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000)}K`;
    }
    return `₦${amount}`;
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
    toast({
      title: "Filters Applied",
      description: "Job listings updated with your preferences",
    });
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.locations.length > 0) count++;
    if (filters.jobTypes.length > 0) count++;
    if (filters.experience.length > 0) count++;
    if (filters.postedWithin !== 'anytime') count++;
    if (filters.isVipOnly) count++;
    if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 1000000) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-x-0 bottom-0 max-w-mobile mx-auto">
        <Card className="rounded-t-2xl rounded-b-none max-h-[90vh] overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="gradient-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <h2 className="font-bold text-lg">Filter Jobs</h2>
              {getActiveFilterCount() > 0 && (
                <span className="bg-primary-foreground text-primary text-xs px-2 py-0.5 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
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
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
            {/* Location Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Location</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={location}
                      checked={filters.locations.includes(location)}
                      onCheckedChange={(checked) => 
                        handleLocationChange(location, checked as boolean)
                      }
                    />
                    <label htmlFor={location} className="text-sm font-medium cursor-pointer">
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Salary Range</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatSalary(filters.salaryRange[0])}</span>
                  <span>{formatSalary(filters.salaryRange[1])}</span>
                </div>
                <Slider
                  value={filters.salaryRange}
                  onValueChange={handleSalaryChange}
                  max={1000000}
                  step={50000}
                  className="w-full"
                />
              </div>
            </div>

            {/* Job Type */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Job Type</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {jobTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={filters.jobTypes.includes(type.id)}
                      onCheckedChange={(checked) => 
                        handleJobTypeChange(type.id, checked as boolean)
                      }
                    />
                    <label htmlFor={type.id} className="text-sm font-medium cursor-pointer">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Experience Level</h3>
              </div>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <div key={level.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={level.id}
                      checked={filters.experience.includes(level.id)}
                      onCheckedChange={(checked) => 
                        handleExperienceChange(level.id, checked as boolean)
                      }
                    />
                    <label htmlFor={level.id} className="text-sm font-medium cursor-pointer">
                      {level.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Posted Within */}
            <div>
              <h3 className="font-semibold mb-3">Posted Within</h3>
              <div className="space-y-2">
                {postedWithinOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.postedWithin === option.id}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters(prev => ({ ...prev, postedWithin: option.id }));
                        }
                      }}
                    />
                    <label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* VIP Only */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">VIP Jobs Only</span>
              <Checkbox
                checked={filters.isVipOnly}
                onCheckedChange={(checked) => 
                  setFilters(prev => ({ ...prev, isVipOnly: checked as boolean }))
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              
              <Button
                onClick={handleApplyFilters}
                className="flex-1 gradient-primary"
              >
                Apply Filters ({getActiveFilterCount()})
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};