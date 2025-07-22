-- =====================================================
-- SUPABASE PERMISSIONS FIX SCRIPT
-- Run this in your Supabase SQL Editor to fix common issues
-- =====================================================

-- 1. GRANT NECESSARY PERMISSIONS TO AUTHENTICATED USERS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on users table
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- Grant permissions on sites table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sites TO authenticated;
GRANT SELECT ON public.sites TO anon;

-- Grant permissions on conversations table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT SELECT, INSERT ON public.conversations TO anon;

-- Grant permissions on sequences (for UUID generation)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 2. FIX ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

DROP POLICY IF EXISTS "Users can view own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can insert own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can update own sites" ON public.sites;
DROP POLICY IF EXISTS "Users can delete own sites" ON public.sites;

DROP POLICY IF EXISTS "Site owners can view conversations" ON public.conversations;
DROP POLICY IF EXISTS "Anyone can insert conversations" ON public.conversations;

-- Recreate users policies with better error handling
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Recreate sites policies
CREATE POLICY "Users can view own sites" ON public.sites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sites" ON public.sites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON public.sites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON public.sites
    FOR DELETE USING (auth.uid() = user_id);

-- Recreate conversations policies
CREATE POLICY "Site owners can view conversations" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sites 
            WHERE sites.id = conversations.site_id 
            AND sites.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert conversations" ON public.conversations
    FOR INSERT WITH CHECK (true);

-- 3. FIX FUNCTION PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated;

-- 4. ENABLE ROW LEVEL SECURITY (if not already enabled)
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- 5. CREATE A TEST FUNCTION TO VERIFY PERMISSIONS
-- =====================================================

CREATE OR REPLACE FUNCTION public.test_permissions()
RETURNS JSON AS $$
DECLARE
    result JSON;
    user_count INTEGER;
    site_count INTEGER;
BEGIN
    -- Test if we can query users table
    SELECT COUNT(*) INTO user_count FROM public.users;
    
    -- Test if we can query sites table
    SELECT COUNT(*) INTO site_count FROM public.sites;
    
    result := json_build_object(
        'success', true,
        'user_count', user_count,
        'site_count', site_count,
        'current_user', auth.uid(),
        'timestamp', NOW()
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'error_code', SQLSTATE
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.test_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_permissions() TO anon;

-- 6. VERIFICATION QUERIES
-- =====================================================

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'sites', 'conversations');

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check permissions
SELECT 
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public'
AND table_name IN ('users', 'sites', 'conversations')
ORDER BY table_name, grantee; 