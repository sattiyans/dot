import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/components/ui/toast';
import ChatbotWidget from '@/components/ChatbotWidget';

export const metadata: Metadata = {
  title: "Dot",
  description: "Your AI Chatbot for any website.",
};

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          {children}
          <ChatbotWidget />
        </ToastProvider>
      </body>
    </html>
  );
}
