import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Github, ExternalLink, Calendar, Wrench, Cpu, CheckCircle } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-6 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Overview</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/60 dark:border-blue-900/60">
            Hardware & Firmware Project
          </span>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={project.published_at || ''}>{formatDate(project.published_at)}</time>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {project.title}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {project.short_description}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white/90 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demonstration / Video</span>
            </a>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {project.cover_image_url && (
        <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      {/* Technical Specifications Table */}
      {project.specifications && Object.keys(project.specifications).length > 0 && (
        <section className="p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            <Wrench className="w-4 h-4" />
            <span>Engineering Specifications</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {Object.entries(project.specifications).map(([key, value]) => (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 flex flex-col justify-between"
              >
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">
                  {key}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tech Stack Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono text-gray-400 uppercase mr-1">Stack:</span>
        {project.tech_tags.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Markdown Project Content */}
      <section className="prose dark:prose-invert max-w-none pt-4 border-t border-gray-200/80 dark:border-gray-800/80">
        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
          {project.content_markdown}
        </div>
      </section>
    </article>
  );
}
