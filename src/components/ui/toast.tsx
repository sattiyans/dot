"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "info", onClose, duration = 3000 }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      default:
        return "ℹ";
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-white text-black border-white/30";
      case "error":
        return "bg-white/10 text-white border-white/20";
      default:
        return "bg-white/5 text-white border-white/10";
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg animate-in slide-in-from-right-full ${getStyles()}`}>
      <span className="text-sm font-medium">{getIcon()}</span>
      <p className="text-sm">{message}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-white/60 hover:text-white hover:bg-white/10 p-1 h-auto"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([]);

  const showToast = React.useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
} 