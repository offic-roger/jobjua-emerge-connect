import { useState, useEffect } from 'react';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { VIPRoomsScreen } from '@/components/screens/VIPRoomsScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { NotificationsScreen } from '@/components/screens/NotificationsScreen';
import { PerksScreen } from '@/components/screens/PerksScreen';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';

type Tab = 'home' | 'vip' | 'perks' | 'profile' | 'notifications';

export const JobJuaApp = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();

  // Check if user has completed onboarding
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('jobjua-onboarded') === 'true';
    setIsOnboarded(hasOnboarded);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('jobjua-onboarded', 'true');
    setIsOnboarded(true);
  };

  const handleTabChange = (tab: Tab) => {
    // Show auth modal for certain tabs when user is not authenticated
    if (!user && (tab === 'profile' || tab === 'vip')) {
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tab);
  };

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
        onTabChange={handleTabChange}
        notificationCount={3}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};