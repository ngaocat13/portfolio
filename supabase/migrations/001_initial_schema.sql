-- ==============================================================================
-- 001_initial_schema.sql: Engineering Portfolio & Technical Blog System
-- ==============================================================================

-- 1. Profiles Table (Site Owner & Author)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL DEFAULT 'Alex Rivera',
    headline TEXT NOT NULL DEFAULT 'Robotics Engineering Student | Embedded Systems | Control & Automation',
    bio TEXT NOT NULL DEFAULT 'Undergraduate robotics and mechatronics engineering student passionate about robust control theory, state-space estimation, real-time embedded firmware, and autonomous robotic platforms.',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    resume_url TEXT DEFAULT '/resume.pdf',
    email TEXT NOT NULL DEFAULT 'alex.rivera.robotics@example.com',
    location TEXT DEFAULT 'Boston, MA',
    github_url TEXT DEFAULT 'https://github.com',
    linkedin_url TEXT DEFAULT 'https://linkedin.com',
    twitter_url TEXT DEFAULT 'https://x.com',
    interests TEXT[] DEFAULT ARRAY['Autonomous Mobile Robots (AMR)', 'State Estimation & Extended Kalman Filters', 'Field Oriented Control (FOC)', 'Real-Time Operating Systems (FreeRTOS)', 'ROS 2 & Gazebo'],
    technical_skills JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blog Categories (Nested Hierarchy: Parent -> Child)
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.blog_categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Blog Tags (Independent taxonomy)
CREATE TABLE IF NOT EXISTS public.blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    cover_image_url TEXT DEFAULT '',
    category_id UUID NOT NULL REFERENCES public.blog_categories(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_featured BOOLEAN DEFAULT FALSE,
    reading_time_minutes INTEGER DEFAULT 5,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Blog Post Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    cover_image_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    demo_url TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    is_featured BOOLEAN DEFAULT FALSE,
    tech_tags TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}'::jsonb,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Media Assets (Uploaded files metadata)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_title TEXT NOT NULL DEFAULT 'Engineering Journal',
    blog_subtitle TEXT NOT NULL DEFAULT 'Thoughts, experiments, and notes on robotics, control theory, and embedded systems.',
    site_name TEXT NOT NULL DEFAULT 'Robotics & Control Systems Portfolio',
    site_description TEXT NOT NULL DEFAULT 'Personal portfolio and technical writing.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_parent ON public.blog_categories(parent_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "Public can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can read categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Public can read tags" ON public.blog_tags;
DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can read post tags" ON public.blog_post_tags;
DROP POLICY IF EXISTS "Public can read published projects" ON public.projects;
DROP POLICY IF EXISTS "Public can read media assets" ON public.media_assets;

DROP POLICY IF EXISTS "Admin full access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin full access on blog_categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admin full access on blog_tags" ON public.blog_tags;
DROP POLICY IF EXISTS "Admin full access on blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin full access on blog_post_tags" ON public.blog_post_tags;
DROP POLICY IF EXISTS "Admin full access on projects" ON public.projects;
DROP POLICY IF EXISTS "Admin full access on media_assets" ON public.media_assets;

-- Public Read Policies (Only published content is readable anonymously)
CREATE POLICY "Public can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Public can read tags" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "Public can read published posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read post tags" ON public.blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Public can read published projects" ON public.projects FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read media assets" ON public.media_assets FOR SELECT USING (true);

-- Authenticated Admin Full Access Policies
CREATE POLICY "Admin full access on profiles" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on site_settings" ON public.site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on blog_categories" ON public.blog_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on blog_tags" ON public.blog_tags FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on blog_post_tags" ON public.blog_post_tags FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on media_assets" ON public.media_assets FOR ALL TO authenticated USING (true);

-- Initial default settings & profile seed
INSERT INTO public.site_settings (blog_title, blog_subtitle, site_name, site_description)
VALUES (
    'Engineering Journal',
    'Explorations, experiments, and technical deep-dives in robotics, modern control theory, and embedded systems.',
    'Alex Rivera | Robotics & Embedded Systems',
    'Portfolio and technical engineering journal of a robotics and control systems engineer.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (full_name, headline, bio, email)
VALUES (
    'Alex Rivera',
    'Robotics Engineering Student | Embedded Systems | Control & Automation',
    'Undergraduate robotics and mechatronics engineering student passionate about robust control theory, state-space estimation, real-time embedded firmware, and autonomous robotic platforms.',
    'alex.rivera.robotics@example.com'
) ON CONFLICT DO NOTHING;
