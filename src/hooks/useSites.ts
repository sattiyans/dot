'use client'

import { useState, useEffect, useCallback } from 'react'
import { Tables, Inserts, Updates } from '@/lib/supabase'
import { useToast } from '@/components/ui/toast'

type Site = Tables<'sites'>

export function useSites() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  // Fetch all sites
  const fetchSites = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/sites')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sites')
      }
      
      setSites(data.sites || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sites'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  // Create a new site
  const createSite = useCallback(async (siteData: Omit<Inserts<'sites'>, 'user_id'>) => {
    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create site')
      }
      
      setSites(prev => [data.site, ...prev])
      showToast('Site created successfully!', 'success')
      return data.site
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create site'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [showToast])

  // Update a site
  const updateSite = useCallback(async (id: string, updates: Partial<Updates<'sites'>>) => {
    try {
      const response = await fetch(`/api/sites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update site')
      }
      
      setSites(prev => prev.map(site => 
        site.id === id ? { ...site, ...data.site } : site
      ))
      showToast('Site updated successfully!', 'success')
      return data.site
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update site'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [showToast])

  // Delete a site
  const deleteSite = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/sites/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete site')
      }
      
      setSites(prev => prev.filter(site => site.id !== id))
      showToast('Site deleted successfully!', 'success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete site'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [showToast])

  // Get a specific site
  const getSite = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/sites/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch site')
      }
      
      return data.site
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch site'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [showToast])

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