'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { saveProjectAction, deleteProjectAction } from '@/lib/actions/admin-actions';
import { slugify, formatDate } from '@/lib/utils';
import { Plus, Edit2, Trash2, Github, ExternalLink, CheckCircle, Clock } from 'lucide-react';

interface ProjectsManagerProps {
  initialProjects: Project[];
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [techTagsStr, setTechTagsStr] = useState('');

  const startCreate = () => {
    setEditingProject({});
    setTitle('');
    setSlug('');
    setShortDesc('');
    setContentMarkdown('## Project Summary\n\nDetailed specifications and architectural breakdown.');
    setCoverUrl('');
    setGithubUrl('');
    setDemoUrl('');
    setStatus('published');
    setIsFeatured(false);
    setTechTagsStr('');
    setError(null);
    setSuccess(null);
  };

  const startEdit = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setShortDesc(p.short_description);
    setContentMarkdown(p.content_markdown);
    setCoverUrl(p.cover_image_url || '');
    setGithubUrl(p.github_url || '');
    setDemoUrl(p.demo_url || '');
    setStatus(p.status);
    setIsFeatured(p.is_featured);
    setTechTagsStr(p.tech_tags.join(', '));
    setError(null);
    setSuccess(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProject?.id) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      id: editingProject?.id,
      title,
      slug,
      short_description: shortDesc,
      content_markdown: contentMarkdown,
      cover_image_url: coverUrl,
      github_url: githubUrl,
      demo_url: demoUrl,
      status,
      is_featured: isFeatured,
      tech_tags: techTagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      specifications: editingProject?.specifications || {},
    };

    const res = await saveProjectAction(payload);
    if (!res.success || !res.project) {
      setError(res.error || 'Failed to save project.');
    } else {
      setSuccess('Project saved successfully.');
      if (editingProject?.id) {
        setProjects(
          projects.map((p) => (p.id === res.project!.id ? { ...p, ...res.project } : p))
        );
      } else {
        setProjects([res.project, ...projects]);
      }
      setEditingProject(null);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const res = await deleteProjectAction(id);
    if (res.success) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Project Portfolio Showcase ({projects.length})
        </h2>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Engineering Project</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-600 dark:text-emerald-400">
          {success}
        </div>
      )}

      {/* Editor Modal / Inline form */}
      {editingProject && (
        <div className="p-6 rounded-2xl border border-blue-500/40 dark:border-blue-500/30 bg-white dark:bg-[#0e1424] shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {editingProject.id ? 'Edit Project' : 'Create New Project'}
          </h3>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Apex-Arm: 6-DOF Robotic Manipulator"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Short Description
              </label>
              <input
                type="text"
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="High-level engineering summary..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Tech Tags (Comma separated)
              </label>
              <input
                type="text"
                value={techTagsStr}
                onChange={(e) => setTechTagsStr(e.target.value)}
                placeholder="ROS 2, C++, FreeRTOS, STM32"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Demo Video or Link
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="flex items-center gap-6 sm:col-span-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Featured on Home Page</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <span>Status</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Markdown Specifications & Architecture
              </label>
              <textarea
                rows={6}
                value={contentMarkdown}
                onChange={(e) => setContentMarkdown(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono text-gray-900 dark:text-gray-100 resize-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                {loading ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">/{proj.slug}</span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                    proj.status === 'published'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                  }`}
                >
                  {proj.status}
                </span>
              </div>
              <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100 mt-1">
                {proj.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                {proj.short_description}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {proj.tech_tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(proj)}
                  className="p-1.5 text-xs text-gray-600 hover:text-blue-600 rounded-lg"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
