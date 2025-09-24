import { useState, Suspense, lazy } from 'react';
import { User } from '@supabase/supabase-js';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AdminHeader } from './AdminHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load sections for better performance
const DashboardOverview = lazy(() => import('./sections/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const JobManagement = lazy(() => import('./sections/JobManagement').then(m => ({ default: m.JobManagement })));
const UserManagement = lazy(() => import('./sections/UserManagement').then(m => ({ default: m.UserManagement })));
const PaymentsSubscriptions = lazy(() => import('./sections/PaymentsSubscriptions').then(m => ({ default: m.PaymentsSubscriptions })));
const AgentManagement = lazy(() => import('./sections/AgentManagement').then(m => ({ default: m.AgentManagement })));
const VIPContentManagement = lazy(() => import('./sections/VIPContentManagement').then(m => ({ default: m.VIPContentManagement })));

type AdminSection = 'dashboard' | 'jobs' | 'users' | 'payments' | 'agents' | 'content';

interface AdminDashboardProps {
  user: User;
  userRole: 'admin' | 'agent';
}

export const AdminDashboard = ({ user, userRole }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const renderActiveSection = () => {
    const LoadingFallback = () => (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );

    const commonProps = { userRole };

    switch (activeSection) {
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardOverview {...commonProps} />
          </Suspense>
        );
      case 'jobs':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <JobManagement {...commonProps} />
          </Suspense>
        );
      case 'users':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserManagement {...commonProps} />
          </Suspense>
        );
      case 'payments':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PaymentsSubscriptions {...commonProps} />
          </Suspense>
        );
      case 'agents':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AgentManagement {...commonProps} />
          </Suspense>
        );
      case 'content':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <VIPContentManagement {...commonProps} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardOverview {...commonProps} />
          </Suspense>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userRole={userRole}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with sidebar trigger */}
          <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-lg font-semibold text-foreground">
                Admin Dashboard
              </h1>
            </div>
            
            <AdminHeader 
              user={user}
              userRole={userRole}
              onToggleSidebar={() => {}}
              sidebarCollapsed={false}
            />
          </header>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="animate-fade-in">
              {renderActiveSection()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};