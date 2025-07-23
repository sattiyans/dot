'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeftCircle, ArrowLeftIcon, Bot } from 'lucide-react';
import Link from 'next/link';
import ChatbotWidget from '@/components/ChatbotWidget';

interface Dot {
  id: string;
  name: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  theme?: 'dark' | 'light';
  welcome_message?: string;
}

export default function TestChatbotPage() {
  const searchParams = useSearchParams();
  const dotId = searchParams.get('dotId') || 'your-dot-id';
  
  const [dot, setDot] = useState<Dot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDot = async () => {
      try {
        const response = await fetch(`/api/dots/${dotId}`);
        if (response.ok) {
          const dotData = await response.json();
          setDot(dotData);
        }
      } catch (error) {
        console.error('Error fetching dot:', error);
      } finally {
        setLoading(false);
      }
    };

    if (dotId) {
      fetchDot();
    }
  }, [dotId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-white rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Dot details in top-left corner */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <Bot className="h-2 w-2 text-black" />
              </div>
              <span className="text-xs text-white/80 font-medium">{dot?.name || 'Unknown'}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">ID:</span>
                <span className="text-xs text-white/70 font-mono bg-white/5 px-2 py-1 rounded">
                  {dotId}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-white/50">Position:</span>
                  <span className="text-xs text-white/70 capitalize">{dot?.position || 'bottom-center'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-white/50">Theme:</span>
                  <span className="text-xs text-white/70 capitalize">{dot?.theme || 'dark'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal branding in top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <Link href="/admin">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 transition-all duration-200 cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <ArrowLeftIcon className="h-3 w-3 text-black" />
            </div>
            <span className="text-xs text-white/80 font-medium">Go back to Dot</span>
          </div>
        </Link>
      </div>

      {/* Chatbot Widget for Testing */}
      <div className="relative min-h-screen">
        <ChatbotWidget
          dotId={dotId}
          position={dot?.position || 'bottom-center'}
          theme={dot?.theme || 'dark'}
          welcomeMessage={dot?.welcome_message || "Hi! I'm your AI assistant. How can I help you today?"}
          showAuth={false}
        />
      </div>
    </div>
  );
} 