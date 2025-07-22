import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch sites for the current user
    const { data: sites, error } = await supabase
      .from('sites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sites:', error)
      return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 })
    }

    return NextResponse.json({ sites })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, domain } = body

    if (!name || !domain) {
      return NextResponse.json({ error: 'Name and domain are required' }, { status: 400 })
    }

    // Check if domain already exists for this user
    const { data: existingSite } = await supabase
      .from('sites')
      .select('id')
      .eq('user_id', user.id)
      .eq('domain', domain)
      .single()

    if (existingSite) {
      return NextResponse.json({ error: 'A site with this domain already exists' }, { status: 400 })
    }

    // Create new site
    const { data: site, error } = await supabase
      .from('sites')
      .insert({
        user_id: user.id,
        name,
        domain,
        status: 'pending',
        setup_status: 'not_connected',
        ai_model: 'GPT-4',
        accuracy: 0,
        response_time: '0s',
        total_chats: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating site:', error)
      return NextResponse.json({ error: 'Failed to create site' }, { status: 500 })
    }

    return NextResponse.json({ site })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 