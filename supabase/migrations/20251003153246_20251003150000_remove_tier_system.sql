/*
  # Remove Tier System

  ## Changes
  1. Remove `membership_tier` column from `profiles` table
  2. Remove `tier` column from `quotes` table
  3. Drop `courses` table (tier-based feature)
  4. Update RLS policies to remove tier-based restrictions

  ## Security
  - Maintains existing RLS policies for profiles and quotes
  - Removes course-related policies
*/

-- Drop courses table and its policies
DROP POLICY IF EXISTS "Pro users can view pro courses" ON courses;
DROP POLICY IF EXISTS "Executive users can view executive courses" ON courses;
DROP TABLE IF EXISTS courses;

-- Remove tier column from quotes table
ALTER TABLE quotes DROP COLUMN IF EXISTS tier;

-- Remove membership_tier column from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS membership_tier;
