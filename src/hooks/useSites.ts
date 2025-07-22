'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/toast'
import { supabase } from '@/lib/supabase';

export interface Site {
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
}

export function useSites() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  // Fetch all sites
  const fetchSites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('sites').select('*');
      if (error) throw error;
      setSites(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sites';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Create a new site
  const createSite = useCallback(async (siteData: Partial<Site>) => {
    try {
      const { data, error } = await supabase.from('sites').insert([siteData]).select().single();
      if (error) throw error;
      setSites(prev => [data, ...prev]);
      showToast('Site created successfully!', 'success');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create site';
      showToast(errorMessage, 'error');
      throw err;
    }
  }, [showToast]);

  // Update a site
  const updateSite = useCallback(async (id: string, updates: Partial<Site>) => {
    try {
      const { data, error } = await supabase.from('sites').update(updates).eq('id', id).select().single();
      if (error) throw error;
      setSites(prev => prev.map(site => site.id === id ? { ...site, ...data } : site));
      showToast('Site updated successfully!', 'success');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update site';
      showToast(errorMessage, 'error');
      throw err;
    }
  }, [showToast]);

  // Delete a site
  const deleteSite = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('sites').delete().eq('id', id);
      if (error) throw error;
      setSites(prev => prev.filter(site => site.id !== id));
      showToast('Site deleted successfully!', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete site';
      showToast(errorMessage, 'error');
      throw err;
    }
  }, [showToast]);

  // Get a specific site
  const getSite = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase.from('sites').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch site';
      showToast(errorMessage, 'error');
      throw err;
    }
  }, [showToast]);

  // Fetch sites on mount
  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  return {
    sites,
    loading,
    error,
    fetchSites,
    createSite,
    updateSite,
    deleteSite,
    getSite,
  }
} 