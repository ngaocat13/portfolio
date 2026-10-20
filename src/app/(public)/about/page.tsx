import React from 'react';
import Image from 'next/image';
import { getProfile } from '@/lib/data/store';
import { Download, GraduationCap, Briefcase, Award, Code2, Wrench, Cpu, CheckCircle2 } from 'lucide-react';

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="space-y-16 py-4">
      {/* Header / Intro */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-gray-200/80 dark:border-gray-800/80 pb-12">
        <div className="md:col-span-8 space-y-4">
          <div className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Engineering Profile
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            About {profile.full_name}
          </h1>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
            {profile.headline}
          </p>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
            <p>{profile.bio}</p>
            <p>
              My primary engineering objective is bridging the gap between theoretical multivariable control algorithms 
              and deterministic, real-time embedded hardware implementations. I have a deep curiosity for solving 
              nonlinear state-estimation challenges, tuning high-bandwidth motor inverters, and authoring clean, 
              verifiable firmware.
            </p>
          </div>

          {/* Resume Download Action */}
          <div className="pt-4">
            <a
              href={profile.resume_url}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Engineering Resume (PDF)</span>
            </a>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col items-center">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md">
            <Image
              src={profile.avatar_url}
              alt={profile.full_name}
              fill
              sizes="224px"
              className="object-cover"
            />
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {profile.location}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Skills Matrix */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          <Cpu className="w-4 h-4" />
          <span>Technical Competencies</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Skills, Tools & Technologies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profile.technical_skills.map((group) => (
            <div
              key={group.category}
              className="p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-500" />
                <span>{group.category}</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                {group.skills.map((skill) => (
                  <li key={skill} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          <Briefcase className="w-4 h-4" />
          <span>Professional Background</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Engineering Experience
        </h2>

        <div className="space-y-6">
          {profile.experience.map((exp, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {exp.role}
                </h3>
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  {exp.period}
                </span>
              </div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {exp.organization}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {exp.description}
              </p>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1 pt-1">
                  {exp.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Education & Academic Honors */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Foundation</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Education & Achievements
        </h2>

        <div className="space-y-6">
          {profile.education.map((edu, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1424] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {edu.degree}
                </h3>
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  {edu.period}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-blue-600 dark:text-blue-400">
                <span>{edu.institution}</span>
                {edu.gpa && <span className="text-xs font-mono font-semibold">GPA: {edu.gpa}</span>}
              </div>
              {edu.highlights && edu.highlights.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Key Highlights:</span>
                  <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-1">
                    {edu.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
