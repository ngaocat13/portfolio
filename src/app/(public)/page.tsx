import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProfile, getPublishedProjects, getPublishedBlogPosts } from '@/lib/data/store';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ArrowRight, Terminal, BookOpen, Send, Compass, Cpu, Wrench } from 'lucide-react';

export default async function HomePage() {
  const profile = await getProfile();
  const allProjects = await getPublishedProjects();
  const allPosts = await getPublishedBlogPosts();

  const featuredProjects = allProjects.filter((p) => p.is_featured).slice(0, 2);
  const recentPosts = allPosts.slice(0, 3);

  return (
    <div className="space-y-20 py-4 sm:py-8">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-gradient-to-b from-white via-white to-gray-50/50 dark:from-[#0c1220] dark:via-[#0c1220] dark:to-[#080c16] p-6 sm:p-10 md:p-12 overflow-hidden shadow-sm">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Robotics Research & Engineering</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                Hi, I&apos;m {profile.full_name}.
              </h1>
              <p className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-medium">
                {profile.headline}
              </p>
            </div>

            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
              >
                <Terminal className="w-4 h-4" />
                <span>Explore Projects</span>
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200/80 dark:border-gray-700/80"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Technical Blog</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Contact Me</span>
              </Link>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-xl shadow-blue-500/5 group">
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                fill
                priority
                sizes="(max-width: 768px) 176px, 224px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Technical Interests Chips */}
        <div className="relative z-10 pt-8 mt-8 border-t border-gray-200/60 dark:border-gray-800/60">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 mb-3">
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span className="uppercase tracking-wider">Core Engineering Focus:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED PROJECTS SECTION
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              <Wrench className="w-3.5 h-3.5" />
              <span>Selected Works</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mt-1">
              Featured Engineering Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Projects ({allProjects.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          RECENT BLOG ARTICLES (Traditional Blog Style)
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              <Cpu className="w-3.5 h-3.5" />
              <span>Technical Journal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mt-1">
              Recent Engineering Articles
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Visit Blog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION
          ========================================================================= */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-blue-50/50 dark:bg-blue-950/20 p-8 sm:p-10 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Interested in Collaborating or Discussing Robotics?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          I am always excited to discuss control theory problems, autonomous systems, open-source robotics, or prospective engineering roles.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>Send a Message</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
