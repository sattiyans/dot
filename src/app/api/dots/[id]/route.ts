import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: dot, error } = await supabase
      .from('dots')
      .select('id, name, position, theme, welcome_message')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching dot:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dot' },
        { status: 500 }
      );
    }

    if (!dot) {
      return NextResponse.json(
        { error: 'Dot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(dot);
  } catch (error) {
    console.error('Error in GET /api/dots/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 