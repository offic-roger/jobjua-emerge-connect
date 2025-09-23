-- Add missing RLS policies only (don't modify the has_role function)

-- Profiles policies (add insert policy)
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

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