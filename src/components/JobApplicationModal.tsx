import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, FileText, X, Send } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  contactEmail?: string;
}

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

export const JobApplicationModal = ({ isOpen, onClose, job }: JobApplicationModalProps) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.includes('pdf') && !file.type.includes('doc')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        return;
      }
      
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    if (!coverLetter.trim()) {
      toast({
        title: "Cover letter required",
        description: "Please write a brief cover letter",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName);
        
        resumeUrl = urlData.publicUrl;
      }

      // Submit application
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: job.id,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
          status: 'applied'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the employer",
      });

      onClose();
    } catch (error) {
      console.error('Application error:', error);
      toast({
        title: "Application failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-background shadow-elevated max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Apply for Job</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-muted-foreground">{job.company}</p>
            <p className="text-sm text-muted-foreground">{job.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cover-letter">Cover Letter *</Label>
              <Textarea
                id="cover-letter"
                placeholder="Write a brief cover letter explaining why you're interested in this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                {coverLetter.length}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume (Optional)</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-4">
                {resumeFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm">{resumeFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setResumeFile(null)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your resume (PDF or Word)
                    </p>
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('resume')?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Max file size: 5MB (PDF, DOC, DOCX)
              </p>
            </div>

            {userProfile && (
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">Your Contact Info</h4>
                <p className="text-xs text-muted-foreground">
                  {userProfile.full_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userProfile.phone_number || 'No phone number provided'}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-primary"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Send className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};