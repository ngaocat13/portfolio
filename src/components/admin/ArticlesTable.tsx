'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';
import { deleteArticleAction } from '@/lib/actions/admin-actions';
import {
  Search,
  PenTool,
  Trash2,
  Eye,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface ArticlesTableProps {
  initialPosts: BlogPost[];
}

export function ArticlesTable({ initialPosts }: ArticlesTableProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const res = await deleteArticleAction(id);
    if (res.success) {
      setPosts(posts.filter((p) => p.id !== id));
      setDeletingId(null);
    }
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1424] text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-800 p-1 bg-white dark:bg-[#0e1424] text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'published'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              Drafts
            </button>
          </div>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 sm:px-6">Article Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        <Link
                          href={`/admin/articles/${post.id}/edit`}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {post.title}
                        </Link>
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-sm mt-0.5">
                        {post.description}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400 font-mono text-xs">
                      {post.category?.name || 'Uncategorized'}
                    </td>

                    <td className="py-4 px-4">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                          <CheckCircle className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                          <Clock className="w-3 h-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs font-mono text-gray-500">
                      {formatDate(post.updated_at)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/articles/${post.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Edit Markdown"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                        </Link>

                        {post.status === 'published' ? (
                          <Link
                            href={`/blog/posts/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="View Public Post"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <Link
                            href={`/blog/posts/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
                            title="Preview Draft"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        <button
                          onClick={() => setDeletingId(post.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No articles found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-sm w-full p-6 rounded-2xl bg-white dark:bg-[#0e1424] border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Are you sure you want to permanently delete this article? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
