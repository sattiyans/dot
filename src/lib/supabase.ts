// src/lib/supabase.ts
// TODO: Replace with your Supabase project URL and anon key
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sites: {
        Row: {
          id: string
          user_id: string
          name: string
          domain: string
          status: 'active' | 'inactive' | 'pending'
          setup_status: 'connected' | 'not_connected' | 'pending'
          ai_model: string
          accuracy: number
          response_time: string
          total_chats: number
          last_activity: string
          last_seen: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          domain: string
          status?: 'active' | 'inactive' | 'pending'
          setup_status?: 'connected' | 'not_connected' | 'pending'
          ai_model?: string
          accuracy?: number
          response_time?: string
          total_chats?: number
          last_activity?: string
          last_seen?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          domain?: string
          status?: 'active' | 'inactive' | 'pending'
          setup_status?: 'connected' | 'not_connected' | 'pending'
          ai_model?: string
          accuracy?: number
          response_time?: string
          total_chats?: number
          last_activity?: string
          last_seen?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          site_id: string
          user_ip: string
          user_agent: string
          messages: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_id: string
          user_ip: string
          user_agent: string
          messages?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          user_ip?: string
          user_agent?: string
          messages?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
