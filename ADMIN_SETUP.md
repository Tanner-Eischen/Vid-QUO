# Admin Account Setup Guide

This guide explains how to create and manage admin accounts in your VID-QUO application.

## Overview

Admin accounts have elevated permissions to:
- View all quotes from all users
- Access the admin dashboard with system-wide statistics
- Manage and update any quote in the system
- View all user profiles and activity

## Your Admin Account Has Been Created!

**Good news:** Your existing account has already been promoted to admin!

- **Email:** tannereischen@gmail.com
- **Role:** Admin
- **Status:** Active

### To Access the Admin Dashboard:

1. **Log out** of your application if you're currently logged in
2. **Log back in** with your credentials (tannereischen@gmail.com)
3. You'll now see the **Admin Dashboard** with full system access

That's it! You now have admin privileges.

---

## Creating Additional Admin Accounts (Future Reference)

If you need to create more admin accounts later, follow these steps:

### Option 1: Promote an Existing User

If someone has already signed up through the application:

1. Ask your developer to run this SQL command in Supabase:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';
   ```

2. The user must log out and log back in to see admin access

### Option 2: Create a New Admin Account

1. Have the new admin sign up normally through your application
2. After signup, use Option 1 above to promote their account to admin
3. They log out and log back in to activate admin privileges

---

## Useful Information

### Database Functions Available

Your database includes these helper functions for admin management:

- `promote_user_to_admin('email')` - Promotes a user to admin
- `demote_admin_to_client('email')` - Removes admin privileges
- `list_all_admins()` - Shows all admin users
- `is_user_admin('email')` - Checks if user is admin

### Verify Admin Accounts

To see all admin users in your system:
```sql
SELECT id, email, full_name, role, created_at
FROM profiles
WHERE role = 'admin';
```

### View All Users and Roles

```sql
SELECT id, email, full_name, role, created_at
FROM profiles
ORDER BY created_at DESC;
```

---

## Troubleshooting

### Admin Dashboard Not Showing After Login

- Make sure you logged out completely before logging back in
- Clear your browser cache and cookies
- Check that your role is 'admin' in the profiles table
- Open browser console (F12) to check for any errors

### Need to Remove Admin Access

To demote an admin back to regular client:
```sql
UPDATE profiles SET role = 'client' WHERE email = 'user@example.com';
```

---

## Security Best Practices

1. Only promote trusted individuals to admin role
2. Use strong, unique passwords for admin accounts
3. Regularly review who has admin access
4. Remove admin privileges when no longer needed
5. Never share admin credentials

---

## Summary

Your first admin account is ready to use! Simply log out and log back in to access the full admin dashboard with system-wide visibility and controls.
