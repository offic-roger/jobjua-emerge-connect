-- Create a security definer function to check VIP status
CREATE OR REPLACE FUNCTION public.is_vip_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND is_vip = true
      AND (vip_expires_at IS NULL OR vip_expires_at > now())
  )
$$;

-- Drop the existing policy that allows everyone to view VIP content
DROP POLICY "Everyone can view active VIP content" ON public.vip_content;

-- Create new secure policy for VIP content access
CREATE POLICY "Only VIP users can view active VIP content"
ON public.vip_content
FOR SELECT
TO authenticated
USING (is_active = true AND public.is_vip_user());

-- Allow admins to still manage all VIP content (policy already exists, just ensuring it's there)
-- The "Admins can manage VIP content" policy already exists and should remain