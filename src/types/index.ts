export type PublicationStatus = 'draft' | 'published';

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  resume_url: string;
  email: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  twitter_url?: string;
  technical_skills: {
    category: string;
    skills: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    gpa?: string;
    highlights?: string[];
  }[];
  experience: {
    role: string;
    organization: string;
    period: string;
    description: string;
    achievements?: string[];
  }[];
  interests: string[];
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  created_at: string;
  children?: BlogCategory[];
  post_count?: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  post_count?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content_markdown: string;
  cover_image_url: string;
  category_id: string;
  category?: BlogCategory;
  tags?: BlogTag[];
  status: PublicationStatus;
  is_featured: boolean;
  reading_time_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  content_markdown: string;
  cover_image_url: string;
  github_url: string;
  demo_url?: string;
  status: PublicationStatus;
  is_featured: boolean;
  tech_tags: string[];
  specifications: Record<string, string>;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size_bytes: number;
  created_at: string;
}

export interface SiteSettings {
  blog_title: string;
  blog_subtitle: string;
  site_name: string;
  site_description: string;
}
