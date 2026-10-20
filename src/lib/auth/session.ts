import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured } from '../supabase/client';

const LOCAL_ADMIN_COOKIE = 'portfolio_admin_session';

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();

  // 1. If Supabase is configured, verify session with Supabase Auth
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return true;
      }
    } catch {
      // Fallback to local cookie check
    }
  }

  // 2. Check local admin session cookie
  const session = cookieStore.get(LOCAL_ADMIN_COOKIE);
  return Boolean(session && session.value === 'authorized_admin_token');
}

export async function setLocalAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LOCAL_ADMIN_COOKIE, 'authorized_admin_token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  });
}

export async function clearLocalAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(LOCAL_ADMIN_COOKIE);
}
