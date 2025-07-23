-- Update existing dots to use gpt-3.5-turbo instead of gpt-3.5-turbo-0125
UPDATE dots 
SET ai_model = 'gpt-3.5-turbo'
WHERE ai_model = 'gpt-3.5-turbo-0125';

-- Update the default value for new dots
ALTER TABLE dots 
ALTER COLUMN ai_model SET DEFAULT 'gpt-3.5-turbo'; 