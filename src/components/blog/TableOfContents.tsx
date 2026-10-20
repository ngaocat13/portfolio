'use client';

import React, { useEffect, useState } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ markdown }: { markdown: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    // Extract h2 and h3 markdown headings
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const extracted: Heading[] = [];
    let match;

    while ((match = regex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      extracted.push({ id, text, level });
    }

    setHeadings(extracted);
  }, [markdown]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) => document.getElementById(h.id));
      const scrollPos = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsible TOC */}
      <div className="xl:hidden my-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1424] p-4">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-blue-500" />
            <span>Table of Contents ({headings.length})</span>
          </div>
          {isOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpenMobile && (
          <nav className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1.5 text-xs">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={() => setIsOpenMobile(false)}
                className={`block py-1 transition-colors ${
                  h.level === 3 ? 'pl-4' : 'font-medium'
                } ${
                  activeId === h.id
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Right Panel */}
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-24 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-[#0e1424]/60 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            <List className="w-3.5 h-3.5 text-blue-500" />
            <span>Contents</span>
          </div>
          <nav className="space-y-2 text-xs max-h-[calc(100vh-160px)] overflow-y-auto">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={`block py-0.5 leading-relaxed transition-colors ${
                  h.level === 3 ? 'pl-3 text-[11px]' : 'font-medium'
                } ${
                  activeId === h.id
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
