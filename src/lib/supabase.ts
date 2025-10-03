import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MembershipTier = 'member' | 'pro' | 'executive';
export type QuoteTier = 'basic' | 'standard' | 'premium';
export type UserRole = 'admin' | 'client';
export type QuoteStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  membership_tier: MembershipTier;
  role: UserRole;
  company_name: string | null;
  company_logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  user_id: string;
  tier: QuoteTier;
  status: QuoteStatus;
  client_name: string;
  project_start_date: string;
  project_end_date: string;
  production_company_name: string;
  num_deliverables?: number | null;
  avg_length_per_deliverable?: number | null;
  filming_days?: number | null;
  hours_per_day?: number | null;
  num_locations?: number | null;
  miles_from_service_rep?: number | null;
  crew_per_setup?: number | null;
  weight_production_to_profit?: number | null;
  discount?: number | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  content_url: string | null;
  minimum_tier: 'pro' | 'executive';
  created_at: string;
}
