-- Create a function to automatically assign admin role to the specified email
CREATE OR REPLACE FUNCTION assign_admin_role()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign admin role on user creation
CREATE TRIGGER auto_assign_admin_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_admin_role();