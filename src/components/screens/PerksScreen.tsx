import { useState } from 'react';
import { 
  Gift, 
  BookOpen, 
  TrendingUp, 
  Heart, 
  Shield, 
  Zap, 
  Star,
  Download,
  ExternalLink,
  Play
} from 'lucide-react';
import { MobileLayout } from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Perk {
  id: string;
  type: 'tip' | 'discount' | 'course' | 'tool' | 'motivation';
  title: string;
  description: string;
  content?: string;
  discount?: string;
  provider?: string;
  originalPrice?: string;
  discountedPrice?: string;
  isNew?: boolean;
  isPopular?: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

const mockPerks: Perk[] = [
  {
    id: '1',
    type: 'tip',
    title: 'Ace Your Next Interview',
    description: 'Master the STAR method and common behavioral questions',
    content: 'Learn how to structure your answers using Situation, Task, Action, Result framework...',
    isNew: true,
    actionLabel: 'Read Guide',
  },
  {
    id: '2',
    type: 'discount',
    title: '40% Off Coursera Plus',
    description: 'Access 7,000+ courses from top universities',
    provider: 'Coursera',
    originalPrice: '₦15,000',
    discountedPrice: '₦9,000',
    discount: '40% OFF',
    isPopular: true,
    actionLabel: 'Claim Discount',
    actionUrl: 'https://coursera.org',
  },
  {
    id: '3',
    type: 'course',
    title: 'Resume Writing Masterclass',
    description: 'Create a winning resume that gets you noticed by recruiters',
    isNew: true,
    actionLabel: 'Start Course',
  },
  {
    id: '4',
    type: 'tool',
    title: 'Salary Negotiation Calculator',
    description: 'Know your worth and negotiate confidently',
    actionLabel: 'Use Tool',
  },
  {
    id: '5',
    type: 'motivation',
    title: 'Daily Career Affirmations',
    description: 'Boost your confidence with personalized daily motivations',
    actionLabel: 'Get Inspired',
  },
  {
    id: '6',
    type: 'discount',
    title: 'Free LinkedIn Premium Trial',
    description: '2 months free access to LinkedIn Premium features',
    provider: 'LinkedIn',
    originalPrice: '₦8,000',
    discountedPrice: 'Free',
    discount: '100% OFF',
    actionLabel: 'Activate Now',
    actionUrl: 'https://linkedin.com/premium',
  },
];

export const PerksScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const categories = [
    { id: 'all', label: 'All Perks', icon: Gift },
    { id: 'tip', label: 'Tips', icon: BookOpen },
    { id: 'discount', label: 'Discounts', icon: Star },
    { id: 'course', label: 'Courses', icon: TrendingUp },
    { id: 'tool', label: 'Tools', icon: Zap },
    { id: 'motivation', label: 'Motivation', icon: Heart },
  ];

  const getPerkIcon = (type: Perk['type']) => {
    switch (type) {
      case 'tip':
        return <BookOpen className="w-5 h-5 text-primary" />;
      case 'discount':
        return <Star className="w-5 h-5 text-secondary" />;
      case 'course':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'tool':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'motivation':
        return <Heart className="w-5 h-5 text-pink-500" />;
      default:
        return <Gift className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handlePerkAction = (perk: Perk) => {
    if (perk.actionUrl) {
      window.open(perk.actionUrl, '_blank');
    }
    
    toast({
      title: `${perk.actionLabel || 'Action'} Activated`,
      description: `Accessing ${perk.title}...`,
    });
  };

  const filteredPerks = selectedCategory === 'all' 
    ? mockPerks 
    : mockPerks.filter(perk => perk.type === selectedCategory);

  const headerContent = (
    <div className="text-center">
      <h1 className="text-xl font-bold">VIP Perks</h1>
      <p className="text-primary-foreground/80 text-sm">
        Exclusive benefits for VIP members
      </p>
    </div>
  );

  return (
    <MobileLayout headerContent={headerContent} className="p-4">
      <div className="space-y-6">
        {/* VIP Status Banner */}
        <Card className="gradient-primary text-primary-foreground p-4 shadow-elevated">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">VIP Member Active</h3>
              <p className="text-xs text-primary-foreground/80">
                Enjoying premium benefits since March 2024
              </p>
            </div>
          </div>
          <div className="text-center py-2">
            <div className="text-2xl font-bold mb-1">₦125,000</div>
            <div className="text-xs text-primary-foreground/80">Total savings this month</div>
          </div>
        </Card>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 transition-smooth ${
                  isActive ? 'gradient-primary' : 'hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Perks Grid */}
        <div className="space-y-4">
          {filteredPerks.map((perk) => (
            <Card
              key={perk.id}
              className="p-4 shadow-card hover:shadow-elevated transition-smooth cursor-pointer"
              onClick={() => handlePerkAction(perk)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getPerkIcon(perk.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{perk.title}</h4>
                        {perk.isNew && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                        {perk.isPopular && (
                          <Badge variant="default" className="text-xs gradient-primary">Popular</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {perk.description}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>

                  {/* Discount Info */}
                  {perk.type === 'discount' && (
                    <div className="bg-muted rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-secondary">
                            {perk.discount}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {perk.provider}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground line-through">
                            {perk.originalPrice}
                          </div>
                          <div className="font-semibold text-sm">
                            {perk.discountedPrice}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    size="sm" 
                    className="w-full mt-2"
                    variant={perk.type === 'discount' ? 'default' : 'outline'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePerkAction(perk);
                    }}
                  >
                    {perk.actionLabel || 'Access'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Upgrade Prompt for Non-VIP */}
        <Card className="gradient-secondary text-primary-foreground p-4 shadow-card">
          <div className="text-center">
            <Gift className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Unlock More Perks</h3>
            <p className="text-xs text-primary-foreground/80 mb-3">
              Get access to premium courses, higher discounts, and exclusive tools
            </p>
            <Button 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full"
              size="sm"
            >
              Upgrade to VIP Pro
            </Button>
          </div>
        </Card>

        {/* Download Perks */}
        <Card className="p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Downloadable Resources</h4>
            <Download className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {[
              'Interview Questions Template',
              'Salary Negotiation Guide',
              'Career Development Checklist',
              'Network Building Strategies'
            ].map((resource, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 text-left"
              >
                <Download className="w-3 h-3 mr-2" />
                <span className="text-xs">{resource}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
};