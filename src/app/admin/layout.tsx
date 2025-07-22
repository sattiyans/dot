"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, LogOut, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
// REMOVE: import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    // Use SPA supabase client for sign out
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-black border-b border-white/10 px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8">
              {/* Animated White Circle - Same as chatbot widget */}
              <div className="flex items-center justify-center w-full h-full relative">
                {/* Pulse Ring Animation */}
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20"></div>
                <div className="absolute inset-1 rounded-full bg-white animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-2 rounded-full bg-white animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
                {/* Main Circle */}
                <div className="relative w-5 h-5 bg-white rounded-full shadow-inner"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-white group-hover:text-white/80 transition-colors duration-300">
              Dot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/admin">
              <Button variant="ghost" className={`${pathname === '/admin' ? 'text-white bg-white/10 border-white/20' : 'text-white/60 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'} border transition-all duration-200`}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="ghost" className={`${pathname === '/account' ? 'text-white bg-white/10 border-white/20' : 'text-white/60 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'} border transition-all duration-200`}>
                <User className="mr-2 h-4 w-4" />
                Account
              </Button>
            </Link>
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="text-white/60 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col space-y-2">
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className={`w-full justify-start ${pathname === '/admin' ? 'text-white bg-white/10 border-white/20' : 'text-white/60 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'} border transition-all duration-200`}>
                  <LayoutDashboard className="mr-3 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className={`w-full justify-start ${pathname === '/account' ? 'text-white bg-white/10 border-white/20' : 'text-white/60 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'} border transition-all duration-200`}>
                  <User className="mr-3 h-4 w-4" />
                  Account
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                variant="ghost" 
                className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
