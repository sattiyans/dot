'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const hintTexts = [
  "Ask me anything",
  "What's on your mind?",
  "How can I help?",
  "Tell me about your project",
  "Need assistance?",
  "What would you like to know?",
  "I'm here to help",
  // "Let's chat about Dot",
  // "Curious about AI chatbots?",
  "Ready to explore?",
  "Ask about our services",
  // "Learn more about Dot"
];

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatbotWidgetProps {
  dotId: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  onOpen?: () => void;
  onClose?: () => void;
  showAuth?: boolean;
}

export default function ChatbotWidget({
  dotId,
  position = 'bottom-center',
  onOpen,
  onClose,
  showAuth = false
}: ChatbotWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'none' | 'email' | 'password'>('none');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [isHintVisible, setIsHintVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Hint text rotation effect with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out current hint
      setIsHintVisible(false);
      
      // Change text after fade out
      setTimeout(() => {
        setHintIndex((prev) => (prev + 1) % hintTexts.length);
        setIsHintVisible(true);
      }, 200);
    }, 3000); // Change hint every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleExpand = () => {
    setIsExpanded(true);
    onOpen?.();
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setAuthMode('none');
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
    onClose?.();
  };

  const handleSignIn = () => {
    setAuthMode('email');
    setAuthError('');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      if (authMode === 'email') {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(authEmail)) {
          setAuthError('Please enter a valid email address');
          return;
        }
        setAuthMode('password');
      } else if (authMode === 'password') {
        // Attempt login using Supabase client directly
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) {
          setAuthError(error.message || 'Login failed. Please check your credentials.');
        } else if (data.user) {
          // Login successful, redirect to admin
          window.location.href = '/admin';
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthBack = () => {
    if (authMode === 'password') {
      setAuthMode('email');
      setAuthPassword('');
    } else {
      setAuthMode('none');
      setAuthEmail('');
    }
    setAuthError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dotId,
          message: userMessage.content,
          history: messages.slice(-5)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {isExpanded ? (
        <div className="w-80 flex flex-col animate-in slide-in-from-bottom-2 duration-300 ease-out bg-black/95 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl">
          {/* Chat Messages - Only show when there are messages */}
          {messages.length > 0 && (
            <div className="overflow-y-auto p-4 space-y-3 max-h-80 rounded-t-2xl bg-transparent mb-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 bg-white rounded-full flex-shrink-0 mr-2"></div>
                )}
                <div className={`max-w-xs ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.role === 'user' && (
                    <div className="text-xs text-gray-400 mb-1">You</div>
                  )}
                  <div className={`px-4 py-2.5 ${
                    message.role === 'user' 
                      ? 'bg-white text-black rounded-2xl rounded-br-md shadow-sm' 
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl rounded-bl-md'
                  }`}>
                    <div className="text-sm leading-relaxed">{message.content}</div>
                    <div className={`text-xs mt-1.5 ${
                      message.role === 'user' ? 'text-gray-500' : 'text-white/50'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-white rounded-full flex-shrink-0 mr-2"></div>
                <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-gray-300">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-black rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          )}

          {/* Authentication or Input Field */}
          {authMode !== 'none' ? (
              <form onSubmit={handleAuthSubmit} className="p-3">
                <div className="space-y-3">
                  {authMode === 'email' && (
                    <div>
                      <label className="block text-xs text-white mb-1">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="Enter your email"
                          disabled={isLoading}
                          className="w-full px-4 py-2 pr-20 bg-white text-black placeholder-gray-500 rounded-full focus:outline-none text-sm transition-all duration-300 ease-out focus:ring-2 focus:ring-white/20"
                          autoFocus
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <button
                            type="submit"
                            disabled={isLoading || !authEmail.trim()}
                            className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:bg-gray-400 hover:scale-105"
                          >
                            <span className="text-black text-xs">→</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCollapse}
                            className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200 ease-out hover:bg-gray-400 hover:scale-105"
                          >
                            <span className="text-black text-sm">×</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {authMode === 'password' && (
                    <div>
                      <label className="block text-xs text-white mb-1">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="Enter your password"
                          disabled={isLoading}
                          className="w-full px-4 py-2 pr-20 bg-white text-black placeholder-gray-500 rounded-full focus:outline-none text-sm transition-all duration-300 ease-out focus:ring-2 focus:ring-white/20"
                          autoFocus
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <button
                            type="submit"
                            disabled={isLoading || !authPassword.trim()}
                            className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:bg-gray-400 hover:scale-105"
                          >
                            <span className="text-black text-xs">→</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleAuthBack}
                            className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200 ease-out hover:bg-gray-400 hover:scale-105"
                          >
                            <span className="text-black text-xs">←</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCollapse}
                            className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200 ease-out hover:bg-gray-400 hover:scale-105"
                          >
                            <span className="text-black text-sm">×</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {authError && (
                    <div className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded">
                      {authError}
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 pt-0">
                <div className="space-y-3">
                  {showAuth && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleSignIn}
                        className="mt-2 w-32 px-3 py-1.5 bg-white text-black rounded-full text-xs font-medium transition-all duration-200 ease-out hover:bg-gray-100 flex items-center justify-center gap-1"
                      >
                        <Mail className="h-3 w-3" />
                        Get started
                      </button>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type a message..."
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-20 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 rounded-full focus:outline-none text-sm transition-all duration-300 ease-out focus:ring-2 focus:ring-white/30 focus:border-white/30"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:bg-white/30 hover:scale-105"
                      >
                        <Send className="h-3 w-3 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCollapse}
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center transition-all duration-200 ease-out hover:bg-white/30 hover:scale-105"
                      >
                        <span className="text-white text-sm">×</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
        </div>
      ) : (
        <div className="relative">
          {/* Dynamic Hint Text with Arrow - only show when not expanded */}
          {!isExpanded && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-center">
              {/* Pill-shaped hint text */}
              <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-2 transition-all duration-300 ${isHintVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="text-sm text-white/90 font-medium whitespace-nowrap">
                  {hintTexts[hintIndex]}
                </div>
              </div>
              {/* Arrow pointing down to the circle */}
              <div className="flex justify-center">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white/50 animate-bounce"
                >
                  <path 
                    d="M7 10l5 5 5-5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}
          
          <button
            onClick={handleExpand}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-300 ease-out animate-pulse hover:shadow-xl"
          >
            {/* <Bot className="h-5 w-5 text-black" /> */}
          </button>
        </div>
      )}
    </div>
  );
}
