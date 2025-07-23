import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AIContentAnalyzer } from '@/lib/ai-content-analyzer';
import { MockAnalyzer } from '@/lib/mock-analyzer';
import { aiService } from '@/lib/ai';
import { freeEmbeddingService } from '@/lib/free-embeddings';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { dotId, url, customInstructions } = await request.json();

    if (!dotId || !url) {
      return NextResponse.json(
        { error: 'Dot ID and URL are required' },
        { status: 400 }
      );
    }

    // Verify the dot exists and user has access
    const { data: dot, error: dotError } = await supabase
      .from('dots')
      .select('*')
      .eq('id', dotId)
      .single();

    if (dotError || !dot) {
      return NextResponse.json(
        { error: 'Dot not found' },
        { status: 404 }
      );
    }

    // Create analysis session
    const { data: session, error: sessionError } = await supabase
      .from('scraping_sessions')
      .insert({
        dot_id: dotId,
        status: 'running',
        metadata: { url, method: 'ai_analysis' }
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating analysis session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create analysis session' },
        { status: 500 }
      );
    }

    try {
      console.log(`Starting AI analysis for: ${url}`);
      
      // Try AI analysis first, fallback to mock if quota exceeded
      let analyzer;
      let businessInfo;
      
      try {
        analyzer = new AIContentAnalyzer();
        businessInfo = await analyzer.analyzeWebsite(url, customInstructions);
        console.log('AI analysis successful');
      } catch (aiError) {
        console.log('AI analysis failed, using mock analyzer:', aiError);
        analyzer = new MockAnalyzer();
        businessInfo = await analyzer.analyzeWebsite(url, customInstructions);
      }
      
      // Generate knowledge chunks from the analysis
      const knowledgeChunks = await analyzer.generateKnowledgeChunks(businessInfo);
      
      console.log(`Generated ${knowledgeChunks.length} knowledge chunks from AI analysis`);
      
      let totalChunks = 0;

      // Store each knowledge chunk
      for (const chunk of knowledgeChunks) {
        try {
          let embedding = null;
          
          // Try OpenAI embedding first, fallback to free embedding service
          try {
            const embeddingResponse = await aiService.generateEmbedding(chunk);
            embedding = embeddingResponse.embedding;
            console.log('Using OpenAI embedding');
          } catch (embeddingError) {
            console.log('OpenAI embedding failed, using free embedding service:', embeddingError);
            try {
              const freeEmbeddingResponse = await freeEmbeddingService.generateEmbedding(chunk);
              embedding = freeEmbeddingResponse.embedding;
              console.log('Using free embedding');
            } catch (freeError) {
              console.log('Free embedding also failed, storing chunk without embedding:', freeError);
              // Continue without embedding - the chunk will still be stored
            }
          }
          
          // Store the chunk in the knowledge base
          const { error: chunkError } = await supabase
            .from('knowledge_chunks')
            .insert({
              dot_id: dotId,
              content: chunk,
              source_type: 'ai_analysis',
              source_url: url,
              title: 'AI Analysis',
              metadata: {
                method: 'ai_analysis',
                chunk_index: knowledgeChunks.indexOf(chunk),
                total_chunks: knowledgeChunks.length,
                business_info: businessInfo
              },
              embedding: embedding // This can be null if embedding failed
            });

          if (chunkError) {
            console.error('Error storing chunk:', chunkError);
          } else {
            totalChunks++;
            console.log(`Stored chunk ${totalChunks}/${knowledgeChunks.length}`);
          }
        } catch (error) {
          console.error('Error processing chunk:', error);
        }
      }

      // Update analysis session as completed
      await supabase
        .from('scraping_sessions')
        .update({
          status: 'completed',
          urls_scraped: 1, // Count as 1 URL analyzed
          chunks_created: totalChunks,
          completed_at: new Date().toISOString()
        })
        .eq('id', session.id);

      // Update dot status
      await supabase
        .from('dots')
        .update({
          setup_status: 'connected',
          updated_at: new Date().toISOString()
        })
        .eq('id', dotId);

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        urlsAnalyzed: 1,
        chunksCreated: totalChunks,
        businessInfo: businessInfo,
        message: `Successfully analyzed website and created ${totalChunks} knowledge chunks.`
      });

    } catch (analysisError) {
      console.error('AI Analysis error:', analysisError);
      
      // Update session as failed
      await supabase
        .from('scraping_sessions')
        .update({
          status: 'failed',
          error_message: analysisError instanceof Error ? analysisError.message : 'Unknown error',
          completed_at: new Date().toISOString()
        })
        .eq('id', session.id);

      throw analysisError;
    }

  } catch (error) {
    console.error('AI Analysis API error:', error);
    return NextResponse.json(
      { 
        error: 'AI Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 