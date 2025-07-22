-- Clerk Migration: Update Supabase schema for Clerk authentication

-- 1. Drop all RLS policies on sites that reference user_id
DROP POLICY IF EXISTS "Users can view own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can insert own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can update own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can delete own sites" ON public.sites;

-- 2. Drop the foreign key constraint from sites
ALTER TABLE public.sites DROP CONSTRAINT IF EXISTS sites_user_id_fkey;

-- 3. Drop the users table
DROP TABLE IF EXISTS public.users;

-- 4. Recreate the users table for Clerk (id is TEXT, not UUID)
CREATE TABLE public.users (
    id TEXT PRIMARY KEY, -- Clerk user ID (e.g., user_abc123)
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Alter the user_id column in sites to TEXT
ALTER TABLE public.sites ALTER COLUMN user_id TYPE TEXT;

-- 6. Re-add the foreign key constraint to sites
ALTER TABLE public.sites
    ADD CONSTRAINT sites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 7. Recreate the RLS policies for sites
CREATE POLICY "Users can view own sites" ON public.sites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sites" ON public.sites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON public.sites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON public.sites
    FOR DELETE USING (auth.uid() = user_id);

-- 8. (Optional) Re-enable RLS if needed
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; 