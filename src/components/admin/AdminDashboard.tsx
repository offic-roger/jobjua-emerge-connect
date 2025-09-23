import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DashboardOverview } from './sections/DashboardOverview';
import { JobManagement } from './sections/JobManagement';
import { UserManagement } from './sections/UserManagement';
import { PaymentsSubscriptions } from './sections/PaymentsSubscriptions';
import { AgentManagement } from './sections/AgentManagement';
import { VIPContentManagement } from './sections/VIPContentManagement';

type AdminSection = 'dashboard' | 'jobs' | 'users' | 'payments' | 'agents' | 'content';

interface AdminDashboardProps {
  user: User;
  userRole: 'admin' | 'agent';
}

export const AdminDashboard = ({ user, userRole }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview userRole={userRole} />;
      case 'jobs':
        return <JobManagement userRole={userRole} />;
      case 'users':
        return <UserManagement userRole={userRole} />;
      case 'payments':
        return <PaymentsSubscriptions userRole={userRole} />;
      case 'agents':
        return <AgentManagement userRole={userRole} />;
      case 'content':
        return <VIPContentManagement userRole={userRole} />;
      default:
        return <DashboardOverview userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        userRole={userRole}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <AdminHeader 
          user={user}
          userRole={userRole}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};