import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check user role
          setTimeout(async () => {
            const { data: roleData, error } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .in('role', ['admin', 'agent'])
              .single();

            if (error || !roleData) {
              toast({
                title: "Access Denied",
                description: "You don't have admin or agent privileges.",
                variant: "destructive"
              });
              await supabase.auth.signOut();
              setUserRole(null);
            } else {
              setUserRole(roleData.role);
            }
            setLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check user role
        setTimeout(async () => {
          const { data: roleData, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .in('role', ['admin', 'agent'])
            .single();

          if (error || !roleData) {
            toast({
              title: "Access Denied",
              description: "You don't have admin or agent privileges.",
              variant: "destructive"
            });
            await supabase.auth.signOut();
            setUserRole(null);
          } else {
            setUserRole(roleData.role);
          }
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !userRole) {
    return <AdminLogin />;
  }

  return <AdminDashboard user={user} userRole={userRole as 'admin' | 'agent'} />;
}