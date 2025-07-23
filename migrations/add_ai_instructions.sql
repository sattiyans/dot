-- Add ai_instructions column to dots table
-- This column will store custom instructions for AI analysis

ALTER TABLE dots 
ADD COLUMN ai_instructions TEXT DEFAULT 'Focus on extracting information about our products, services, pricing, and how we help customers. Pay special attention to our unique value propositions and key differentiators.';
 
-- Add comment to document the column
COMMENT ON COLUMN dots.ai_instructions IS 'Custom instructions for AI when analyzing the website. Used to guide the AI on what specific information to focus on during analysis.'; 