import React from 'react';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Media Assets & Storage
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Upload screenshots, schematics, photos, and files to embed into your engineering articles.
        </p>
      </div>

      <MediaLibrary />
    </div>
  );
}
