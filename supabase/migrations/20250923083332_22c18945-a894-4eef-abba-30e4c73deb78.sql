-- Fix security linter warnings

-- Add missing RLS policies for tables that don't have complete policy coverage

-- Profiles policies (add insert policy)
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies (add specific policies for agents)
CREATE POLICY "Agents can view user roles in their regions" ON public.user_roles
    FOR SELECT USING (
        public.has_role(auth.uid(), 'agent') AND
        EXISTS (
            SELECT 1 FROM public.agent_regions ar 
            WHERE ar.agent_id = auth.uid()
        )
    );

-- Job applications policies (add insert/update for users)
CREATE POLICY "Users can apply to jobs" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = user_id);

-- VIP subscriptions policies (add insert for users)
CREATE POLICY "Users can create their own subscriptions" ON public.vip_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Agent regions policies
CREATE POLICY "Admins can manage agent regions" ON public.agent_regions
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Agents can view their assigned regions" ON public.agent_regions
    FOR SELECT USING (auth.uid() = agent_id);

-- Admin notifications policies (add insert/update)
CREATE POLICY "Admins can manage notifications" ON public.admin_notifications
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Fix function search path (the update function already has search_path set correctly)
-- The issue might be with the has_role function, let me update it
DROP FUNCTION IF EXISTS public.has_role(_user_id UUID, _role app_role);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;