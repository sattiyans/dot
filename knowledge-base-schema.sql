-- Knowledge Base Schema for Dot AI Assistant
-- This schema enables website scraping, knowledge management, and semantic search

-- 1. Knowledge chunks table (for storing scraped and user-uploaded content)
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dot_id UUID REFERENCES dots(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('scraped', 'uploaded', 'manual', 'ai_analysis')),
  source_url TEXT,
  title TEXT,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536), -- OpenAI embedding vector
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Scraping sessions table (to track website scraping)
CREATE TABLE IF NOT EXISTS scraping_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dot_id UUID REFERENCES dots(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  urls_scraped INTEGER DEFAULT 0,
  chunks_created INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- 3. Conversations table (updated to reference dots instead of sites)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dot_id UUID REFERENCES dots(id) ON DELETE CASCADE NOT NULL,
  user_ip INET,
  user_agent TEXT,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_dot_id ON knowledge_chunks(dot_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_source_type ON knowledge_chunks(source_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_created_at ON knowledge_chunks(created_at);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_dot_id ON scraping_sessions(dot_id);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_status ON scraping_sessions(status);
CREATE INDEX IF NOT EXISTS idx_conversations_dot_id ON conversations(dot_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- 5. Vector similarity search index (requires pgvector extension)
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding ON knowledge_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 6. Enable Row Level Security
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for knowledge_chunks
CREATE POLICY "Dot owners can view knowledge chunks" ON knowledge_chunks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM dots 
      WHERE dots.id = knowledge_chunks.dot_id 
      AND dots.user_id = auth.uid()
    )
  );

CREATE POLICY "Dot owners can insert knowledge chunks" ON knowledge_chunks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM dots 
      WHERE dots.id = knowledge_chunks.dot_id 
      AND dots.user_id = auth.uid()
    )
  );

CREATE POLICY "Dot owners can update knowledge chunks" ON knowledge_chunks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM dots 
      WHERE dots.id = knowledge_chunks.dot_id 
      AND dots.user_id = auth.uid()
    )
  );

CREATE POLICY "Dot owners can delete knowledge chunks" ON knowledge_chunks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM dots 
      WHERE dots.id = knowledge_chunks.dot_id 
      AND dots.user_id = auth.uid()
    )
  );

-- 8. RLS Policies for scraping_sessions
CREATE POLICY "Dot owners can view scraping sessions" ON scraping_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM dots 
      WHERE dots.id = scraping_sessions.dot_id 
      AND dots.user_id = auth.uid()
    )
  );

CREATE POLICY "Dot owners can insert scraping sessions" ON scraping_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM dots 
      WHERE dots.id = scraping_sessions.dot_id 
      AND dots.user_id = auth.uid()
    )
  );

CREATE POLICY "Dot owners can update scraping sessions" ON scraping_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM dots 
      WHERE dots.id = scraping_sessions.dot_id 
      AND dots.user_id = auth.uid()
    )
  );

-- 9. RLS Policies for conversations (updated for dots)
CREATE POLICY "Dot owners can view conversations" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM dots 
      WHERE dots.id = conversations.dot_id 
      AND dots.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert conversations" ON conversations
  FOR INSERT WITH CHECK (true);

-- 10. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Triggers for updated_at
CREATE TRIGGER update_knowledge_chunks_updated_at 
  BEFORE UPDATE ON knowledge_chunks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scraping_sessions_updated_at 
  BEFORE UPDATE ON scraping_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Function to calculate similarity between embeddings
CREATE OR REPLACE FUNCTION similarity_search(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    knowledge_chunks.id,
    knowledge_chunks.content,
    1 - (knowledge_chunks.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks
  WHERE 1 - (knowledge_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 13. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON knowledge_chunks TO authenticated;
GRANT SELECT, INSERT, UPDATE ON scraping_sessions TO authenticated;
GRANT SELECT, INSERT ON conversations TO authenticated;
GRANT SELECT ON conversations TO anon;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

GRANT EXECUTE ON FUNCTION similarity_search TO authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column TO authenticated; 