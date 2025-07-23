"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useDots } from '@/hooks/useDots';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Globe, MessageSquare, Activity, Brain, X, Check, Copy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import type { Dot } from '@/hooks/useDots';

export default function AdminDashboard() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { dots, loading: dotsLoading, createDot, updateDot, deleteDot, fetchDots } = useDots();
  const [isAddDotModalOpen, setIsAddDotModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dotToDelete, setDotToDelete] = useState<Dot | null>(null);
  const [selectedDot, setSelectedDot] = useState<Dot | null>(null);
  const [copied, setCopied] = useState(false);
  const [scrapingDots, setScrapingDots] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', domain: '' });
  const [settingsForm, setSettingsForm] = useState({
    theme: 'dark',
    size: 'medium',
    position: 'bottom-center',
    animation: 'pulse',
    autoOpen: false,
    soundEnabled: true,
    typingIndicator: true,
          aiModel: 'gpt-3.5-turbo', // Free tier compatible model
    temperature: '0.7',
    context: '',
    welcomeMessage: 'Hi! I\'m your Dot assistant. Ask me anything about our company, products, or services.',
    aiInstructions: 'Focus on extracting information about our products, services, pricing, and how we help customers. Pay special attention to our unique value propositions and key differentiators.'
  });
  const { showToast } = useToast();
  const addDotModalRef = useRef<HTMLDivElement>(null);
  const settingsModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email ?? '' });
        } else {
          // If no session, try to get user directly
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user ? { id: user.id, email: user.email ?? '' } : null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAddDotModalOpen && addDotModalRef.current) {
      addDotModalRef.current.focus();
    }
  }, [isAddDotModalOpen]);

  useEffect(() => {
    if (isSettingsModalOpen && settingsModalRef.current) {
      settingsModalRef.current.focus();
    }
  }, [isSettingsModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Please log in to access the admin dashboard.</div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Dots', value: dots.length.toString(), icon: Globe },
    { title: 'Conversations', value: dots.reduce((sum, dot) => sum + dot.total_chats, 0).toString(), icon: MessageSquare },
    { title: 'Avg Accuracy', value: dots.length > 0 ? Math.round(dots.reduce((sum, dot) => sum + dot.accuracy, 0) / dots.length).toString() + '%' : '0%', icon: Brain },
  ];

  const aiInsights = [
    { title: 'Most Common Questions', value: 'Product pricing', trend: '+15% this week' },
    { title: 'Response Accuracy', value: '94.2%', trend: 'Above average' },
    { title: 'Peak Usage Time', value: '2-4 PM', trend: 'Consistent pattern' },
    { title: 'AI Learning Rate', value: 'High', trend: 'Improving daily' },
  ];

  const recentActivity = [
    { id: 1, type: 'chat', message: 'New conversation started on My Company Website', time: '2 min ago', dot: 'mycompany.com' },
    { id: 2, type: 'accuracy', message: 'AI accuracy improved to 94%', time: '15 min ago', dot: 'mycompany.com' },
    { id: 3, type: 'user', message: 'New user registered', time: '1 hour ago', dot: 'myblog.com' },
    { id: 4, type: 'chat', message: 'Complex query resolved successfully', time: '2 hours ago', dot: 'myblog.com' },
  ];

  const handleCopyCode = async () => {
    const embedCode = `<!-- Dot AI Assistant -->
<script src="https://cdn.d0t.my/dot.js" defer></script>
<script>
  window.DOT_CHATBOT = {
    dotId: '${selectedDot?.id}',
    theme: '${settingsForm.theme}',
    position: '${settingsForm.position}',
    welcomeMessage: '${settingsForm.welcomeMessage.replace(/'/g, "\\'")}'
  };
</script>`;
    
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      showToast('Embed code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      showToast('Failed to copy code. Please try again.', 'error');
    }
  };

  const openSettingsModal = (dot: Dot) => {
    setSelectedDot(dot);
    // Initialize settings form with current dot settings
    setSettingsForm({
      theme: dot.theme || 'dark',
      size: dot.size || 'medium',
      position: dot.position || 'bottom-center',
      animation: dot.animation || 'pulse',
      autoOpen: dot.auto_open || false,
      soundEnabled: dot.sound_enabled || true,
      typingIndicator: dot.typing_indicator || true,
              aiModel: 'gpt-3.5-turbo', // Free tier compatible model
      temperature: dot.temperature?.toString() || '0.7',
      context: dot.context || '',
      welcomeMessage: dot.welcome_message || 'Hi! I\'m your Dot assistant. Ask me anything about our company, products, or services.',
      aiInstructions: dot.ai_instructions || 'Focus on extracting information about our products, services, pricing, and how we help customers. Pay special attention to our unique value propositions and key differentiators.'
    });
    setIsSettingsModalOpen(true);
  };

  const handleSettingsChange = (field: string, value: string | boolean | number) => {
    setSettingsForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    if (!selectedDot) return;
    
    // Validate welcome message
    if (!settingsForm.welcomeMessage.trim()) {
      showToast('Welcome message cannot be empty', 'error');
      return;
    }

    if (settingsForm.welcomeMessage.length > 500) {
      showToast('Welcome message must be less than 500 characters', 'error');
      return;
    }

    // Validate temperature
    const temp = parseFloat(settingsForm.temperature);
    if (isNaN(temp) || temp < 0 || temp > 2) {
      showToast('Temperature must be between 0 and 2', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
          await updateDot(selectedDot.id, {
      theme: settingsForm.theme,
      size: settingsForm.size,
      position: settingsForm.position,
      animation: settingsForm.animation,
      auto_open: settingsForm.autoOpen,
      sound_enabled: settingsForm.soundEnabled,
      typing_indicator: settingsForm.typingIndicator,
              ai_model: 'gpt-3.5-turbo', // Free tier compatible model
      temperature: parseFloat(settingsForm.temperature),
      context: settingsForm.context,
      welcome_message: settingsForm.welcomeMessage,
      ai_instructions: settingsForm.aiInstructions,
    });
      
      showToast('Dot settings saved successfully!', 'success');
      setIsSettingsModalOpen(false);
    } catch {
      showToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDot = async () => {
    if (!user) {
      showToast('Please log in to create a dot', 'error');
      return;
    }

    if (!formData.name || !formData.domain) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Validate name length
    if (formData.name.length < 2) {
      showToast('Dot name must be at least 2 characters long', 'error');
      return;
    }

    if (formData.name.length > 50) {
      showToast('Dot name must be less than 50 characters', 'error');
      return;
    }

    let cleanDomain = formData.domain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    cleanDomain = cleanDomain.replace(/^www\./, '');
    
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(cleanDomain)) {
      showToast('Please enter a valid domain name', 'error');
      return;
    }

    // Check if domain already exists for this user
    const existingDot = dots.find(dot => dot.domain === cleanDomain);
    if (existingDot) {
      showToast('A dot with this domain already exists', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await createDot({
        name: formData.name,
        domain: cleanDomain
      });
      
      setIsAddDotModalOpen(false);
      setFormData({ name: '', domain: '' });
    } catch {
      // Error is already handled by the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDot = async () => {
    if (!dotToDelete) return;
    
    setIsLoading(true);
    try {
      await deleteDot(dotToDelete.id);
      setIsDeleteModalOpen(false);
      setDotToDelete(null);
    } catch {
      // Error is already handled by the hook
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (dot: Dot) => {
    setDotToDelete(dot);
    setIsDeleteModalOpen(true);
  };



  const handleAIAnalyze = async (dot: Dot) => {
    if (!dot.domain) {
      showToast('No domain configured for this dot', 'error');
      return;
    }

    setScrapingDots(prev => new Set(prev).add(dot.id));
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dotId: dot.id,
          url: dot.domain,
          customInstructions: dot.ai_instructions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(`Successfully analyzed website and created ${data.chunksCreated} knowledge chunks!`, 'success');
        // Update the dot status using the updateDot function
        await updateDot(dot.id, {
          setup_status: 'connected',
          updated_at: new Date().toISOString()
        });
        // Refresh dots data to get updated stats
        await fetchDots();
      } else {
        showToast(data.error || 'Failed to analyze website', 'error');
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      showToast('Failed to analyze website. Please try again.', 'error');
    } finally {
      setScrapingDots(prev => {
        const newSet = new Set(prev);
        newSet.delete(dot.id);
        return newSet;
      });
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'pending': return 'bg-yellow-400';
      case 'error': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getSetupStatusColor = (setupStatus: string) => {
    switch (setupStatus) {
      case 'connected': return 'bg-green-400';
      case 'not_connected': return 'bg-yellow-400';
      case 'error': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-white/60 mt-1">Manage your AI assistants</p>
            </div>
            <Button 
              onClick={() => setIsAddDotModalOpen(true)}
              className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Dot
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* AI Insights */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="h-5 w-5" />
                <h3 className="text-lg font-semibold">AI Performance Insights</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-white/60 font-medium">{insight.title}</p>
                      <span className="text-xs text-green-400">{insight.trend}</span>
                    </div>
                    <p className="text-lg font-semibold">{insight.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/60">{activity.time}</span>
                        <span className="text-xs text-white/40">•</span>
                        <span className="text-xs text-white/60">{activity.dot}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dots List */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Your Dots</h2>
          
          {dotsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : dots.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Dots yet</h3>
                <p className="text-white/60 mb-6">Create your first AI assistant to get started</p>
                <Button 
                  onClick={() => setIsAddDotModalOpen(true)}
                  className="bg-white text-black hover:bg-gray-100 font-medium"
                >
                  Create First Dot
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {dots.map((dot) => (
                <div key={dot.id} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg truncate">{dot.name}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(dot.status)}`}></div>
                          <span className="text-sm text-white/60 capitalize">{dot.status}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${getSetupStatusColor(dot.setup_status)}`}></div>
                          <span className="text-sm text-white/60">
                            {dot.setup_status === 'connected' ? 'Connected' : 
                             dot.setup_status === 'not_connected' ? 'Not Setup' : 
                             'Error'}
                          </span>
                        </div>
                      </div>
                      <p className="text-white/60 truncate">{dot.domain}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleAIAnalyze(dot)}
                        className="border-white/20 text-white hover:bg-white/10"
                        disabled={scrapingDots.has(dot.id)}
                        title="AI-powered analysis - understands and structures business information"
                      >
                        {scrapingDots.has(dot.id) ? 'Analyzing...' : 'Analyze'}
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => openSettingsModal(dot)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Settings
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/test-chatbot?dotId=${dot.id}`, '_blank')}
                        className="border-white/20 text-white hover:bg-white/10"
                        title="Test the chatbot"
                      >
                        Test
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => openDeleteModal(dot)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Stats Section */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-white/60 flex-shrink-0">
                      <span className="font-semibold">{dot.total_chats}</span> conversations
                    </span>
                    <span className="text-white/60 flex-shrink-0">
                      <span className="font-semibold">{dot.accuracy}%</span> accuracy
                    </span>
                    <span className="text-white/60 flex-shrink-0">{dot.ai_model}</span>
                    <span className="text-white/60 flex-shrink-0">
                      Last seen: {dot.last_seen ? new Date(dot.last_seen).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Dot Modal */}
      {isAddDotModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setIsAddDotModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsAddDotModalOpen(false)}
          tabIndex={-1}
        >
          <Card ref={addDotModalRef} className="bg-black border border-white/20 w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Create New Dot</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddDotModalOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dotName" className="text-white">Dot Name</Label>
                <Input
                  id="dotName"
                  placeholder="My Company Assistant"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="domain" className="text-white">Domain</Label>
                <Input
                  id="domain"
                  placeholder="mycompany.com"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  className="mt-1 bg-white/5 border-white/20 text-white"
                />
                <p className="text-xs text-white/40 mt-1">You can enter with or without https:// and www.</p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => setIsAddDotModalOpen(false)}
                  variant="ghost"
                  disabled={isLoading}
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddDot}
                  disabled={isLoading}
                  className="flex-1 bg-white text-black hover:bg-gray-100"
                >
                  {isLoading ? 'Creating...' : 'Create Dot'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && selectedDot && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setIsSettingsModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsSettingsModalOpen(false)}
          tabIndex={-1}
        >
          <Card ref={settingsModalRef} className="bg-black border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Dot Settings - {selectedDot.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Basic Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme" className="text-white">Theme</Label>
                    <select
                      id="theme"
                      value={settingsForm.theme}
                      onChange={(e) => handleSettingsChange('theme', e.target.value)}
                      className="mt-1 w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="position" className="text-white">Position</Label>
                    <select
                      id="position"
                      value={settingsForm.position}
                      onChange={(e) => handleSettingsChange('position', e.target.value)}
                      className="mt-1 w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
                    >
                      <option value="bottom-center">Bottom Center</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">AI Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aiModel" className="text-white">AI Model</Label>
                    <input
                      id="aiModel"
                      value="GPT-3.5 Turbo"
                      disabled
                      className="mt-1 w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2 opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature" className="text-white">Creativity</Label>
                    <select
                      id="temperature"
                      value={settingsForm.temperature}
                      onChange={(e) => handleSettingsChange('temperature', e.target.value)}
                      className="mt-1 w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
                    >
                      <option value="0.3">Conservative</option>
                      <option value="0.7">Balanced</option>
                      <option value="1.0">Creative</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="welcomeMessage" className="text-white">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={settingsForm.welcomeMessage}
                    onChange={(e) => handleSettingsChange('welcomeMessage', e.target.value)}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="aiInstructions" className="text-white">AI Analysis Instructions</Label>
                  <Textarea
                    id="aiInstructions"
                    value={settingsForm.aiInstructions}
                    onChange={(e) => handleSettingsChange('aiInstructions', e.target.value)}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    rows={4}
                    placeholder="Custom instructions for AI when analyzing your website..."
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Tell the AI what specific information to focus on when analyzing your website. 
                    For example: "Focus on our pricing plans, customer testimonials, and unique features."
                  </p>
                </div>
              </div>

              {/* Embed Code */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Embed Code</h3>
                <p className="text-sm text-white/60">Add this code to your website&apos;s &lt;head&gt; section to enable your AI assistant.</p>
                <div className="relative">
                  <Textarea
                    value={`<!-- Dot AI Assistant -->
<script src="https://cdn.d0t.my/dot.js" defer></script>
<script>
  window.DOT_CHATBOT = {
    dotId: '${selectedDot?.id}',
    theme: '${settingsForm.theme}',
    position: '${settingsForm.position}',
    welcomeMessage: '${settingsForm.welcomeMessage.replace(/'/g, "\\'")}'
  };
</script>`}
                    readOnly
                    className="bg-white/5 border-white/20 text-white font-mono text-sm"
                    rows={7}
                  />
                  <Button
                    size="sm"
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 bg-white text-black hover:bg-gray-100"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-xs text-white/40 space-y-1">
                  <p>• The assistant will appear as a floating dot on your website</p>
                  <p>• Click the dot to start a conversation</p>
                  <p>• All conversations are automatically saved and analyzed</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => setIsSettingsModalOpen(false)}
                  variant="ghost"
                  disabled={isLoading}
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="flex-1 bg-white text-black hover:bg-gray-100"
                >
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && dotToDelete && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setIsDeleteModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsDeleteModalOpen(false)}
          tabIndex={-1}
        >
          <Card className="bg-black border border-white/20 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Delete Dot</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-white mb-6">Are you sure you want to delete &quot;{dotToDelete.name}&quot;? This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  variant="ghost"
                  disabled={isLoading}
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                                 <Button 
                   onClick={handleDeleteDot}
                   disabled={isLoading}
                   className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                 >
                   {isLoading ? 'Deleting...' : 'Delete Dot'}
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
