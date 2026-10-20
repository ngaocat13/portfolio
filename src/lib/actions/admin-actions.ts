'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { setLocalAdminSession, clearLocalAdminSession, isAdminAuthenticated } from '../auth/session';
import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured } from '../supabase/client';
import {
  saveBlogPost,
  deleteBlogPost,
  saveCategory,
  deleteCategory,
  saveProject,
  deleteProject,
  updateProfile,
  updateSiteSettings,
} from '../data/store';
import { articleSchema, categorySchema, projectSchema, profileSchema, siteSettingsSchema } from '../validation';

// ==============================================================================
// AUTHENTICATION
// ==============================================================================

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  // If Supabase is configured with Cloud Auth
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { success: false, error: error.message };
        }
        revalidatePath('/admin');
        redirect('/admin');
      }
    } catch (err: any) {
      if (err?.message === 'NEXT_REDIRECT') throw err;
      return { success: false, error: err?.message || 'Authentication error.' };
    }
  }

  // Local/Offline Demo Login Fallback
  // Allows testing the admin CMS immediately before cloud keys are linked
  if (password === 'admin123' || password === 'admin') {
    await setLocalAdminSession();
    revalidatePath('/admin');
    redirect('/admin');
  }

  return {
    success: false,
    error: 'Invalid credentials. For local preview, enter password "admin123". Once Supabase is configured, use your Supabase user credentials.',
  };
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Ignored
    }
  }

  await clearLocalAdminSession();
  revalidatePath('/admin');
  redirect('/admin/login');
}

// ==============================================================================
// ARTICLES
// ==============================================================================

export async function saveArticleAction(rawData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized. Please log in as administrator.' };
  }

  const parsed = articleSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || 'Validation failed.' };
  }

  const saved = await saveBlogPost(parsed.data);
  revalidatePath('/blog');
  revalidatePath(`/blog/posts/${saved.slug}`);
  revalidatePath('/admin/articles');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true, post: saved };
}

export async function deleteArticleAction(id: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  await deleteBlogPost(id);
  revalidatePath('/blog');
  revalidatePath('/admin/articles');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true };
}

// ==============================================================================
// CATEGORIES
// ==============================================================================

export async function saveCategoryAction(rawData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  const parsed = categorySchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || 'Validation failed.' };
  }

  const saved = await saveCategory(parsed.data);
  revalidatePath('/blog');
  revalidatePath('/admin/categories');
  revalidatePath('/admin/articles/new');

  return { success: true, category: saved };
}

export async function deleteCategoryAction(id: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  const result = await deleteCategory(id);
  if (!result.success) {
    return result;
  }

  revalidatePath('/blog');
  revalidatePath('/admin/categories');
  return { success: true };
}

// ==============================================================================
// PROJECTS
// ==============================================================================

export async function saveProjectAction(rawData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  const parsed = projectSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || 'Validation failed.' };
  }

  const saved = await saveProject(parsed.data);
  revalidatePath('/projects');
  revalidatePath(`/projects/${saved.slug}`);
  revalidatePath('/admin/projects');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true, project: saved };
}

export async function deleteProjectAction(id: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  await deleteProject(id);
  revalidatePath('/projects');
  revalidatePath('/admin/projects');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true };
}

// ==============================================================================
// SITE SETTINGS & PROFILE
// ==============================================================================

export async function updateSiteSettingsAction(rawData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  const parsed = siteSettingsSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || 'Validation failed.' };
  }

  const saved = await updateSiteSettings(parsed.data);
  revalidatePath('/blog');
  revalidatePath('/');
  revalidatePath('/admin/settings');

  return { success: true, settings: saved };
}

export async function updateProfileAction(rawData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  const parsed = profileSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || 'Validation failed.' };
  }

  const saved = await updateProfile(parsed.data);
  revalidatePath('/about');
  revalidatePath('/');
  revalidatePath('/admin/settings');

  return { success: true, profile: saved };
}
