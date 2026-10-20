'use client';

import React from 'react';
import Link from 'next/link';
import { BlogCategory } from '@/types';
import { Layers } from 'lucide-react';

interface CategoryChipsProps {
  categories: BlogCategory[];
  activeCategorySlug?: string;
  activeSubcategorySlug?: string;
}

export function CategoryChips({
  categories,
  activeCategorySlug,
  activeSubcategorySlug,
}: CategoryChipsProps) {
  const isAllActive = !activeCategorySlug;
  const currentParent = categories.find((c) => c.slug === activeCategorySlug);

  return (
    <div className="space-y-3 mb-8">
      {/* Primary Category Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <Link
          href="/blog"
          className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            isAllActive
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All Posts
        </Link>

        {categories.map((cat) => {
          const isActive = cat.slug === activeCategorySlug;
          return (
            <Link
              key={cat.id}
              href={`/blog/${cat.slug}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Subcategory Row (Only visible when a parent category is selected and has children) */}
      {currentParent && currentParent.children && currentParent.children.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 pl-2 border-l-2 border-blue-500/40 dark:border-blue-500/30">
          <span className="text-xs font-mono text-gray-400 dark:text-gray-500 flex items-center gap-1 mr-1">
            <Layers className="w-3 h-3" />
            <span>Subtopics:</span>
          </span>
          <Link
            href={`/blog/${currentParent.slug}`}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              !activeSubcategorySlug
                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            All {currentParent.name}
          </Link>
          {currentParent.children.map((sub) => {
            const isSubActive = sub.slug === activeSubcategorySlug;
            return (
              <Link
                key={sub.id}
                href={`/blog/${currentParent.slug}/${sub.slug}`}
                className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isSubActive
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {sub.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
