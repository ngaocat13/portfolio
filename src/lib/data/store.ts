import { BlogPost, BlogCategory, BlogTag, Project, Profile, SiteSettings } from '@/types';
import {
  initialBlogPosts,
  initialCategories,
  initialTags,
  initialProjects,
  initialProfile,
  initialSiteSettings,
} from './mock-data';
import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured } from '../supabase/client';

// Global in-memory cache for local development/fallback
let postsCache = [...initialBlogPosts];
let categoriesCache = [...initialCategories];
let tagsCache = [...initialTags];
let projectsCache = [...initialProjects];
let profileCache = { ...initialProfile };
let siteSettingsCache = { ...initialSiteSettings };

// ==============================================================================
// BLOG POSTS
// ==============================================================================

export async function getPublishedBlogPosts(options?: {
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
}): Promise<BlogPost[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(*),
          tags:blog_post_tags(blog_tags(*))
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (options?.categorySlug) {
        // Query category and its subcategories
        const { data: cat } = await supabase
          .from('blog_categories')
          .select('id')
          .eq('slug', options.categorySlug)
          .single();

        if (cat) {
          const { data: children } = await supabase
            .from('blog_categories')
            .select('id')
            .eq('parent_id', cat.id);

          const catIds = [cat.id, ...(children ? children.map((c: any) => c.id) : [])];
          query = query.in('category_id', catIds);
        }
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((item: any) => ({
          ...item,
          tags: item.tags?.map((t: any) => t.blog_tags).filter(Boolean) || [],
        }));
      }
    }
  }

  // Fallback / In-Memory Store
  let results = postsCache.filter((p) => p.status === 'published');

  if (options?.categorySlug) {
    const parentCat = categoriesCache.find((c) => c.slug === options.categorySlug);
    if (parentCat) {
      const childCatIds = categoriesCache
        .filter((c) => c.parent_id === parentCat.id)
        .map((c) => c.id);
      const allCatIds = [parentCat.id, ...childCatIds];
      results = results.filter((p) => allCatIds.includes(p.category_id));
    }
  }

  if (options?.tagSlug) {
    const tag = tagsCache.find((t) => t.slug === options.tagSlug);
    if (tag) {
      // Filter by tag if present
    }
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.content_markdown.toLowerCase().includes(q)
    );
  }

  // Populate category objects
  return results.map((post) => ({
    ...post,
    category: categoriesCache.find((c) => c.id === post.category_id),
  }));
}

export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(*),
          tags:blog_post_tags(blog_tags(*))
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          ...item,
          tags: item.tags?.map((t: any) => t.blog_tags).filter(Boolean) || [],
        }));
      }
    }
  }

  return postsCache.map((post) => ({
    ...post,
    category: categoriesCache.find((c) => c.id === post.category_id),
  }));
}

export async function getBlogPostBySlug(slug: string, allowDraft: boolean = false): Promise<BlogPost | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(*),
          tags:blog_post_tags(blog_tags(*))
        `)
        .eq('slug', slug);

      if (!allowDraft) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query.single();
      if (!error && data) {
        return {
          ...data,
          tags: data.tags?.map((t: any) => t.blog_tags).filter(Boolean) || [],
        };
      }
    }
  }

  const post = postsCache.find((p) => p.slug === slug);
  if (!post) return null;
  if (!allowDraft && post.status !== 'published') return null;

  return {
    ...post,
    category: categoriesCache.find((c) => c.id === post.category_id),
  };
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(*),
          tags:blog_post_tags(blog_tags(*))
        `)
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          ...data,
          tags: data.tags?.map((t: any) => t.blog_tags).filter(Boolean) || [],
        };
      }
    }
  }

  const post = postsCache.find((p) => p.id === id);
  if (!post) return null;
  return {
    ...post,
    category: categoriesCache.find((c) => c.id === post.category_id),
  };
}

// ==============================================================================
// CATEGORIES & TAGS
// ==============================================================================

export async function getBlogCategories(): Promise<BlogCategory[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        return buildCategoryHierarchy(data);
      }
    }
  }

  return buildCategoryHierarchy(categoriesCache);
}

function buildCategoryHierarchy(flat: BlogCategory[]): BlogCategory[] {
  const rootCats = flat.filter((c) => !c.parent_id);
  return rootCats.map((parent) => ({
    ...parent,
    children: flat.filter((c) => c.parent_id === parent.id),
  }));
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) return data;
    }
  }

  return categoriesCache.find((c) => c.slug === slug) || null;
}

export async function getBlogTags(): Promise<BlogTag[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('blog_tags').select('*').order('name');
      if (!error && data) return data;
    }
  }
  return tagsCache;
}

// ==============================================================================
// PROJECTS
// ==============================================================================

export async function getPublishedProjects(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!error && data) return data;
    }
  }

  return projectsCache.filter((p) => p.status === 'published');
}

export async function getAllProjectsForAdmin(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    }
  }

  return projectsCache;
}

export async function getProjectBySlug(slug: string, allowDraft: boolean = false): Promise<Project | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase.from('projects').select('*').eq('slug', slug);
      if (!allowDraft) query = query.eq('status', 'published');
      const { data, error } = await query.single();
      if (!error && data) return data;
    }
  }

  const p = projectsCache.find((proj) => proj.slug === slug);
  if (!p) return null;
  if (!allowDraft && p.status !== 'published') return null;
  return p;
}

// ==============================================================================
// PROFILE & SETTINGS
// ==============================================================================

export async function getProfile(): Promise<Profile> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('profiles').select('*').single();
      if (!error && data) return data;
    }
  }
  return profileCache;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (!error && data) return data;
    }
  }
  return siteSettingsCache;
}

// ==============================================================================
// MUTATION HELPERS (In-memory fallback for local dev & admin actions)
// ==============================================================================

export async function saveBlogPost(post: Partial<BlogPost> & { title: string; slug: string; content_markdown: string; category_id: string }): Promise<BlogPost> {
  const existingIdx = postsCache.findIndex((p) => p.id === post.id);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const updated: BlogPost = {
      ...postsCache[existingIdx],
      ...post,
      updated_at: now,
      published_at: post.status === 'published' && !postsCache[existingIdx].published_at ? now : postsCache[existingIdx].published_at,
    };
    postsCache[existingIdx] = updated;
    return updated;
  } else {
    const newPost: BlogPost = {
      id: post.id || `post-${Date.now()}`,
      title: post.title,
      slug: post.slug,
      description: post.description || '',
      content_markdown: post.content_markdown,
      cover_image_url: post.cover_image_url || '',
      category_id: post.category_id,
      status: post.status || 'draft',
      is_featured: post.is_featured || false,
      reading_time_minutes: Math.ceil(post.content_markdown.split(/\s+/).length / 200),
      published_at: post.status === 'published' ? now : null,
      created_at: now,
      updated_at: now,
    };
    postsCache.unshift(newPost);
    return newPost;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  postsCache = postsCache.filter((p) => p.id !== id);
  return true;
}

export async function saveCategory(category: Partial<BlogCategory> & { name: string; slug: string }): Promise<BlogCategory> {
  const existingIdx = categoriesCache.findIndex((c) => c.id === category.id);
  if (existingIdx >= 0) {
    const updated: BlogCategory = {
      ...categoriesCache[existingIdx],
      ...category,
    };
    categoriesCache[existingIdx] = updated;
    return updated;
  } else {
    const newCat: BlogCategory = {
      id: category.id || `cat-${Date.now()}`,
      parent_id: category.parent_id || null,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      display_order: category.display_order ?? (categoriesCache.length + 1),
      created_at: new Date().toISOString(),
    };
    categoriesCache.push(newCat);
    return newCat;
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  // Check if any articles are assigned to this category
  const inUse = postsCache.some((p) => p.category_id === id);
  if (inUse) {
    return { success: false, error: "Cannot delete category: existing articles are assigned to it." };
  }
  // Check if it has child categories
  const hasChildren = categoriesCache.some((c) => c.parent_id === id);
  if (hasChildren) {
    return { success: false, error: "Cannot delete category: subcategories must be removed or moved first." };
  }

  categoriesCache = categoriesCache.filter((c) => c.id !== id);
  return { success: true };
}

export async function saveProject(project: Partial<Project> & { title: string; slug: string; short_description: string; content_markdown: string }): Promise<Project> {
  const existingIdx = projectsCache.findIndex((p) => p.id === project.id);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const updated: Project = {
      ...projectsCache[existingIdx],
      ...project,
      updated_at: now,
    };
    projectsCache[existingIdx] = updated;
    return updated;
  } else {
    const newProj: Project = {
      id: project.id || `proj-${Date.now()}`,
      title: project.title,
      slug: project.slug,
      short_description: project.short_description,
      content_markdown: project.content_markdown,
      cover_image_url: project.cover_image_url || '',
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      status: project.status || 'published',
      is_featured: project.is_featured || false,
      tech_tags: project.tech_tags || [],
      specifications: project.specifications || {},
      published_at: project.status === 'published' ? now : null,
      created_at: now,
      updated_at: now,
    };
    projectsCache.unshift(newProj);
    return newProj;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  projectsCache = projectsCache.filter((p) => p.id !== id);
  return true;
}

export async function updateProfile(profile: Partial<Profile>): Promise<Profile> {
  profileCache = {
    ...profileCache,
    ...profile,
    updated_at: new Date().toISOString(),
  };
  return profileCache;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  siteSettingsCache = {
    ...siteSettingsCache,
    ...settings,
  };
  return siteSettingsCache;
}
