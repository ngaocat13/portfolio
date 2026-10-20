import React from 'react';
import Link from 'next/link';
import {
  getAllBlogPostsForAdmin,
  getBlogCategories,
  getAllProjectsForAdmin,
} from '@/lib/data/store';
import { formatDate } from '@/lib/utils';
import {
  FileText,
  Wrench,
  FolderTree,
  PenTool,
  Plus,
  Eye,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default async function AdminDashboardOverviewPage() {
  const [posts, categories, projects] = await Promise.all([
    getAllBlogPostsForAdmin(),
    getBlogCategories(),
    getAllProjectsForAdmin(),
  ]);

  const publishedPosts = posts.filter((p) => p.status === 'published');
  const draftPosts = posts.filter((p) => p.status === 'draft');
  const publishedProjects = projects.filter((p) => p.status === 'published');

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            System Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Portfolio analytics, content pipeline metrics, and recent publications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Write New Article</span>
          </Link>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200/60 dark:border-gray-700/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase">Total Articles</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {posts.length}
          </div>
          <div className="text-[11px] text-gray-500">
            {publishedPosts.length} published • {draftPosts.length} drafts
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase">Draft Articles</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {draftPosts.length}
          </div>
          <div className="text-[11px] text-gray-500">
            Awaiting author publication
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase">Projects</span>
            <Wrench className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {projects.length}
          </div>
          <div className="text-[11px] text-gray-500">
            {publishedProjects.length} live on showcase
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase">Taxonomy</span>
            <FolderTree className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {categories.length}
          </div>
          <div className="text-[11px] text-gray-500">
            Nested categories & topics
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Recent Articles & Edits
          </h2>
          <Link
            href="/admin/articles"
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Manage All Articles →
          </Link>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {posts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                  <Link
                    href={`/admin/articles/${post.id}/edit`}
                    className="font-medium text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                  >
                    {post.title}
                  </Link>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                  <span>{post.category?.name || 'Uncategorized'}</span>
                  <span>•</span>
                  <span>Updated {formatDate(post.updated_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/articles/${post.id}/edit`}
                  className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Edit
                </Link>
                {post.status === 'published' && (
                  <Link
                    href={`/blog/posts/${post.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    title="View Published Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
