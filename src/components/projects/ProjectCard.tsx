import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1">
      <div>
        {/* Cover Image */}
        <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800/60 overflow-hidden">
          {project.cover_image_url ? (
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <span className="font-mono text-xs text-gray-400">Engineering Project</span>
            </div>
          )}

          {project.is_featured && (
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-blue-600 text-white font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
            {project.short_description}
          </p>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech_tags.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
            {project.tech_tags.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
                +{project.tech_tags.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="p-5 sm:p-6 pt-0 border-t border-gray-100 dark:border-gray-800/80 mt-4 flex items-center justify-between">
        <Link
          href={`/projects/${project.slug}`}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:underline"
        >
          <span>View Specifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Demonstration"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
