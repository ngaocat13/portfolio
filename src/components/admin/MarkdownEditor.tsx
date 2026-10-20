'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost, BlogCategory } from '@/types';
import { saveArticleAction } from '@/lib/actions/admin-actions';
import { slugify, calculateReadingTime } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import {
  Save,
  Eye,
  Columns,
  Maximize2,
  Minimize2,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Send,
  ArrowLeft,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface MarkdownEditorProps {
  initialPost?: Partial<BlogPost>;
  categories: BlogCategory[];
}

export function MarkdownEditor({ initialPost, categories }: MarkdownEditorProps) {
  const router = useRouter();

  // Article metadata state
  const [id, setId] = useState(initialPost?.id || '');
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [description, setDescription] = useState(initialPost?.description || '');
  const [categoryId, setCategoryId] = useState(initialPost?.category_id || (categories[0]?.id || ''));
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url || '');
  const [status, setStatus] = useState<'draft' | 'published'>(initialPost?.status || 'draft');
  const [isFeatured, setIsFeatured] = useState(initialPost?.is_featured || false);
  const [content, setContent] = useState(
    initialPost?.content_markdown ||
      `## Overview\n\nWrite your technical engineering article here.\n\n### Mathematical Formulation\n\nState-space representation:\n\n$$\n\\dot{x} = Ax + Bu\n$$\n\n### Diagram\n\n\`\`\`mermaid\nflowchart LR\n    A[Sensor] --> B[Controller]\n    B --> C[Actuator]\n    C --> D[Physical System]\n    D --> A\n\`\`\`\n\n### Implementation\n\n\`\`\`python\ndef compute_feedback(x, K):\n    return -K @ x\n\`\`\`\n`
  );

  // Editor modes: 'split' | 'edit' | 'preview'
  const [mode, setMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const editorTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle title changes & auto-slugify
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!id) {
      setSlug(slugify(newTitle));
    }
    setSaveStatus('unsaved');
  };

  // Perform Save Mutation
  const handleSave = useCallback(
    async (overrideStatus?: 'draft' | 'published') => {
      const currentStatus = overrideStatus || status;
      if (!title.trim()) {
        setErrorMessage('Article title is required before saving.');
        return;
      }
      if (!categoryId) {
        setErrorMessage('Please select a category for this article.');
        return;
      }

      setSaveStatus('saving');
      setErrorMessage(null);

      const payload = {
        id: id || undefined,
        title,
        slug: slug || slugify(title),
        description: description || title,
        content_markdown: content,
        cover_image_url: coverImageUrl,
        category_id: categoryId,
        status: currentStatus,
        is_featured: isFeatured,
      };

      const result = await saveArticleAction(payload);

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to save article.');
        setSaveStatus('unsaved');
      } else {
        if (!id && result.post?.id) {
          setId(result.post.id);
        }
        setStatus(currentStatus);
        setSaveStatus('saved');
        setLastSaved(new Date().toLocaleTimeString());
      }
    },
    [id, title, slug, description, content, coverImageUrl, categoryId, status, isFeatured]
  );

  // Debounced Autosave (Every 4 seconds of inactivity if content changed)
  useEffect(() => {
    if (saveStatus !== 'unsaved') return;
    const timer = setTimeout(() => {
      if (title.trim()) {
        handleSave();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [saveStatus, title, handleSave]);

  // Handle Markdown file import (.md with YAML frontmatter)
  const handleImportMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Extract optional YAML Frontmatter: --- ... ---
      const frontmatterMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (frontmatterMatch) {
        const yaml = frontmatterMatch[1];
        const body = frontmatterMatch[2];

        // Parse key-value frontmatter
        const titleMatch = yaml.match(/title:\s*["']?(.*?)["']?$/m);
        const descMatch = yaml.match(/description:\s*["']?(.*?)["']?$/m);
        const coverMatch = yaml.match(/cover_image_url:\s*["']?(.*?)["']?$/m);

        if (titleMatch && titleMatch[1]) {
          setTitle(titleMatch[1]);
          setSlug(slugify(titleMatch[1]));
        }
        if (descMatch && descMatch[1]) {
          setDescription(descMatch[1]);
        }
        if (coverMatch && coverMatch[1]) {
          setCoverImageUrl(coverMatch[1]);
        }
        setContent(body);
      } else {
        setContent(text);
      }

      setStatus('draft');
      setSaveStatus('unsaved');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Image insertion into markdown textarea
  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = editorTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;

    const updated = current.substring(0, start) + textToInsert + current.substring(end);
    setContent(updated);
    setSaveStatus('unsaved');

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 50);
  };

  // Clipboard paste handler for images
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const fakeUrl = URL.createObjectURL(file);
          insertTextAtCursor(`\n![Pasted Figure](${fakeUrl})\n`);
        }
      }
    }
  };

  return (
    <div
      className={`space-y-4 ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-6 bg-white dark:bg-[#070b14] overflow-y-auto'
          : ''
      }`}
    >
      {/* Top Bar: Navigation, Save Status & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/articles')}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            title="Back to Articles"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <span className="text-xs font-mono uppercase text-gray-400 block">
              Writing Studio
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {title || 'Untitled Article'}
              </span>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                  status === 'published'
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                    : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                }`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Save Status & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="text-xs font-mono flex items-center gap-1.5 text-gray-500">
            {saveStatus === 'saving' && (
              <>
                <Clock className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                <span>Saving draft...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saved {lastSaved && `(${lastSaved})`}</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <span className="text-amber-500">● Unsaved edits</span>
            )}
          </div>

          {/* Import Markdown file */}
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import .md</span>
            <input
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleImportMarkdown}
              className="hidden"
            />
          </label>

          {/* Manual Save Draft */}
          <button
            onClick={() => handleSave('draft')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Publish / Unpublish Toggle */}
          {status === 'published' ? (
            <button
              onClick={() => handleSave('draft')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              <span>Unpublish</span>
            </button>
          ) : (
            <button
              onClick={() => handleSave('published')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Article</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100"
            title="Toggle distraction-free writing"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Metadata Form (Title, Category, Slug, Description) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424]">
        <div className="sm:col-span-6">
          <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
            Article Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Deriving Linear Quadratic Regulators (LQR)"
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-semibold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSaveStatus('unsaved');
            }}
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.parent_id ? `— ${cat.name}` : cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSaveStatus('unsaved');
            }}
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="sm:col-span-8">
          <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
            Short Description / Abstract
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setSaveStatus('unsaved');
            }}
            placeholder="High-level technical abstract displayed on blog cards..."
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="sm:col-span-4">
          <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => {
              setCoverImageUrl(e.target.value);
              setSaveStatus('unsaved');
            }}
            placeholder="https://..."
            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Editor Toolbar (Mode Switcher & Formatting Shortcuts) */}
      <div className="flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => insertTextAtCursor('**bold text**')}
            className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 font-bold"
          >
            B
          </button>
          <button
            onClick={() => insertTextAtCursor('*italic text*')}
            className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 italic"
          >
            I
          </button>
          <button
            onClick={() => insertTextAtCursor('\n$$\n\\dot{x} = Ax + Bu\n$$\n')}
            className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 font-mono text-[11px]"
            title="Insert LaTeX Block Equation"
          >
            $ Math
          </button>
          <button
            onClick={() => insertTextAtCursor('\n```cpp\n// C++ source code\n```\n')}
            className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 font-mono text-[11px]"
            title="Insert Code Block"
          >
            &lt;/&gt; Code
          </button>
          <button
            onClick={() =>
              insertTextAtCursor(
                '\n```mermaid\nflowchart LR\n    A[Input] --> B[Controller]\n    B --> C[Plant]\n```\n'
              )
            }
            className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 font-mono text-[11px]"
            title="Insert Mermaid Diagram"
          >
            Diagram
          </button>
        </div>

        {/* View Mode Controls: Edit | Split | Preview */}
        <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1424] p-1 text-xs">
          <button
            onClick={() => setMode('edit')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              mode === 'edit'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setMode('split')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              mode === 'split'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              mode === 'preview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Live Preview
          </button>
        </div>
      </div>

      {/* Editor & Preview Panes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-320px)] min-h-[500px]">
        {/* Editor Pane */}
        {(mode === 'edit' || mode === 'split') && (
          <div
            className={`h-full rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0b101d] overflow-hidden flex flex-col ${
              mode === 'split' ? 'md:col-span-6' : 'md:col-span-12'
            }`}
          >
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 text-[11px] font-mono text-gray-400 flex items-center justify-between">
              <span>Markdown Source Editor</span>
              <span>Supports Drag & Drop & Clipboard Paste</span>
            </div>
            <textarea
              ref={editorTextareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setSaveStatus('unsaved');
              }}
              onPaste={handlePaste}
              placeholder="Author in GitHub Flavored Markdown with LaTeX and Mermaid diagrams..."
              className="flex-1 w-full p-4 font-mono text-xs sm:text-sm leading-relaxed bg-transparent focus:outline-none resize-none text-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(mode === 'preview' || mode === 'split') && (
          <div
            className={`h-full rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] overflow-y-auto p-6 ${
              mode === 'split' ? 'md:col-span-6' : 'md:col-span-12'
            }`}
          >
            <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-6">
              <span className="text-[11px] font-mono uppercase text-blue-500 font-semibold tracking-wider">
                Live Rendered Output
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {title || 'Article Title Preview'}
              </h2>
            </div>
            <MarkdownRenderer content={content} />
          </div>
        )}
      </div>
    </div>
  );
}
