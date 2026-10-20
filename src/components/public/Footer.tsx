import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200/80 dark:border-gray-800/80 bg-white/40 dark:bg-[#070a11]/40 transition-colors py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Bio */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              Alex Rivera
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Robotics engineering student focusing on deterministic embedded firmware, 
              modern multivariable control theory, and autonomous ground systems.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:alex.rivera.robotics@example.com"
                aria-label="Email"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Exploration
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About & Background
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Hardware & Code Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Technical Journal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Topics */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Topics
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Control Theory & LQR</li>
              <li>State Estimation / EKF</li>
              <li>STM32 & FreeRTOS Firmware</li>
              <li>ROS 2 & Robot Kinematics</li>
              <li>Field Oriented Control (FOC)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Alex Rivera. Engineered with Next.js, Supabase, and Tailwind CSS.</p>
          <div className="flex items-center gap-1">
            <span>Designed for clarity and precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
