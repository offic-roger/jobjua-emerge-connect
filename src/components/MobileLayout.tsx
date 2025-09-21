import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  headerContent?: ReactNode;
}

export const MobileLayout = ({ 
  children, 
  className,
  showHeader = true,
  headerContent
}: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background max-w-mobile mx-auto relative">
      {showHeader && (
        <header className="gradient-primary text-primary-foreground p-4 shadow-card">
          {headerContent || (
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">JobJua</h1>
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-full"></div>
              </div>
            </div>
          )}
        </header>
      )}
      
      <main className={cn(
        "pb-20 animate-fade-in",
        className
      )}>
        {children}
      </main>
    </div>
  );
};