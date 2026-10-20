import React from 'react';
import { getPublishedBlogPosts, getBlogCategories, getSiteSettings } from '@/lib/data/store';
import { BlogExplorer } from '@/components/blog/BlogExplorer';

export default async function BlogLandingPage() {
  const [posts, categories, settings] = await Promise.all([
    getPublishedBlogPosts(),
    getBlogCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="space-y-8 py-4">
      {/* Blog Hero Section */}
      <div className="space-y-3 border-b border-gray-200/80 dark:border-gray-800/80 pb-8">
        <div className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          Technical Writing & Research
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {settings.blog_title}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
          {settings.blog_subtitle}
        </p>
      </div>

      {/* Interactive Blog Explorer (Categories, Search, Cards) */}
      <BlogExplorer
        initialPosts={posts}
        categories={categories}
      />
    </div>
  );
}
