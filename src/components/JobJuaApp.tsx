import { useState, useEffect } from 'react';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { VIPRoomsScreen } from '@/components/screens/VIPRoomsScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { BottomNavigation } from '@/components/BottomNavigation';

type Tab = 'home' | 'vip' | 'perks' | 'profile' | 'notifications';

export const JobJuaApp = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // Check if user has completed onboarding (in a real app, this would be stored in localStorage or backend)
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('jobjua-onboarded') === 'true';
    setIsOnboarded(hasOnboarded);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('jobjua-onboarded', 'true');
    setIsOnboarded(true);
  };

  // If not onboarded, show onboarding screen
  if (!isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'vip':
        return <VIPRoomsScreen />;
      case 'perks':
        return (
          <div className="min-h-screen bg-background max-w-mobile mx-auto flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center">
                <div className="text-3xl">🎁</div>
              </div>
              <h2 className="text-xl font-bold">Extra Perks</h2>
              <p className="text-muted-foreground">VIP-only benefits and rewards coming soon!</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="min-h-screen bg-background max-w-mobile mx-auto flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto gradient-secondary rounded-full flex items-center justify-center">
                <div className="text-3xl">🔔</div>
              </div>
              <h2 className="text-xl font-bold">Notifications</h2>
              <p className="text-muted-foreground">Stay updated with job alerts and messages!</p>
            </div>
          </div>
        );
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveScreen()}
      
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notificationCount={3}
      />
    </div>
  );
};