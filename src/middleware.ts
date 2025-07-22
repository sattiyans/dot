import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin and /account
  if (!user && (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/account'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect authenticated users from / to /admin
  if (user && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 