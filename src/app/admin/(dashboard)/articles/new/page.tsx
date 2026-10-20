import React from 'react';
import { getBlogCategories } from '@/lib/data/store';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';

export default async function NewArticlePage() {
  const categories = await getBlogCategories();

  return (
    <div className="py-2">
      <MarkdownEditor categories={categories} />
    </div>
  );
}
