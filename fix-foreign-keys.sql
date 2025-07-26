-- Fix Foreign Key Constraints for Dots Table
-- This script ensures that when a dot is deleted, all related records are automatically deleted

-- 1. Drop existing foreign key constraints if they exist
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_dot_id_fkey;
ALTER TABLE knowledge_chunks DROP CONSTRAINT IF EXISTS knowledge_chunks_dot_id_fkey;
ALTER TABLE scraping_sessions DROP CONSTRAINT IF EXISTS scraping_sessions_dot_id_fkey;

-- 2. Re-add foreign key constraints with CASCADE DELETE
ALTER TABLE conversations 
ADD CONSTRAINT conversations_dot_id_fkey 
FOREIGN KEY (dot_id) REFERENCES dots(id) ON DELETE CASCADE;

ALTER TABLE knowledge_chunks 
ADD CONSTRAINT knowledge_chunks_dot_id_fkey 
FOREIGN KEY (dot_id) REFERENCES dots(id) ON DELETE CASCADE;

ALTER TABLE scraping_sessions 
ADD CONSTRAINT scraping_sessions_dot_id_fkey 
FOREIGN KEY (dot_id) REFERENCES dots(id) ON DELETE CASCADE;

-- 3. Verify the constraints are properly set up
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND ccu.table_name = 'dots'; 