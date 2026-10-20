import React from 'react';
import { getPublishedProjects } from '@/lib/data/store';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Wrench } from 'lucide-react';

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  // Extract unique tech tags across all projects
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tech_tags))
  );

  return (
    <div className="space-y-10 py-4">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          <Wrench className="w-3.5 h-3.5" />
          <span>Engineering Portfolio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Robotics & Hardware Projects
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl">
          A showcase of physical autonomous robotic platforms, embedded firmware, motor inverters, 
          and simulation architectures engineered from scratch.
        </p>
      </div>

      {/* Tech Filter Tags (visual pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-mono text-gray-400 uppercase mr-1">Filter by Tech:</span>
        <button className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
          All ({projects.length})
        </button>
        {allTags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
