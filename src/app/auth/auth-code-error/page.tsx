import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
          <div className="w-24 h-1 bg-white/20 mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <p className="text-white/60 leading-relaxed">
            There was an issue with your authentication link. This could be because:
          </p>
          <ul className="text-sm text-white/60 space-y-2 text-left">
            <li>• The link has expired</li>
            <li>• The link was already used</li>
            <li>• There was a temporary server issue</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button asChild className="w-full bg-white text-black hover:bg-gray-100 font-semibold">
            <Link href="/">
              <Mail className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-white/40">
            If you continue to have issues, please contact support at{' '}
            <a href="mailto:support@d0t.my" className="text-white/60 hover:text-white underline">
              support@d0t.my
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 