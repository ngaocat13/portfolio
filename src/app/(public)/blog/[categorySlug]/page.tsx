import React from 'react';
import { notFound } from 'next/navigation';
import { getPublishedBlogPosts, getBlogCategories, getCategoryBySlug } from '@/lib/data/store';
import { BlogExplorer } from '@/components/blog/BlogExplorer';

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const [posts, categories] = await Promise.all([
    getPublishedBlogPosts({ categorySlug }),
    getBlogCategories(),
  ]);

  return (
    <div className="space-y-8 py-4">
      {/* Category Hero */}
      <div className="space-y-3 border-b border-gray-200/80 dark:border-gray-800/80 pb-8">
        <div className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          Category Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Explorer */}
      <BlogExplorer
        initialPosts={posts}
        categories={categories}
        activeCategorySlug={categorySlug}
      />
    </div>
  );
}
