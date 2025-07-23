-- Add 'ai_analysis' as a valid source_type for knowledge_chunks
-- This allows AI-analyzed content to be stored in the knowledge base

-- First, drop the existing check constraint
ALTER TABLE knowledge_chunks 
DROP CONSTRAINT IF EXISTS knowledge_chunks_source_type_check;

-- Add the new check constraint with 'ai_analysis' included
ALTER TABLE knowledge_chunks 
ADD CONSTRAINT knowledge_chunks_source_type_check 
CHECK (source_type IN ('scraped', 'uploaded', 'manual', 'ai_analysis')); 