-- DANGER: This script will drop ALL tables, policies, and constraints in the public schema.
-- Use with caution!

-- 1. Drop all policies on all tables
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.%s;', r.policyname, r.tablename);
    END LOOP;
END $$;

-- 2. Drop all tables in the public schema (CASCADE to remove constraints, triggers, etc)
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%s CASCADE;', r.tablename);
    END LOOP;
END $$; 