"use client";

import React, { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Globe, MessageCircle, Users, TrendingUp, ArrowRight, X, Copy, Check, Eye, Settings, Sparkles, Code, Activity, Zap, Brain, Target, BarChart3, Clock, Star, Info, Palette, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { useSites } from '@/hooks/useSites';

export default function AdminDashboard() {
  const user = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (user === undefined) return; // still loading
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  if (user === undefined) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-white">Redirecting...</div>;
  }

  const { sites, loading, createSite, updateSite, deleteSite } = useSites();
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', domain: '' });
  const { showToast } = useToast();
  
  // Focus management refs
  const addSiteModalRef = React.useRef<HTMLDivElement>(null);
  const settingsModalRef = React.useRef<HTMLDivElement>(null);

  const stats = [
    { title: 'Total Sites', value: sites.length.toString(), icon: Globe, trend: '+12%', trendUp: true },
    { title: 'AI Conversations', value: sites.reduce((sum, site) => sum + site.total_chats, 0).toString(), icon: MessageCircle, trend: '+23%', trendUp: true },
    { title: 'Active Users', value: '1,234', icon: Users, trend: '+8%', trendUp: true },
    { title: 'AI Accuracy', value: sites.length > 0 ? Math.round(sites.reduce((sum, site) => sum + site.accuracy, 0) / sites.length).toString() + '%' : '0%', icon: Brain, trend: '+2%', trendUp: true },
  ];

  const recentActivity = [
    { id: 1, type: 'chat', message: 'New conversation started on My Company Website', time: '2 min ago', site: 'mycompany.com' },
    { id: 2, type: 'accuracy', message: 'AI accuracy improved to 94%', time: '15 min ago', site: 'mycompany.com' },
    { id: 3, type: 'user', message: 'New user registered', time: '1 hour ago', site: 'myblog.com' },
    { id: 4, type: 'chat', message: 'Complex query resolved successfully', time: '2 hours ago', site: 'myblog.com' },
  ];

  const aiInsights = [
    { title: 'Most Common Questions', value: 'Product pricing', trend: '+15% this week' },
    { title: 'Response Accuracy', value: '94.2%', trend: 'Above average' },
    { title: 'Peak Usage Time', value: '2-4 PM', trend: 'Consistent pattern' },
    { title: 'AI Learning Rate', value: 'High', trend: 'Improving daily' },
  ];

  const handleCopyCode = async () => {
    const embedCode = `<script src="https://cdn.d0t.my/dot.js" defer></script>
<script>
  window.DOT_CHATBOT = {
    siteId: '${selectedSite?.id}',
    welcomeMessage: "Ask me anything about us",
    theme: "dark"
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

  const openSettingsModal = (site: any) => {
    setSelectedSite(site);
    setIsSettingsModalOpen(true);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Dot settings saved successfully!', 'success');
      setIsSettingsModalOpen(false);
    } catch (error) {
      showToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSite = async () => {
    if (!formData.name || !formData.domain) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await createSite({
        name: formData.name,
        domain: formData.domain,
        status: 'pending',
        setup_status: 'not_connected',
        ai_model: 'GPT-4',
        accuracy: 0,
        response_time: '0s',
        total_chats: 0
      });
      
      setIsAddSiteModalOpen(false);
      setFormData({ name: '', domain: '' });
    } catch (error) {
      // Error is already handled by the hook
    } finally {
      setIsLoading(false);
    }
  };

  // Focus management
  React.useEffect(() => {
    if (isAddSiteModalOpen && addSiteModalRef.current) {
      addSiteModalRef.current.focus();
    }
  }, [isAddSiteModalOpen]);

  React.useEffect(() => {
    if (isSettingsModalOpen && settingsModalRef.current) {
      settingsModalRef.current.focus();
    }
  }, [isSettingsModalOpen]);

  return (
    <div className="relative z-10 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 lg:mb-12 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-wider mb-2" style={{ 
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Dashboard
          </h1>
          <p className="text-white/60 font-medium">Monitor and manage your Dots performance</p>
        </div>
        <Button 
          onClick={() => setIsAddSiteModalOpen(true)}
          className="bg-white text-black hover:bg-gray-100 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full lg:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Site
        </Button>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-full bg-white/10 text-white group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant={stat.trendUp ? "default" : "secondary"} className="text-xs bg-white text-black">
                    {stat.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-white/60 font-medium mb-1">{stat.title}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 lg:mb-12">
        <div className="lg:col-span-2">
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="mr-2 h-5 w-5 text-white" />
                Dot Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <p className="text-sm text-white/60 font-medium">{insight.title}</p>
                    <p className="text-lg font-semibold text-white">{insight.value}</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/80">
                    {insight.trend}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="mr-2 h-5 w-5 text-white" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{activity.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-white/60">{activity.time}</span>
                      <span className="text-xs text-white/40">•</span>
                      <span className="text-xs text-white/60">{activity.site}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Sites Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center">
            <Globe className="mr-2 h-5 w-5 text-white" />
            Your Dots
          </h2>
        </div>
        
        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border border-white/10">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-24 mb-3" />
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                            <Skeleton className="h-3 w-12 mx-auto mb-1" />
                            <Skeleton className="h-4 w-8 mx-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sites.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-8 lg:p-12 text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                <Brain className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">No Dots yet</h3>
              <p className="text-white/60 mb-6 lg:mb-8 max-w-md mx-auto text-sm lg:text-base">
                Get started by adding your first website to deploy intelligent Dots
              </p>
              <Button 
                onClick={() => setIsAddSiteModalOpen(true)}
                className="bg-white text-black hover:bg-gray-100 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Dot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sites.map((site) => (
              <Card key={site.id} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-300 group">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-white text-base lg:text-lg">{site.name}</h3>
                        <Badge variant="outline" className="text-xs border-white/30 text-white">
                          {site.status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            site.setup_status === 'connected' ? 'bg-white animate-pulse' : 
                            site.setup_status === 'not_connected' ? 'bg-white/60' : 
                            'bg-white/40'
                          }`}></div>
                          <span className={`text-xs font-medium ${
                            site.setup_status === 'connected' ? 'text-white' : 
                            site.setup_status === 'not_connected' ? 'text-white/60' : 
                            'text-white/40'
                          }`}>
                            {site.setup_status === 'connected' ? 'Connected' : 
                             site.setup_status === 'not_connected' ? 'Not Setup' : 
                             'Error'}
                          </span>
                        </div>
                      </div>
                      <p className="text-white/60 font-medium text-sm lg:text-base mb-3">{site.domain}</p>
                      
                      {/* AI Performance Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-white/60">Dot Accuracy</p>
                          <p className="text-sm font-bold text-white">{site.accuracy}%</p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-white/60">Response Time</p>
                          <p className="text-sm font-bold text-white">{site.response_time}</p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-white/60">Total Chats</p>
                          <p className="text-sm font-bold text-white">{site.total_chats}</p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-white/60">Model</p>
                          <p className="text-sm font-bold text-white">{site.ai_model}</p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-white/60">Last Seen</p>
                          <p className="text-sm font-bold text-white">{site.last_seen}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-white/60">Last Activity</p>
                        <p className="text-sm font-medium text-white">{site.last_activity}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => openSettingsModal(site)}
                          className="bg-white text-black hover:bg-gray-100 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <Settings className="mr-1 h-3 w-3" />
                          Dot Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Site Modal */}
      {isAddSiteModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setIsAddSiteModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsAddSiteModalOpen(false)}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-dot-modal-title"
        >
          <Card ref={addSiteModalRef} className="bg-black border border-white/20 w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle id="add-dot-modal-title" className="text-white flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Add New Dot
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddSiteModalOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="input-group">
              <div className="form-group">
                <Label htmlFor="siteName" className="form-label">Site Name</Label>
                <Input
                  id="siteName"
                  placeholder="My Company Website"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <Label htmlFor="domain" className="form-label">Domain</Label>
                <Input
                  id="domain"
                  placeholder="mycompany.com"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => setIsAddSiteModalOpen(false)}
                  variant="ghost"
                  disabled={isLoading}
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSite}
                  disabled={isLoading}
                  className="flex-1 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Deploy Dot'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}



      {/* Enhanced Settings Modal */}
      {isSettingsModalOpen && selectedSite && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setIsSettingsModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsSettingsModalOpen(false)}
          tabIndex={-1}
        >
          <Card ref={settingsModalRef} className="bg-black border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Dot Settings - {selectedSite.name}
              </CardTitle>
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
              {/* Connection Status */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedSite.setupStatus === 'connected' ? 'bg-white animate-pulse' : 
                    selectedSite.setupStatus === 'not_connected' ? 'bg-white/60' : 
                    'bg-white/40'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {selectedSite.setupStatus === 'connected' ? 'Dot is connected and active' : 
                       selectedSite.setupStatus === 'not_connected' ? 'Dot is not set up on your website' : 
                       'Connection error detected'}
                    </p>
                    <p className="text-xs text-white/60">
                      Last seen: {selectedSite.lastSeen}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs ${
                  selectedSite.setupStatus === 'connected' ? 'border-white/30 text-white' : 
                  selectedSite.setupStatus === 'not_connected' ? 'border-white/20 text-white/60' : 
                  'border-white/10 text-white/40'
                }`}>
                  {selectedSite.setupStatus === 'connected' ? 'Connected' : 
                   selectedSite.setupStatus === 'not_connected' ? 'Not Setup' : 
                   'Error'}
                </Badge>
              </div>

              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  General Settings
                </h3>
                
                <div className="form-group">
                  <Label htmlFor="welcomeMessage" className="form-label">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    placeholder="Hi! I'm your Dot assistant. Ask me anything about our company, products, or services."
                    className="form-textarea"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="dotName" className="form-label">Dot Name</Label>
                  <Input
                    id="dotName"
                    placeholder="My Company Dot"
                    className="form-input"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <Label htmlFor="enabled" className="form-label">Enable Dot</Label>
                    <p className="text-xs text-white/40">Turn your Dot on or off</p>
                  </div>
                  <Switch id="enabled" defaultChecked />
                </div>
              </div>

              {/* Appearance Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Appearance
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="theme" className="form-label">Dot Theme</Label>
                    <select
                      id="theme"
                      defaultValue="dark"
                      className="form-select"
                    >
                      <option value="dark">Dark (Black)</option>
                      <option value="light">Light (White)</option>
                      <option value="auto">Auto (Follows Website)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="size" className="form-label">Dot Size</Label>
                    <select
                      id="size"
                      defaultValue="medium"
                      className="form-select"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="position" className="form-label">Dot Position</Label>
                  <select
                    id="position"
                    defaultValue="bottom-center"
                    className="form-select"
                  >
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                <div className="form-group">
                  <Label htmlFor="animation" className="form-label">Animation Style</Label>
                  <select
                    id="animation"
                    defaultValue="pulse"
                    className="form-select"
                  >
                    <option value="pulse">Pulse</option>
                    <option value="bounce">Bounce</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              {/* Behavior Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  Behavior
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <Label htmlFor="autoOpen" className="form-label">Auto-open on Page Load</Label>
                      <p className="text-xs text-white/40">Automatically open chat when page loads</p>
                    </div>
                    <Switch id="autoOpen" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <Label htmlFor="soundEnabled" className="form-label">Sound Notifications</Label>
                      <p className="text-xs text-white/40">Play sound when new messages arrive</p>
                    </div>
                    <Switch id="soundEnabled" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <Label htmlFor="typingIndicator" className="form-label">Show Typing Indicator</Label>
                      <p className="text-xs text-white/40">Display typing animation when Dot is responding</p>
                    </div>
                    <Switch id="typingIndicator" defaultChecked />
                  </div>
                </div>
              </div>

              {/* AI Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Brain className="mr-2 h-4 w-4" />
                  AI Configuration
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="aiModel" className="form-label">AI Model</Label>
                    <select
                      id="aiModel"
                      defaultValue="gpt-4"
                      className="form-select"
                    >
                      <option value="gpt-4">GPT-4 (Recommended)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <Label htmlFor="temperature" className="form-label">Creativity Level</Label>
                    <select
                      id="temperature"
                      defaultValue="0.7"
                      className="form-select"
                    >
                      <option value="0.3">Conservative</option>
                      <option value="0.7">Balanced</option>
                      <option value="1.0">Creative</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="context" className="form-label">Context Instructions</Label>
                  <Textarea
                    id="context"
                    placeholder="Additional instructions for how your Dot should behave and respond..."
                    className="form-textarea"
                    rows={3}
                  />
                </div>
              </div>

              {/* Embed Code Section */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Code className="mr-2 h-4 w-4" />
                  Embed Code
                </h3>
                
                <div className="form-group">
                  <Label className="form-label">Copy this code and paste it into your website's HTML</Label>
                  <div className="relative">
                    <Textarea
                      value={`<script src="https://cdn.d0t.my/dot.js" defer></script>
<script>
  window.DOT_CHATBOT = {
    siteId: '${selectedSite?.id}',
    position: 'bottom-center',
    theme: 'dark',
    welcomeMessage: "Hi! I'm your Dot assistant. Ask me anything about our company, products, or services.",
    size: 'medium'
  };
</script>`}
                      readOnly
                      className="form-textarea font-mono text-sm h-32"
                    />
                    <Button
                      size="sm"
                      onClick={handleCopyCode}
                      className="absolute top-2 right-2 bg-white text-black hover:bg-gray-100"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    Installation Instructions
                  </h4>
                  <ol className="text-white/60 text-sm space-y-1 list-decimal list-inside">
                    <li>Copy the embed code above</li>
                    <li>Paste it into your website's HTML, preferably before the closing &lt;/body&gt; tag</li>
                    <li>Save and publish your website</li>
                    <li>Your Dot will appear in the configured position</li>
                  </ol>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => setIsSettingsModalOpen(false)}
                  variant="ghost"
                  disabled={isLoading}
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/10"
                >
                  Close
                </Button>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="flex-1 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Dot Settings'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
