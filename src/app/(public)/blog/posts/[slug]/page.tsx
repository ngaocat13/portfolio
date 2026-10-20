import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ExportMenu } from '@/components/blog/ExportMenu';
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2, Tag } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublishedBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="py-6 space-y-10">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Export Menu */}
        <ExportMenu post={post} />
      </div>

      {/* Article Header (Editorial Format) */}
      <header className="max-w-3xl mx-auto space-y-4 text-center sm:text-left">
        {/* Category Pill */}
        {post.category && (
          <Link
            href={`/blog/${post.category.slug}`}
            className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 hover:bg-blue-100 transition-colors"
          >
            {post.category.name}
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {post.description}
        </p>

        {/* Metadata bar */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 dark:text-gray-400 border-t border-b border-gray-100 dark:border-gray-800 py-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <time dateTime={post.published_at || ''}>Published {formatDate(post.published_at)}</time>
          </div>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{post.reading_time_minutes} min read</span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="max-w-4xl mx-auto relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      {/* Main Reading Column + Table of Contents */}
      <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-12 items-start justify-center">
        {/* Centered Editorial Content */}
        <article className="max-w-3xl w-full flex-1">
          {/* Mobile TOC is rendered here if on small screens */}
          <TableOfContents markdown={post.content_markdown} />

          {/* Rendered Markdown */}
          <MarkdownRenderer content={post.content_markdown} />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 mt-12 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-mono text-gray-400 uppercase mr-1">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Prev / Next Article Navigation */}
          <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/posts/${prevPost.slug}`}
                className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1424] hover:border-blue-500 transition-colors group"
              >
                <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center gap-1 mb-1">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Previous Article</span>
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {prevPost.title}
                </span>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link
                href={`/blog/posts/${nextPost.slug}`}
                className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1424] hover:border-blue-500 transition-colors text-right group"
              >
                <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center justify-end gap-1 mb-1">
                  <span>Next Article</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {nextPost.title}
                </span>
              </Link>
            ) : <div />}
          </nav>
        </article>

        {/* Desktop Sticky Table of Contents on the Right */}
        <div className="hidden xl:block">
          <TableOfContents markdown={post.content_markdown} />
        </div>
      </div>
    </div>
  );
}
