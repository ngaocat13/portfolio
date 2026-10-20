import React from 'react';
import { getBlogCategories } from '@/lib/data/store';
import { CategoriesManager } from '@/components/admin/CategoriesManager';

export default async function AdminCategoriesPage() {
  const categories = await getBlogCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Category Hierarchy Management
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Create, nest, reorder, and organize multi-level topic structures for your technical articles.
        </p>
      </div>

      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
