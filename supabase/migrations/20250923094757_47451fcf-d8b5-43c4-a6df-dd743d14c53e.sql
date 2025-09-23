-- Fix the function to have proper search_path configuration
CREATE OR REPLACE FUNCTION assign_admin_role()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'rogersmwangomale@gmail.com' THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (NEW.id, 'admin'::app_role, NEW.id);
    
    -- Create profile for the admin user
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, 'Roger Mwango Male');
  END IF;
  
  RETURN NEW;
END;
$$;