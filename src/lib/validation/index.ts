import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().default(""),
  parent_id: z.string().nullable().optional(),
  display_order: z.number().int().default(0),
});

export const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(50),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
});

export const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(250),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(1, "Description is required").max(500),
  content_markdown: z.string().min(1, "Content cannot be empty"),
  cover_image_url: z.string().url().or(z.literal("")).default(""),
  category_id: z.string().min(1, "Category is required"),
  tag_ids: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  is_featured: z.boolean().default(false),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
  short_description: z.string().min(1, "Short description is required").max(300),
  content_markdown: z.string().min(1, "Content cannot be empty"),
  cover_image_url: z.string().url().or(z.literal("")).default(""),
  github_url: z.string().url().or(z.literal("")).default(""),
  demo_url: z.string().url().or(z.literal("")).default(""),
  status: z.enum(["draft", "published"]).default("published"),
  is_featured: z.boolean().default(false),
  tech_tags: z.array(z.string()).default([]),
  specifications: z.record(z.string()).default({}),
});

export const profileSchema = z.object({
  full_name: z.string().min(1),
  headline: z.string().min(1),
  bio: z.string().min(1),
  avatar_url: z.string().default(""),
  resume_url: z.string().default(""),
  email: z.string().email(),
  location: z.string().default(""),
  github_url: z.string().default(""),
  linkedin_url: z.string().default(""),
  twitter_url: z.string().optional(),
  technical_skills: z.array(
    z.object({
      category: z.string(),
      skills: z.array(z.string()),
    })
  ).default([]),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      period: z.string(),
      gpa: z.string().optional(),
      highlights: z.array(z.string()).optional(),
    })
  ).default([]),
  experience: z.array(
    z.object({
      role: z.string(),
      organization: z.string(),
      period: z.string(),
      description: z.string(),
      achievements: z.array(z.string()).optional(),
    })
  ).default([]),
  interests: z.array(z.string()).default([]),
});

export const siteSettingsSchema = z.object({
  blog_title: z.string().min(1),
  blog_subtitle: z.string().min(1),
  site_name: z.string().min(1),
  site_description: z.string().min(1),
});
