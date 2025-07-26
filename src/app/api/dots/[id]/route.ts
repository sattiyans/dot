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

    // First, let's check what tables reference this dot
    console.log('Checking foreign key references for dot:', id);
    
    // Check conversations table
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('dot_id', id);
    
    if (convError) {
      console.error('Error checking conversations:', convError);
    } else {
      console.log('Found conversations:', conversations?.length || 0);
    }
    
    // Check knowledge_chunks table
    const { data: chunks, error: chunksError } = await supabase
      .from('knowledge_chunks')
      .select('id')
      .eq('dot_id', id);
    
    if (chunksError) {
      console.error('Error checking knowledge_chunks:', chunksError);
    } else {
      console.log('Found knowledge chunks:', chunks?.length || 0);
    }
    
    // Check scraping_sessions table
    const { data: sessions, error: sessionsError } = await supabase
      .from('scraping_sessions')
      .select('id')
      .eq('dot_id', id);
    
    if (sessionsError) {
      console.error('Error checking scraping_sessions:', sessionsError);
    } else {
      console.log('Found scraping sessions:', sessions?.length || 0);
    }

    // Try to delete the dot (cascading delete should handle related records)
    const { error: deleteError } = await supabase
      .from('dots')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    // If cascade delete fails, manually delete related records first
    if (deleteError) {
      console.error('Cascade delete failed, trying manual cleanup:', deleteError);
      
      // Manually delete related records in the correct order
      const tablesToClean = [
        { table: 'conversations', field: 'dot_id' },
        { table: 'knowledge_chunks', field: 'dot_id' },
        { table: 'scraping_sessions', field: 'dot_id' }
      ];
      
      for (const { table, field } of tablesToClean) {
        const { error: cleanupError } = await supabase
          .from(table)
          .delete()
          .eq(field, id);
        
        if (cleanupError) {
          console.error(`Error cleaning up ${table}:`, cleanupError);
        } else {
          console.log(`Successfully cleaned up ${table}`);
        }
      }
      
      // Now try to delete the dot again
      const { error: retryError } = await supabase
        .from('dots')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (retryError) {
        console.error('Error deleting dot after cleanup:', retryError);
        console.error('Error details:', JSON.stringify(retryError, null, 2));
        return NextResponse.json(
          { error: 'Failed to delete dot', details: retryError },
          { status: 500 }
        );
      }
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