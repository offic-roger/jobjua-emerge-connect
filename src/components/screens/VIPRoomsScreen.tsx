import { useState } from 'react';
import { Lock, Crown, Zap, Shield, ArrowRight } from 'lucide-react';
import { MobileLayout } from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import vipIllustration from '@/assets/vip-room-illustration.jpg';

interface VIPRoom {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  jobCount: number;
  isLocked: boolean;
  features: string[];
}

const vipRooms: VIPRoom[] = [
  {
    id: 'vip-jobs',
    title: 'VIP Jobs Room',
    description: 'Exclusive high-paying positions from premium companies',
    icon: Crown,
    jobCount: 47,
    isLocked: true,
    features: ['₦300k+ salaries', 'Premium companies', 'Fast-track applications'],
  },
  {
    id: 'quick-gigs',
    title: 'Quick Gig Room',
    description: 'Instant freelance opportunities with same-day payouts',
    icon: Zap,
    jobCount: 23,
    isLocked: true,
    features: ['Same-day pay', 'Flexible hours', 'No commitment'],
  },
  {
    id: 'verified-jobs',
    title: 'Verified Jobs Room',
    description: '100% verified positions with guaranteed authenticity',
    icon: Shield,
    jobCount: 31,
    isLocked: true,
    features: ['Verified employers', '100% real jobs', 'Scam protection'],
  },
];

export const VIPRoomsScreen = () => {
  const { user, isVip } = useAuth();
  const { toast } = useToast();

  // Fetch VIP content from Supabase
  const { data: vipContent = [] } = useQuery({
    queryKey: ['vip-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vip_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching VIP content:', error);
        return [];
      }
      
      return data;
    },
  });

  const handleVipUpgrade = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upgrade to VIP",
        variant: "destructive",
      });
      return;
    }

    // Create VIP subscription record
    try {
      const { error } = await supabase
        .from('vip_subscriptions')
        .insert({
          user_id: user.id,
          plan_name: 'VIP Monthly',
          amount: 2500,
          payment_method: 'mpesa',
          status: 'pending',
          starts_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      if (error) throw error;

      toast({
        title: "VIP Upgrade Initiated",
        description: "Redirecting to payment...",
      });
    } catch (error) {
      console.error('VIP upgrade error:', error);
      toast({
        title: "Upgrade failed",
        description: "Failed to initiate VIP upgrade. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRoomAccess = (roomId: string) => {
    if (!isVip) {
      toast({
        title: "VIP Access Required",
        description: "Upgrade to VIP to access exclusive rooms",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Accessing VIP Room",
      description: "Loading exclusive content...",
    });
  };
  const headerContent = (
    <div className="text-center">
      <h1 className="text-xl font-bold">VIP Rooms</h1>
      <p className="text-primary-foreground/80 text-sm">
        Unlock exclusive opportunities
      </p>
    </div>
  );

  return (
    <MobileLayout headerContent={headerContent} className="p-4">
      <div className="space-y-6">
        {/* VIP Hero Section */}
        <Card className="gradient-primary text-primary-foreground p-6 shadow-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Go VIP Today</h2>
                <p className="text-primary-foreground/80 text-sm">
                  Access exclusive job opportunities
                </p>
              </div>
            </div>
            <img 
              src={vipIllustration} 
              alt="VIP Benefits" 
              className="w-16 h-16 rounded-lg opacity-80"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">101</div>
              <div className="text-xs text-primary-foreground/80">Exclusive Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3x</div>
              <div className="text-xs text-primary-foreground/80">Higher Salary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24h</div>
              <div className="text-xs text-primary-foreground/80">Priority Support</div>
            </div>
          </div>

          <Button 
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            size="lg"
            onClick={handleVipUpgrade}
            disabled={isVip}
          >
            {isVip ? 'VIP Active' : 'Unlock VIP Access - ₦2,500/month'}
          </Button>
        </Card>

        {/* VIP Rooms */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Exclusive Rooms</h3>
          
          {vipRooms.map((room) => {
            const Icon = room.icon;
            
            return (
              <Card 
                key={room.id}
                className="p-4 shadow-card hover:shadow-elevated transition-smooth cursor-pointer"
                onClick={() => handleRoomAccess(room.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{room.title}</h4>
                        {room.isLocked && (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {room.description}
                      </p>
                      <span className="text-secondary font-semibold text-sm">
                        {room.jobCount} exclusive jobs
                      </span>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {room.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                {room.isLocked && !isVip && (
                  <div className="bg-muted/50 backdrop-blur-sm rounded-lg p-3 text-center">
                    <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      VIP membership required
                    </p>
                    <Button size="sm" variant="outline" className="w-full" onClick={(e) => {
                      e.stopPropagation();
                      handleVipUpgrade();
                    }}>
                      Unlock Room
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Benefits Overview */}
        <Card className="p-4 shadow-card">
          <h4 className="font-semibold mb-3">VIP Member Benefits</h4>
          <div className="space-y-2">
            {[
              '🎯 Access to premium job listings',
              '⚡ Skip-the-line applications',
              '💰 Salary negotiation tips',
              '📞 24/7 career support',
              '🔒 Profile verification badge',
              '📈 Career advancement tools'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
};