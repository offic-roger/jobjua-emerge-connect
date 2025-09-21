import { useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import jobJuaLogo from '@/assets/jobjua-logo.jpg';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: 'Welcome to JobJua',
      subtitle: 'Your gateway to amazing career opportunities',
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-elevated">
            <img 
              src={jobJuaLogo} 
              alt="JobJua Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              JobJua
            </h1>
            <p className="text-muted-foreground">
              Discover your dream job with Nigeria's smartest job board
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-xs text-muted-foreground">Active Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">5K+</div>
              <div className="text-xs text-muted-foreground">Companies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-xs text-muted-foreground">Job Seekers</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: 'Smart Job Discovery',
      subtitle: 'AI-powered matching for perfect opportunities',
      content: (
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
            <div className="text-2xl">🎯</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold">Personalized Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI learns your preferences and shows relevant jobs first
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold">Swipe to Save</h3>
                <p className="text-sm text-muted-foreground">
                  Simple gestures to save or archive job listings
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when new opportunities match your profile
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'VIP Access Available',
      subtitle: 'Unlock premium features and exclusive opportunities',
      content: (
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto gradient-secondary rounded-full flex items-center justify-center">
            <div className="text-2xl">👑</div>
          </div>
          
          <div className="space-y-3">
            {[
              '🎯 Access to VIP job listings',
              '⚡ Priority application processing',
              '💰 Higher salary opportunities',
              '🔒 Verified company profiles',
              '📞 24/7 career support',
              '📈 Advanced career tools'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="gradient-primary rounded-lg p-4 text-primary-foreground text-center">
            <div className="text-lg font-bold">Start Free Trial</div>
            <div className="text-sm opacity-80">7 days free, then ₦2,500/month</div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Get Started',
      subtitle: 'Enter your phone number to create your account',
      content: (
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
            <div className="text-2xl">📱</div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+234 800 000 0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-center text-lg"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                We'll send you a verification code via SMS
              </p>
            </div>
            
            <div className="text-center">
              <Button
                variant="outline"
                className="w-full mb-2"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 bg-gradient-primary rounded"></div>
                  Continue with Google
                </div>
              </Button>
              <p className="text-xs text-muted-foreground">
                Or sign up with Google for faster access
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-mobile mx-auto flex flex-col">
      {/* Progress Bar */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onComplete}
            className="text-muted-foreground"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <Card className="p-6 shadow-elevated animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
            <p className="text-muted-foreground">{currentStepData.subtitle}</p>
          </div>
          
          {currentStepData.content}
        </Card>
      </div>

      {/* Navigation */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          className="w-full h-12 text-lg font-semibold gradient-primary"
          disabled={isLastStep && !phoneNumber.trim()}
        >
          {isLastStep ? 'Create Account' : 'Continue'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};