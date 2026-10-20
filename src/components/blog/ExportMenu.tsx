'use client';

import React, { useState } from 'react';
import { BlogPost } from '@/types';
import { Download, FileText, FileCode, Printer, ChevronDown } from 'lucide-react';

interface ExportMenuProps {
  post: BlogPost;
}

export function ExportMenu({ post }: ExportMenuProps) {
  const [open, setOpen] = useState(false);

  const handleDownloadMarkdown = () => {
    // Generate clean markdown with YAML frontmatter
    const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
description: "${post.description.replace(/"/g, '\\"')}"
category: "${post.category?.name || ''}"
published_at: "${post.published_at || ''}"
reading_time: ${post.reading_time_minutes}
---

`;
    const fullContent = frontmatter + post.content_markdown;
    const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const handleDownloadDocx = () => {
    window.open(`/api/export/docx/${post.id}`, '_blank');
    setOpen(false);
  };

  const handlePrintPdf = () => {
    window.print();
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1424] text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
      >
        <Download className="w-3.5 h-3.5 text-blue-500" />
        <span>Export Article</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1424] shadow-xl z-30 py-1.5 text-xs">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-gray-400 border-b border-gray-100 dark:border-gray-800">
            Select Export Format
          </div>

          <button
            onClick={handleDownloadMarkdown}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
          >
            <FileCode className="w-4 h-4 text-emerald-500" />
            <div>
              <span className="font-medium block">Markdown (.md)</span>
              <span className="text-[10px] text-gray-400">Source text with YAML metadata</span>
            </div>
          </button>

          <button
            onClick={handleDownloadDocx}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-500" />
            <div>
              <span className="font-medium block">Word Document (.docx)</span>
              <span className="text-[10px] text-gray-400">Formatted technical document</span>
            </div>
          </button>

          <button
            onClick={handlePrintPdf}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-500" />
            <div>
              <span className="font-medium block">Print to PDF (.pdf)</span>
              <span className="text-[10px] text-gray-400">A4 publication layout</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
