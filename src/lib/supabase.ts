import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications_enabled: boolean;
  auto_save: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFeedback {
  id: string;
  user_id: string;
  page: string;
  rating: number;
  comment: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
  created_at: string;
}

export interface VideoProject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  status: 'processing' | 'completed' | 'failed';
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface UserAnalytics {
  id: string;
  user_id: string;
  event_type: string;
  event_data: any;
  page: string;
  created_at: string;
}
