/*
  # VID-QUO Platform Database Schema

  ## Overview
  This migration creates the complete database schema for the VID-QUO quote platform with role-based access control.

  ## New Tables
  
  ### 1. `profiles`
  - Extends auth.users with additional user information
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `membership_tier` (text) - 'member', 'pro', or 'executive'
  - `company_name` (text)
  - `company_logo_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `quotes`
  - Stores all generated quotes
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `tier` (text) - 'basic', 'standard', or 'premium'
  - `client_name` (text)
  - `project_start_date` (date)
  - `project_end_date` (date)
  - `production_company_name` (text)
  - Standard tier fields (deliverables, filming days, etc.)
  - Premium tier fields (crew, weight, discount)
  - `total_amount` (numeric)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `courses`
  - Online course library
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `content_url` (text)
  - `minimum_tier` (text) - 'pro' or 'executive'
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Profiles: Users can only read/update their own profile
  - Quotes: Users can only access their own quotes
  - Courses: Users can only access courses for their membership tier or lower

  ## Notes
  1. All timestamp fields use `timestamptz` for timezone awareness
  2. Membership tiers are enforced through RLS policies
  3. Company logo upload restricted to Pro and Executive members
  4. PDF export functionality controlled at application level based on membership tier
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  membership_tier text NOT NULL DEFAULT 'member' CHECK (membership_tier IN ('member', 'pro', 'executive')),
  company_name text,
  company_logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('basic', 'standard', 'premium')),
  
  -- Basic tier fields (required for all quotes)
  client_name text NOT NULL,
  project_start_date date NOT NULL,
  project_end_date date NOT NULL,
  production_company_name text NOT NULL,
  
  -- Standard tier fields
  num_deliverables integer CHECK (num_deliverables >= 1 AND num_deliverables <= 7),
  avg_length_per_deliverable integer CHECK (avg_length_per_deliverable >= 0 AND avg_length_per_deliverable <= 50),
  filming_days integer CHECK (filming_days >= 1 AND filming_days <= 7),
  hours_per_day integer CHECK (hours_per_day >= 1 AND hours_per_day <= 12),
  num_locations integer CHECK (num_locations >= 1 AND num_locations <= 7),
  miles_from_service_rep integer CHECK (miles_from_service_rep >= 0 AND miles_from_service_rep <= 300),
  
  -- Premium tier fields
  crew_per_setup integer CHECK (crew_per_setup >= 1 AND crew_per_setup <= 7),
  weight_production_to_profit integer CHECK (weight_production_to_profit >= 40 AND weight_production_to_profit <= 80),
  discount integer DEFAULT 0 CHECK (discount >= 0 AND discount <= 20),
  
  -- Calculated fields
  total_amount numeric(10, 2) NOT NULL,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_url text,
  minimum_tier text NOT NULL CHECK (minimum_tier IN ('pro', 'executive')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Quotes RLS Policies
CREATE POLICY "Users can view own quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quotes"
  ON quotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quotes"
  ON quotes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Courses RLS Policies
CREATE POLICY "Pro users can view pro courses"
  ON courses FOR SELECT
  TO authenticated
  USING (
    minimum_tier = 'pro' AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.membership_tier IN ('pro', 'executive')
    )
  );

CREATE POLICY "Executive users can view executive courses"
  ON courses FOR SELECT
  TO authenticated
  USING (
    minimum_tier = 'executive' AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.membership_tier = 'executive'
    )
  );

-- Insert sample courses
INSERT INTO courses (title, description, minimum_tier) VALUES
  ('Individual Pricing Self Assessment and Coaching (IPSA)', 'Learn how to assess and optimize your individual pricing strategy with expert coaching.', 'pro'),
  ('Maximizing Vid-Quo Use', 'Get the most out of the Vid-Quo platform with advanced tips and techniques.', 'pro'),
  ('Building Out Your Retainer', 'Master the math and forecasting behind building sustainable retainer relationships.', 'pro'),
  ('Retainer Calculator Advanced Training', 'Deep dive into the retainer calculator for executive members.', 'executive');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();