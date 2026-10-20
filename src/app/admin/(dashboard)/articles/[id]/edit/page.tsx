import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostById, getBlogCategories } from '@/lib/data/store';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getBlogPostById(id),
    getBlogCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-2">
      <MarkdownEditor initialPost={post} categories={categories} />
    </div>
  );
}
