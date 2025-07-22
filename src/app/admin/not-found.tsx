import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-white/20 mb-4">404</h1>
          <div className="w-24 h-1 bg-white/20 mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-white mb-4">Admin Page Not Found</h2>
        <p className="text-white/60 mb-8 leading-relaxed">
          The admin page you're looking for doesn't exist. 
          Let's get you back to the dashboard.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button asChild className="w-full bg-white text-black hover:bg-gray-100 font-semibold">
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40 mb-4">Quick Navigation</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/account" className="text-white/60 hover:text-white transition-colors">
              Account
            </Link>
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 