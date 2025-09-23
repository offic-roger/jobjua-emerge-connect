-- Create admin dashboard database structure
-- 1. User roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'agent', 'user');

-- 2. Job categories
CREATE TYPE public.job_category AS ENUM ('normal', 'vip', 'quick_gig', 'verified');

-- 3. Job status
CREATE TYPE public.job_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'expired');

-- 4. Payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected', 'failed');

-- 5. Payment methods
CREATE TYPE public.payment_method AS ENUM ('vodacom', 'tigo', 'halotel', 'airtel', 'mpesa');

-- 6. User profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone_number TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    vip_expires_at TIMESTAMP WITH TIME ZONE,
    is_suspended BOOLEAN DEFAULT FALSE,
    suspension_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 8. Jobs table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    category job_category NOT NULL DEFAULT 'normal',
    status job_status NOT NULL DEFAULT 'draft',
    company_name TEXT,
    company_logo_url TEXT,
    requirements TEXT[],
    benefits TEXT[],
    contact_email TEXT,
    contact_phone TEXT,
    posted_by UUID REFERENCES auth.users(id) NOT NULL,
    approved_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Job applications table
CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'viewed', 'shortlisted', 'interviewed', 'hired', 'rejected')),
    cover_letter TEXT,
    resume_url TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- 10. VIP subscriptions table
CREATE TABLE public.vip_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_reference TEXT,
    status payment_status NOT NULL DEFAULT 'pending',
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Agent regions table
CREATE TABLE public.agent_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    region_name TEXT NOT NULL,
    assigned_by UUID REFERENCES auth.users(id) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, region_name)
);

-- 12. VIP content table (tips, discounts, motivational posts)
CREATE TABLE public.vip_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT CHECK (content_type IN ('tip', 'discount', 'motivation')) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Admin notifications table
CREATE TABLE public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Admins can manage all user roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Jobs policies
CREATE POLICY "Everyone can view approved jobs" ON public.jobs
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins and agents can view all jobs" ON public.jobs
    FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Admins and agents can create jobs" ON public.jobs
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Admins and agents can update jobs" ON public.jobs
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

-- Job applications policies
CREATE POLICY "Users can view their own applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON public.job_applications
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- VIP subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON public.vip_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON public.vip_subscriptions
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- VIP content policies
CREATE POLICY "Everyone can view active VIP content" ON public.vip_content
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage VIP content" ON public.vip_content
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Admin notifications policies
CREATE POLICY "Admins can view all notifications" ON public.admin_notifications
    FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vip_subscriptions_updated_at BEFORE UPDATE ON public.vip_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vip_content_updated_at BEFORE UPDATE ON public.vip_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();