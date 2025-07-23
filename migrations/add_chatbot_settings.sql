-- Add chatbot settings columns to dots table
ALTER TABLE dots 
ADD COLUMN IF NOT EXISTS position TEXT DEFAULT 'bottom-center' CHECK (position IN ('bottom-right', 'bottom-left', 'bottom-center')),
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
ADD COLUMN IF NOT EXISTS welcome_message TEXT DEFAULT 'Hi! I''m your AI assistant. How can I help you today?';

-- Update existing dots to have default values
UPDATE dots 
SET 
  position = 'bottom-center' WHERE position IS NULL,
  theme = 'dark' WHERE theme IS NULL,
  welcome_message = 'Hi! I''m your AI assistant. How can I help you today?' WHERE welcome_message IS NULL; 