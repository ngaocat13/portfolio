import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedBlogPosts, getBlogCategories, getCategoryBySlug } from '@/lib/data/store';
import { BlogExplorer } from '@/components/blog/BlogExplorer';
import { ChevronRight } from 'lucide-react';

interface SubcategoryPageProps {
  params: Promise<{ categorySlug: string; subSlug: string }>;
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { categorySlug, subSlug } = await params;
  const parentCategory = await getCategoryBySlug(categorySlug);
  const subCategory = await getCategoryBySlug(subSlug);

  if (!parentCategory || !subCategory) {
    notFound();
  }

  const [posts, categories] = await Promise.all([
    getPublishedBlogPosts({ categorySlug: subSlug }),
    getBlogCategories(),
  ]);

  return (
    <div className="space-y-8 py-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
        <Link href="/blog" className="hover:text-blue-600 transition-colors">
          Blog
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/blog/${parentCategory.slug}`} className="hover:text-blue-600 transition-colors">
          {parentCategory.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 dark:text-gray-200 font-semibold">{subCategory.name}</span>
      </nav>

      {/* Subcategory Hero */}
      <div className="space-y-3 border-b border-gray-200/80 dark:border-gray-800/80 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {subCategory.name}
        </h1>
        {subCategory.description && (
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            {subCategory.description}
          </p>
        )}
      </div>

      {/* Explorer */}
      <BlogExplorer
        initialPosts={posts}
        categories={categories}
        activeCategorySlug={categorySlug}
        activeSubcategorySlug={subSlug}
      />
    </div>
  );
}
