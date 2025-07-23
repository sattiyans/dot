-- Update existing dots to use gpt-3.5-turbo-0125 instead of GPT-4
-- This fixes the OpenAI API access issue for free tier

UPDATE dots 
SET ai_model = 'gpt-3.5-turbo-0125' 
WHERE ai_model = 'GPT-4' OR ai_model = 'gpt-4' OR ai_model = 'gpt-3.5-turbo';

-- Update the default value for new dots
ALTER TABLE dots 
ALTER COLUMN ai_model SET DEFAULT 'gpt-3.5-turbo-0125'; 