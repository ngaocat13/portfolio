import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth/session';
import { logoutAction } from '@/lib/actions/admin-actions';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Wrench,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/projects', label: 'Projects', icon: Wrench },
  { href: '/admin/media', label: 'Media Assets', icon: ImageIcon },
  { href: '/admin/settings', label: 'Profile & Settings', icon: Settings },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-[#070b14] text-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0b101d] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="h-16 px-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm tracking-tight">Admin Console</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] font-mono text-gray-400">View</span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
