import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'admin' | 'client';
export type QuoteStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  company_name: string | null;
  company_logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  user_id: string;
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

