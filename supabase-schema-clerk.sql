-- Clerk-Ready Supabase Schema

-- 1. Users table (Clerk user ID as TEXT)
CREATE TABLE public.users (
    id TEXT PRIMARY KEY, -- Clerk user ID (e.g., user_abc123)
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Sites table
CREATE TABLE public.sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
    setup_status TEXT DEFAULT 'not_connected' CHECK (setup_status IN ('connected', 'not_connected', 'pending')),
    ai_model TEXT DEFAULT 'GPT-4',
    accuracy NUMERIC(5,2) DEFAULT 0,
    response_time TEXT DEFAULT '0s',
    total_chats INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Conversations table
CREATE TABLE public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    user_ip INET,
    user_agent TEXT,
    messages JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_sites_user_id ON public.sites(user_id);
CREATE INDEX idx_sites_domain ON public.sites(domain);
CREATE INDEX idx_conversations_site_id ON public.conversations(site_id);
CREATE INDEX idx_conversations_created_at ON public.conversations(created_at);

-- 5. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Users can view/update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Sites policies
CREATE POLICY "Users can view own sites" ON public.sites
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sites" ON public.sites
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sites" ON public.sites
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sites" ON public.sites
    FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Site owners can view conversations" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sites 
            WHERE sites.id::text = conversations.site_id::text
            AND sites.user_id = auth.uid()
        )
    );
CREATE POLICY "Anyone can insert conversations" ON public.conversations
    FOR INSERT WITH CHECK (true); 