'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, Copy, Check, Trash2, File, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  createdAt: string;
}

const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    name: 'linear-quadratic-regulator-diagram.jpg',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    size: '340 KB',
    type: 'image/jpeg',
    createdAt: '2025-01-14',
  },
  {
    id: 'm2',
    name: 'freertos-task-scheduling-architecture.jpg',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    size: '512 KB',
    type: 'image/jpeg',
    createdAt: '2025-01-27',
  },
  {
    id: 'm3',
    name: 'apex-arm-6dof-cad-render.jpg',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    size: '620 KB',
    type: 'image/jpeg',
    createdAt: '2025-01-10',
  },
];

export function MediaLibrary() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(DEFAULT_MEDIA);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleCopyMarkdown = (item: MediaItem) => {
    const md = `![${item.name}](${item.url})`;
    navigator.clipboard.writeText(md);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Disallow unsafe executables
      if (file.name.match(/\.(exe|bat|sh|cmd|msi|vbs)$/i)) {
        alert('Executable files are forbidden for security.');
        continue;
      }

      const newItem: MediaItem = {
        id: `media-${Date.now()}-${i}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type || 'application/octet-stream',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setMediaList((prev) => [newItem, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            const file = files[0];
            const newItem: MediaItem = {
              id: `media-${Date.now()}`,
              name: file.name,
              url: URL.createObjectURL(file),
              size: `${Math.round(file.size / 1024)} KB`,
              type: file.type,
              createdAt: new Date().toISOString().split('T')[0],
            };
            setMediaList((prev) => [newItem, ...prev]);
          }
        }}
        className={`p-8 rounded-3xl border-2 border-dashed transition-colors text-center ${
          dragOver
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1424]'
        }`}
      >
        <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Upload Images & Media Attachments
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1 mb-4">
          Drag and drop files here, or browse from your computer. Supports PNG, JPG, WebP, SVG, and PDF attachments.
        </p>

        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm">
          <span>Choose Files</span>
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.zip"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase text-gray-400">
          Uploaded Media Assets ({mediaList.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-2 group shadow-sm"
            >
              <div className="relative h-36 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {item.type.startsWith('image/') ? (
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    sizes="300px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <File className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-medium text-xs text-gray-900 dark:text-gray-100 truncate block">
                  {item.name}
                </span>
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>{item.size}</span>
                  <span>{item.createdAt}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => handleCopyMarkdown(item)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied Markdown</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy MD Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setMediaList(mediaList.filter((m) => m.id !== item.id))}
                  className="p-1 text-gray-400 hover:text-red-500"
                  title="Remove asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
