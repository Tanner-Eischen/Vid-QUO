# Admin Account Setup Guide

This guide explains how to create and manage admin accounts in your VID-QUO application.

## Overview

Admin accounts have elevated permissions to:
- View all quotes from all users
- Access the admin dashboard with system-wide statistics
- Manage and update any quote in the system
- View all user profiles and activity

## Method 1: Promote an Existing User to Admin

If you already have a user account created through the normal signup process, you can promote it to admin role.

### Steps:

1. **Access Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor (in the left sidebar)

2. **Execute the Promotion Command**
   ```sql
   SELECT promote_user_to_admin('user@example.com');
   ```

   Replace `user@example.com` with the actual email address of the user you want to promote.

3. **Verify the Promotion**
   ```sql
   SELECT * FROM list_all_admins();
   ```

   This will show all admin users in the system.

## Method 2: Create a New Admin Account from Scratch

To create a brand new admin account:

### Steps:

1. **Sign Up Through the Application**
   - Go to your application's login page
   - Click "Sign Up" and create a new account with your desired admin credentials
   - Complete the signup process

2. **Promote to Admin via SQL**
   - Go to Supabase Dashboard → SQL Editor
   - Run the promotion command:
   ```sql
   SELECT promote_user_to_admin('newadmin@example.com');
   ```

3. **Log Out and Log Back In**
   - Sign out from the application
   - Sign back in with your admin credentials
   - You should now see the Admin Dashboard

## Method 3: Direct Database Insert (Advanced)

For your very first admin account, you can create it directly in the database:

### Steps:

1. **Create Auth User via Supabase Dashboard**
   - Go to Authentication → Users
   - Click "Add User"
   - Enter email and password
   - Click "Create User"
   - Copy the user ID from the users table

2. **Create Profile with Admin Role**
   ```sql
   INSERT INTO profiles (id, email, full_name, role)
   VALUES (
     'user-id-from-step-1',
     'admin@example.com',
     'Admin Name',
     'admin'
   );
   ```

## Useful SQL Commands

### List All Admin Users
```sql
SELECT * FROM list_all_admins();
```

### Check if a User is Admin
```sql
SELECT is_user_admin('user@example.com');
```

### Demote an Admin to Client
```sql
SELECT demote_admin_to_client('admin@example.com');
```

### View All Users and Their Roles
```sql
SELECT id, email, full_name, role, created_at
FROM profiles
ORDER BY created_at DESC;
```

### Count Admins and Clients
```sql
SELECT
  role,
  COUNT(*) as count
FROM profiles
GROUP BY role;
```

## Quick Start: Create Your First Admin

**Recommended Approach** (Easiest):

1. Open your application and sign up with your admin email
2. Go to Supabase Dashboard → SQL Editor
3. Run: `SELECT promote_user_to_admin('your-email@example.com');`
4. Verify: `SELECT * FROM list_all_admins();`
5. Refresh your application and you'll see the Admin Dashboard

## Troubleshooting

### Admin Dashboard Not Showing
- Verify your role is set to 'admin' in the profiles table
- Log out and log back in to refresh your session
- Check browser console for any errors

### Promotion Function Not Working
- Ensure the user exists in the profiles table
- Check that the email address is exactly correct (case-sensitive)
- Verify the migration was applied successfully

### Multiple Admins
You can have as many admin accounts as needed. Simply repeat the promotion process for each user.

## Security Best Practices

1. Only promote trusted users to admin role
2. Regularly audit admin accounts using `list_all_admins()`
3. Use strong passwords for admin accounts
4. Consider demoting users who no longer need admin access
5. Keep a log of who has admin privileges

## Support

If you encounter any issues, check the Supabase logs or contact your system administrator.
