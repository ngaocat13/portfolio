-- ==============================================================================
-- 001_initial_schema.sql: Engineering Portfolio & Technical Blog System
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Site Owner & Author)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    headline TEXT NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    email TEXT NOT NULL,
    location TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    twitter_url TEXT DEFAULT '',
    interests TEXT[] DEFAULT '{}',
    technical_skills JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blog Categories (Nested Hierarchy: Parent -> Child)
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES blog_categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Blog Tags (Independent taxonomy)
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    cover_image_url TEXT DEFAULT '',
    category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_featured BOOLEAN DEFAULT FALSE,
    reading_time_minutes INTEGER DEFAULT 5,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Blog Post Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS blog_post_tags (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_title TEXT NOT NULL DEFAULT 'Engineering Journal',
    blog_subtitle TEXT NOT NULL DEFAULT 'Thoughts, experiments, and notes on robotics, control theory, and embedded systems.',
    site_name TEXT NOT NULL DEFAULT 'Robotics & Control Systems Portfolio',
    site_description TEXT NOT NULL DEFAULT 'Personal portfolio and technical writing.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_parent ON blog_categories(parent_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Only published content is readable anonymously)
CREATE POLICY "Public can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Public can read tags" ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Public can read published posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read post tags" ON blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Public can read published projects" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read media assets" ON media_assets FOR SELECT USING (true);

-- Authenticated Admin Full Access Policies
CREATE POLICY "Admin full access on profiles" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on site_settings" ON site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on blog_categories" ON blog_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on blog_tags" ON blog_tags FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on blog_posts" ON blog_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on blog_post_tags" ON blog_post_tags FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on media_assets" ON media_assets FOR ALL TO authenticated USING (true);
