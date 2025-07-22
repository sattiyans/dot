-- Clerk Migration: Full, Safe Migration Script (with type fixes and explicit casts)

-- 1. Drop all RLS policies on conversations that reference sites.user_id
DROP POLICY IF EXISTS "Site owners can view conversations" ON public.conversations;

-- 2. Drop all RLS policies on sites that reference user_id
DROP POLICY IF EXISTS "Users can view own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can insert own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can update own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can delete own sites" ON public.sites;

-- 3. Drop the foreign key constraint from sites
ALTER TABLE public.sites DROP CONSTRAINT IF EXISTS sites_user_id_fkey;

-- 4. Drop the users table
DROP TABLE IF EXISTS public.users;

-- 5. Recreate the users table for Clerk (id is TEXT, not UUID)
CREATE TABLE public.users (
    id TEXT PRIMARY KEY, -- Clerk user ID (e.g., user_abc123)
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Alter the user_id column in sites to TEXT
ALTER TABLE public.sites ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 7. Re-add the foreign key constraint to sites
ALTER TABLE public.sites
    ADD CONSTRAINT sites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 8. Recreate the RLS policies for sites
CREATE POLICY "Users can view own sites" ON public.sites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sites" ON public.sites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON public.sites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON public.sites
    FOR DELETE USING (auth.uid() = user_id);

-- 9. Recreate the RLS policy for conversations (ACTUAL CODE CHANGE: explicit casts)
CREATE POLICY "Site owners can view conversations" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sites 
            WHERE sites.id::text = conversations.site_id::text
            AND sites.user_id = auth.uid()
        )
    );

-- 10. (Optional) Re-enable RLS if needed
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY; 