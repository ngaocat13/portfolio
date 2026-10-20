import React from 'react';
import { getAllProjectsForAdmin } from '@/lib/data/store';
import { ProjectsManager } from '@/components/admin/ProjectsManager';

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Projects Management
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showcase your physical robotics systems, CAD models, electronics designs, and firmware repositories.
        </p>
      </div>

      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
