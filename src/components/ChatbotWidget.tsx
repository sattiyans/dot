'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotWidget() {
  // If you have a User type from Supabase, use it. Otherwise, use unknown or a minimal type.
  const { showToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);



  // Show suggestions when expanded and no messages
  useEffect(() => {
    if (isExpanded && messages.length === 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [isExpanded, messages.length]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Scroll to bottom when chat expands
  useEffect(() => {
    if (isExpanded && messages.length > 0) {
      // Small delay to ensure the DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isExpanded, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Our chatbot learns from your website content and provides intelligent responses.",
        "Dot can be embedded on any website with just a few lines of code. It's that simple!",
        "We use advanced AI to understand your content and answer questions accurately.",
        "The chatbot works 24/7 and never gets tired. Perfect for customer support!",
        "You can customize the appearance and behavior to match your brand perfectly.",
        "Our service includes content scraping, FAQ management, and analytics.",
        "Start with a free trial and see the difference Dot can make for your website."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleEmailSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;
    const email = inputValue.trim();
    setPendingEmail(email);
    setInputValue('');
    setIsEmailMode(false);
    setIsPasswordMode(true);
    // Show the entered email as a user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: email,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    // Add AI message asking for password
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "Thanks! Now please enter your password.",
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handlePasswordSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;
    const password = inputValue.trim();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: pendingEmail, password });
      if (error) {
        const aiMessage = {
          id: (Date.now() + 6).toString(),
          text: `Failed to sign in: ${error.message}`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        showToast('Failed to sign in. Please try again.', 'error');
        setIsLoading(false);
        return;
      }
      // Success: continue as before
      // Add user message (mask password)
      const userMessage = {
        id: Date.now().toString(),
        text: '*'.repeat(password.length),
        isUser: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(false);
      setIsPasswordMode(false);
      setPendingEmail('');
      showToast('Sign in successful!', 'success');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } catch (error) {
      console.log('Unexpected error in handlePasswordSubmit:', error);
      showToast('Failed to sign in. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isEmailMode) {
        handleEmailSubmit();
      } else if (isPasswordMode) {
        handlePasswordSubmit();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleDotClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setInputValue('');
    setIsEmailMode(false);
    setPendingEmail('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'email') {
      setIsEmailMode(true);
      setShowSuggestions(false);
      // Add AI message asking for email only
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: "Great! Please enter your email address to sign in or register.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      setInputValue(suggestion);
      setTimeout(() => {
        handleSendMessage();
      }, 100);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">


      {/* Suggestions - Only show when no messages */}
      {showSuggestions && messages.length === 0 && (
        <div className="mb-3 flex justify-center">
          <button
            onClick={() => handleSuggestionClick('email')}
            className="bg-white text-black px-3 py-1.5 rounded-full shadow-lg text-xs font-medium hover:bg-gray-100 transition-colors flex items-center space-x-1"
          >
            <Mail className="h-3 w-3" />
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* Message History - Above Input with Fade and Scroll */}
      {isExpanded && messages.length > 0 && (
        <div className="mb-3 max-w-xs mx-auto relative">
          {/* Fade Background */}
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg backdrop-blur-sm"></div>
          
          {/* Scrollable Messages */}
          <div className="relative max-h-80 overflow-y-auto rounded-lg">
            <div className="p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                {!message.isUser && (
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full shadow-inner"></div>
                  </div>
                )}
                
                {/* Message Bubble */}
                <div
                  className={`text-xs px-3 py-2 rounded-lg max-w-[70%] ${
                    message.isUser
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-gray-200 text-black shadow-sm'
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-2">
                {/* Dot Avatar */}
                <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full shadow-inner"></div>
                </div>
                
                {/* Loading Message */}
                <div className="bg-gray-200 text-black px-3 py-2 rounded-lg shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible div for auto-scroll */}
            <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Loading State - Above Input */}
      {isExpanded && isLoading && messages.length === 0 && (
        <div className="mb-3 flex justify-center">
          <div className="bg-gray-200 text-black px-3 py-2 rounded-lg shadow-sm">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Widget - Animated Container */}
      <div className="flex flex-col items-center">
        <div 
          className={`
            transition-all duration-500 ease-in-out
            ${isExpanded 
              ? 'w-80 max-w-[90vw] bg-white text-black rounded-full shadow-lg px-4 py-2' 
              : 'w-10 h-10 bg-white text-black rounded-full shadow-lg hover:shadow-xl'
            }
            flex items-center justify-center cursor-pointer
          `}
          onClick={!isExpanded ? handleDotClick : undefined}
        >
          {!isExpanded ? (
            /* Animated White Circle */
            <div className="flex items-center justify-center w-full h-full relative">
              {/* Pulse Ring Animation */}
              <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20"></div>
              <div className="absolute inset-1 rounded-full bg-white animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-2 rounded-full bg-white animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
              
              {/* Main Circle */}
              <div className="relative w-5 h-5 bg-white rounded-full shadow-inner"></div>
            </div>
          ) : (
            /* Expanded Input */
            <div className="flex items-center space-x-2 w-full">
              <input
                type={isEmailMode ? "email" : isPasswordMode ? "password" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isEmailMode ? "Enter your email..." : 
                  isPasswordMode ? "Enter your password..." : 
                  "Type a message..."
                }
                className="flex-1 bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm"
                disabled={isLoading}
                autoFocus
                style={{ fontSize: '16px' }} // Prevents zoom on mobile
              />
              {isLoading ? (
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              ) : (
                <button
                  onClick={
                    isEmailMode ? handleEmailSubmit : 
                    isPasswordMode ? handlePasswordSubmit : 
                    handleSendMessage
                  }
                  disabled={!inputValue.trim()}
                  className="bg-black text-white rounded-full p-1.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <span className="text-base">×</span>
              </button>
            </div>
          )}
        </div>
        

      </div>
    </div>
  );
}
