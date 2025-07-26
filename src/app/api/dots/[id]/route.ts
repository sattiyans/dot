import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return error ? null : user;
}

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get authenticated user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First, verify the dot exists and belongs to the user
    const { data: dot, error: dotError } = await supabase
      .from('dots')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (dotError || !dot) {
      return NextResponse.json(
        { error: 'Dot not found' },
        { status: 404 }
      );
    }

    if (dot.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the dot (cascading delete will handle conversations, knowledge_chunks, etc.)
    const { error: deleteError } = await supabase
      .from('dots')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting dot:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete dot' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/dots/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 