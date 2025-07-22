import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const { searchParams, origin } = url
    
    console.log('🔐 Auth callback received:', request.url)
    console.log('🔍 All search params:', Object.fromEntries(searchParams.entries()))
    
    // Get the auth code
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/admin'
    
    console.log('🔍 Code present:', !!code, 'Next:', next)
    
    if (!code) {
      console.error('❌ No auth code found')
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    const supabase = await createClient()
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('❌ Auth error:', error.message)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    if (data.session) {
      console.log('✅ Auth successful for:', data.session.user.email)
      console.log('🔄 Redirecting to:', `${origin}${next}`)
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('❌ No session created')
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  } catch (error) {
    console.error('❌ Callback error:', error)
    const { origin } = new URL(request.url)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }
} 