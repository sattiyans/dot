'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/toast'
import { supabase } from '@/lib/supabase';

export interface Dot {
  id: string;
  name: string;
  domain: string;
  total_chats: number;
  accuracy: number;
  status: string;
  setup_status: string;
  ai_model: string;
  response_time: string;
  last_seen: string;
  last_activity: string;
  user_id: string;
  // Settings fields
  theme: string;
  size: string;
  position: string;
  animation: string;
  auto_open: boolean;
  sound_enabled: boolean;
  typing_indicator: boolean;
  temperature: number;
  welcome_message: string;
  context: string;
  // AI Analysis fields
  ai_instructions: string;
  created_at: string;
  updated_at: string;
}

export function useDots() {
  const [dots, setDots] = useState<Dot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  // Fetch all dots
  const fetchDots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setDots([]);
        return;
      }
      
      // Fetch dots for the current user
      const { data, error } = await supabase
        .from('dots')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setDots(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dots';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Create a new dot
  const createDot = useCallback(async (dotData: Partial<Dot>) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Ensure user_id is set and add default settings
      const dotDataWithDefaults = { 
        ...dotData, 
        user_id: user.id,
        // Default settings
        theme: 'dark',
        size: 'medium',
        position: 'bottom-center',
        animation: 'pulse',
        auto_open: false,
        sound_enabled: true,
        typing_indicator: true,
        temperature: 0.7,
        welcome_message: 'Hi! I\'m your Dot assistant. Ask me anything about our company, products, or services.',
        context: '',
        ai_instructions: 'Focus on extracting information about our products, services, pricing, and how we help customers. Pay special attention to our unique value propositions and key differentiators.',
        ai_model: 'gpt-3.5-turbo', // Free tier compatible model
        status: 'pending',
        setup_status: 'not_connected',
        total_chats: 0,
        accuracy: 0,
        response_time: '0s',
        last_seen: '',
        last_activity: ''
      };
      
      const { data, error } = await supabase.from('dots').insert([dotDataWithDefaults]).select().single();
      if (error) throw error;
      setDots(prev => [data, ...prev]);
      showToast('Dot created successfully!', 'success');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create dot';
      showToast(errorMessage, 'error');
      throw err;
    }
  }, [showToast]);

  // Update a dot
  const updateDot = useCallback(async (id: string, updates: Partial<Dot>) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Only allow updates to dots owned by the user
      const { data, error } = await supabase
        .from('dots')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      setDots(prev => prev.map(dot => dot.id === id ? { ...dot, ...data } : dot));
      showToast('Dot updated successfully!', 'success');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update dot';
      showToast(errorMessage, 'error');
      throw err;
    }
  }, [showToast]);

  // Delete a dot
  const deleteDot = useCallback(async (id: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Only allow deletion of dots owned by the user
      const { error } = await supabase
        .from('dots')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      setDots(prev => prev.filter(dot => dot.id !== id));
      showToast('Dot deleted successfully!', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete dot';
      showToast(errorMessage, 'error');
      throw err;
    }
  }, [showToast]);

  // Get a specific dot
  const getDot = useCallback(async (id: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Only allow fetching dots owned by the user
      const { data, error } = await supabase
        .from('dots')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dot';
      showToast(errorMessage, 'error');
      throw err;
    }
  }, [showToast]);

  // Fetch dots on mount
  useEffect(() => {
    fetchDots()
  }, [fetchDots])

  return {
    dots,
    loading,
    error,
    fetchDots,
    createDot,
    updateDot,
    deleteDot,
    getDot,
  }
} 