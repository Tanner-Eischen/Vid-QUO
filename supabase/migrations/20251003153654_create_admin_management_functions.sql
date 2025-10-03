/*
  # Admin Account Management Functions

  ## Overview
  This migration provides SQL functions and scripts to create and manage admin accounts.

  ## Functions Added
  
  ### 1. `promote_user_to_admin(user_email text)`
  - Promotes an existing user to admin role by their email address
  - Returns true if successful, false if user not found
  
  ### 2. `demote_admin_to_client(user_email text)`
  - Demotes an admin user back to client role
  - Returns true if successful, false if user not found

  ### 3. `list_all_admins()`
  - Returns a list of all users with admin role
  - Includes id, email, full_name, and created_at

  ## Usage Examples

  ### To promote an existing user to admin:
  ```sql
  SELECT promote_user_to_admin('user@example.com');
  ```

  ### To create a NEW admin account (execute these commands in order):
  ```sql
  -- First, create the auth user (replace with actual email/password)
  -- This must be done through Supabase Auth API or Dashboard
  -- Then run:
  UPDATE profiles 
  SET role = 'admin' 
  WHERE email = 'admin@example.com';
  ```

  ### To list all admins:
  ```sql
  SELECT * FROM list_all_admins();
  ```

  ### To demote an admin:
  ```sql
  SELECT demote_admin_to_client('admin@example.com');
  ```

  ## Security Notes
  1. These functions can only be executed by authenticated users with appropriate database permissions
  2. RLS policies will automatically grant admins access to all quotes
  3. Always verify admin role after promotion using list_all_admins()
*/

-- Function to promote a user to admin role
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email text)
RETURNS boolean AS $$
DECLARE
  user_count integer;
BEGIN
  UPDATE profiles
  SET role = 'admin'
  WHERE email = user_email;
  
  GET DIAGNOSTICS user_count = ROW_COUNT;
  
  IF user_count > 0 THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to demote an admin to client role
CREATE OR REPLACE FUNCTION demote_admin_to_client(user_email text)
RETURNS boolean AS $$
DECLARE
  user_count integer;
BEGIN
  UPDATE profiles
  SET role = 'client'
  WHERE email = user_email;
  
  GET DIAGNOSTICS user_count = ROW_COUNT;
  
  IF user_count > 0 THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to list all admin users
CREATE OR REPLACE FUNCTION list_all_admins()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.email, p.full_name, p.created_at
  FROM profiles p
  WHERE p.role = 'admin'
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is admin
CREATE OR REPLACE FUNCTION is_user_admin(user_email text)
RETURNS boolean AS $$
DECLARE
  admin_role text;
BEGIN
  SELECT role INTO admin_role
  FROM profiles
  WHERE email = user_email;
  
  RETURN admin_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;