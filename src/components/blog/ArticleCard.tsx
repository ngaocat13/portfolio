import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';
import { Clock, Calendar, ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function ArticleCard({ post, featured = false }: ArticleCardProps) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 ${
        featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      {/* Cover Image Container */}
      <div
        className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800/50 ${
          featured ? 'md:col-span-7 h-64 md:h-full min-h-[260px]' : 'h-52 w-full'
        }`}
      >
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/10 to-indigo-900/20 dark:from-blue-950/40 dark:to-gray-900">
            <span className="font-mono text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Engineering Journal
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {post.is_featured && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-blue-600 text-white shadow-sm">
            Featured
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className={`p-5 sm:p-6 flex flex-col justify-between flex-1 ${featured ? 'md:col-span-5 md:py-8' : ''}`}>
        <div className="space-y-2.5">
          {/* Category & Meta */}
          <div className="flex items-center gap-2 text-xs">
            {post.category && (
              <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">
                {post.category.name}
              </span>
            )}
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.reading_time_minutes} min read</span>
            </span>
          </div>

          {/* Title */}
          <h3
            className={`font-semibold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${
              featured ? 'text-xl sm:text-2xl' : 'text-lg'
            }`}
          >
            <Link href={`/blog/posts/${post.slug}`}>
              <span className="absolute inset-0 z-0" />
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Card Footer: Date & Read Link */}
        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.published_at || ''}>{formatDate(post.published_at)}</time>
          </div>
          <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Read <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
