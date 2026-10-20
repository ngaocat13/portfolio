import React from 'react';
import { getProfile, getSiteSettings } from '@/lib/data/store';
import { SettingsManager } from '@/components/admin/SettingsManager';

export default async function AdminSettingsPage() {
  const [profile, settings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Profile & System Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Update your public biography, social links, resume download URL, and blog titles without code changes.
        </p>
      </div>

      <SettingsManager
        initialProfile={profile}
        initialSettings={settings}
      />
    </div>
  );
}
