'use client';

import React, { useState } from 'react';
import { BlogCategory } from '@/types';
import { saveCategoryAction, deleteCategoryAction } from '@/lib/actions/admin-actions';
import { slugify } from '@/lib/utils';
import { FolderTree, Plus, Trash2, Edit2, Layers, AlertCircle, CheckCircle } from 'lucide-react';

interface CategoriesManagerProps {
  initialCategories: BlogCategory[];
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories);
  const [editingCat, setEditingCat] = useState<Partial<BlogCategory> | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter root categories for parent selector
  const rootCategories = categories.filter((c) => !c.parent_id);

  const startCreate = (parent_id: string = '') => {
    setEditingCat({});
    setName('');
    setSlug('');
    setDescription('');
    setParentId(parent_id);
    setError(null);
    setSuccess(null);
  };

  const startEdit = (cat: BlogCategory) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setParentId(cat.parent_id || '');
    setError(null);
    setSuccess(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCat?.id) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Prevent circular relationship (category cannot be parent of itself)
    if (editingCat?.id && parentId === editingCat.id) {
      setError('A category cannot be its own parent.');
      setLoading(false);
      return;
    }

    const payload = {
      id: editingCat?.id,
      name,
      slug,
      description,
      parent_id: parentId || null,
      display_order: editingCat?.display_order ?? categories.length + 1,
    };

    const res = await saveCategoryAction(payload);
    if (!res.success || !res.category) {
      setError(res.error || 'Failed to save category.');
    } else {
      setSuccess('Category saved successfully.');
      // Refresh local list
      if (editingCat?.id) {
        setCategories(
          categories.map((c) => (c.id === res.category!.id ? { ...c, ...res.category } : c))
        );
      } else {
        setCategories([...categories, res.category]);
      }
      setEditingCat(null);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setError(null);
    setSuccess(null);

    const res = await deleteCategoryAction(id);
    if (!res.success) {
      setError(res.error || 'Cannot delete category.');
    } else {
      setCategories(categories.filter((c) => c.id !== id));
      setSuccess('Category removed.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Category Tree Display */}
      <div className="md:col-span-7 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-blue-500" />
            <span>Category Hierarchy</span>
          </h2>
          <button
            onClick={() => startCreate('')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Root Category</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-3">
          {rootCategories.map((parent) => (
            <div
              key={parent.id}
              className="p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-3 shadow-sm"
            >
              {/* Parent Category Card */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {parent.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">/{parent.slug}</span>
                  </div>
                  {parent.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {parent.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startCreate(parent.id)}
                    className="p-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                    title="Add subcategory under this category"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => startEdit(parent)}
                    className="p-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(parent.id)}
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {parent.children && parent.children.length > 0 && (
                <div className="pl-4 border-l-2 border-blue-500/20 space-y-2 pt-1">
                  {parent.children.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-blue-500" />
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                            {sub.name}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">/{sub.slug}</span>
                        </div>
                        {sub.description && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            {sub.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(sub)}
                          className="p-1 text-gray-500 hover:text-gray-900 rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category Editor Form */}
      <div className="md:col-span-5 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {editingCat?.id ? 'Edit Category' : 'Create New Category'}
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 dark:text-gray-400 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Optimal Control"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 dark:text-gray-400 mb-1">
              URL Slug
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="optimal-control"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 dark:text-gray-400 mb-1">
              Parent Category (Optional)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None (Top-Level Category)</option>
              {rootCategories
                .filter((c) => c.id !== editingCat?.id)
                .map((rc) => (
                  <option key={rc.id} value={rc.id}>
                    {rc.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-500 dark:text-gray-400 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of articles in this topic..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingCat?.id ? 'Update Category' : 'Create Category'}
            </button>
            {editingCat && (
              <button
                type="button"
                onClick={() => setEditingCat(null)}
                className="py-2 px-3 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
