'use client';

import React, { useState, useMemo } from 'react';
import { BlogPost, BlogCategory } from '@/types';
import { ArticleCard } from './ArticleCard';
import { CategoryChips } from './CategoryChips';
import { Search, BookOpen, AlertCircle } from 'lucide-react';

interface BlogExplorerProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
  activeCategorySlug?: string;
  activeSubcategorySlug?: string;
}

export function BlogExplorer({
  initialPosts,
  categories,
  activeCategorySlug,
  activeSubcategorySlug,
}: BlogExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts based on active search input
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return initialPosts;
    const q = searchQuery.toLowerCase().trim();
    return initialPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.content_markdown.toLowerCase().includes(q)
    );
  }, [initialPosts, searchQuery]);

  // Extract featured post (if any exists and no search query active)
  const featuredPost = useMemo(() => {
    if (searchQuery.trim()) return null;
    return filteredPosts.find((p) => p.is_featured) || null;
  }, [filteredPosts, searchQuery]);

  // Remaining articles excluding the featured one
  const standardPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter((p) => p.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  return (
    <div className="space-y-8">
      {/* Category Navigation Chips */}
      <CategoryChips
        categories={categories}
        activeCategorySlug={activeCategorySlug}
        activeSubcategorySlug={activeSubcategorySlug}
      />

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search technical articles, equations, topics..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1424] text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Featured Article (Editorial Hero Card) */}
      {featuredPost && (
        <div className="mb-10">
          <ArticleCard post={featuredPost} featured={true} />
        </div>
      )}

      {/* Main Articles Grid */}
      {standardPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            No articles found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? `No articles match the search query "${searchQuery}". Try searching for other engineering keywords.`
              : 'There are no published articles in this category yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
