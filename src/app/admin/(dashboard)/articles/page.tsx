import React from 'react';
import { getAllBlogPostsForAdmin } from '@/lib/data/store';
import { ArticlesTable } from '@/components/admin/ArticlesTable';

export default async function AdminArticlesPage() {
  const posts = await getAllBlogPostsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Articles Management
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Write, edit, draft, and publish technical markdown articles and research papers.
        </p>
      </div>

      <ArticlesTable initialPosts={posts} />
    </div>
  );
}
