"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Building, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Brain,
  Settings
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<{ id: string; email: string; firstName: string; lastName: string; company: string; website: string; phone: string; location: string; bio: string; isOnboarded: boolean; createdAt: string; lastLogin: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    website: '',
    phone: '',
    location: '',
    bio: ''
  });

  // Fetch user and profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user ? { id: userData.user.id, email: userData.user.email ?? '' } : null);
      if (!userData.user) {
        setIsLoading(false);
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', userData.user.id).single();
      if (data) {
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          company: data.company || '',
          website: data.website || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || ''
        });
        setIsOnboarding(!data.isOnboarded);
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (!user) return;
    const updates = {
      ...formData,
      isOnboarded: true,
      id: user.id
    };
    await supabase.from('profiles').upsert(updates);
    setProfile(prev => prev ? { ...prev, ...updates } : null);
    setIsOnboarding(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsSaving(false);
  };

  const isFormValid = formData.firstName.trim() && formData.lastName.trim() && formData.company.trim();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-white">Please log in to access your account.</div>;
  }
  return (
    <div className="relative z-10 p-4 lg:p-8 max-w-4xl mx-auto">
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
              {isOnboarding ? 'Complete Your Profile' : 'Account Settings'}
            </h1>
            <p className="text-white/60 font-medium">
              {isOnboarding 
                ? 'Tell us about yourself to get started with your first Dot'
                : 'Manage your account details and preferences'
              }
            </p>
          </div>
          {isOnboarding && (
            <Badge className="bg-white text-black font-semibold w-full lg:w-auto text-center">
              <Sparkles className="mr-1 h-3 w-3" />
              New User
            </Badge>
          )}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-white" />
                <p className="text-white font-medium">Profile updated successfully!</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="input-group">
                <div className="input-row">
                  <div className="form-group">
                    <Label htmlFor="firstName" className="form-label required-field">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="lastName" className="form-label required-field">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe"
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <Label htmlFor="email" className="form-label">Email Address</Label>
                  <Input
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="form-input bg-white/10"
                  />
                  <p className="text-xs text-white/40 mt-1">Email cannot be changed</p>
                </div>

                <div className="form-group">
                  <Label htmlFor="bio" className="form-label">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                    className="form-textarea"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="input-group">
                <div className="form-group">
                  <Label htmlFor="company" className="form-label required-field">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Your Company Inc."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="website" className="form-label">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="form-input"
                  />
                </div>

                <div className="input-row">
                  <div className="form-group">
                    <Label htmlFor="phone" className="form-label">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="location" className="form-label">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="form-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleSave}
                disabled={!isFormValid || isSaving}
                className="bg-white text-black hover:bg-gray-100 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex-1"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isOnboarding ? 'Complete Setup' : 'Save Changes'}
                  </>
                )}
              </Button>
              
              {!isOnboarding && (
                <Button
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10 border border-white/20"
                >
                  Cancel
                </Button>
              )}
            </div>

            {!isFormValid && (
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-white" />
                    <p className="text-white/80 text-sm">
                      Please fill in all required fields (marked with *) to continue.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Status</span>
                  <Badge className="bg-white text-black font-semibold">
                    {isOnboarding ? 'Setup Required' : 'Active'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Member Since</span>
                  <span className="text-white text-sm">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Last Login</span>
                  <span className="text-white text-sm">
                    {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Your Dots
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Total Dots</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Active Dots</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Total Chats</span>
                  <span className="text-white font-bold">0</span>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Progress */}
            {isOnboarding && (
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Setup Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Profile Complete</span>
                      <span className="text-white text-sm font-medium">
                        {isFormValid ? '100%' : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: isFormValid ? '100%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-white/40">
                    Complete your profile to start creating your first Dot
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
} 