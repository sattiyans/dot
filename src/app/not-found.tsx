import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-white/20 mb-4">404</h1>
          <div className="w-24 h-1 bg-white/20 mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-white/60 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button asChild className="w-full bg-white text-black hover:bg-gray-100 font-semibold">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/account" className="text-white/60 hover:text-white transition-colors">
              Account
            </Link>
            <Link href="/docs" className="text-white/60 hover:text-white transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 