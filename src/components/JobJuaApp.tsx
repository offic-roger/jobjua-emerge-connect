import { useState, useEffect } from 'react';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { VIPRoomsScreen } from '@/components/screens/VIPRoomsScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { NotificationsScreen } from '@/components/screens/NotificationsScreen';
import { PerksScreen } from '@/components/screens/PerksScreen';
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
        return <PerksScreen />;
      case 'notifications':
        return <NotificationsScreen />;
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