# Engineering Portfolio & Technical Blogging Platform

A production-ready, full-stack personal engineering portfolio and editorial technical blogging platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Storage)**.

Designed specifically for robotics, embedded systems, and control automation engineers who want an elegant, reader-focused technical publication space without managing complex infrastructure or hardcoding content.

---

## 🌟 Key Features

### 1. Traditional Blog Architecture
- **Editorial Experience:** Designed like modern developer blogs (Medium / Hashnode inspired) with comfortable line lengths, clean category chips, and clear visual hierarchy.
- **Dynamic Nested Categories:** Hierarchical parent-child topics (e.g., `Control Theory` → `Optimal Control`, `Robotics` → `Robot Kinematics`) with dedicated SEO-friendly routes (`/blog/control-theory/optimal-control`).
- **Independent Article URLs:** Articles live under `/blog/posts/[slug]` so reclassifying an article never breaks incoming backlinks.
- **Instant Search & Filtering:** Filter by category, subcategory, tags, or live debounced search across titles and Markdown bodies.

### 2. Engineering-Grade Markdown Writing Studio
- **CodeMirror 6 Foundation:** High-performance, distraction-free editing with line numbers, undo/redo, and keyboard shortcuts.
- **Split-Screen & Live Preview:** Switch instantly between Full Editor, Split Screen, and Live Preview modes.
- **LaTeX Mathematical Formulas:** Full **KaTeX** integration for inline ($E = mc^2$) and display equations:
  $$\dot{x} = Ax + Bu$$
- **Technical Diagrams:** Live-rendered **Mermaid** flowcharts, state diagrams, and sequences.
- **Source Code Highlighting:** C, C++, Python, MATLAB, JavaScript, TypeScript, Bash, and JSON with one-click copy buttons.
- **Drag-and-Drop & Clipboard Image Upload:** Paste screenshots straight from your clipboard into your article.
- **Autosave & Draft Status:** Automatic debounced draft saving with visible save status.
- **Markdown & Frontmatter Import:** Upload existing `.md` files; automatically parses title, description, and cover image from YAML frontmatter (with full UTF-8 and Vietnamese accent support).

### 3. Multi-Format Article Exports
Every published article features a clean export menu:
- **Markdown (.md):** Source Markdown complete with normalized YAML frontmatter.
- **Microsoft Word (.docx):** Generates true Microsoft Word documents with headings, styled paragraphs, and code blocks using the `docx` library.
- **Printable PDF (.pdf):** Clean, margins-optimized publication print view.

### 4. Admin Content Management System (`/admin`)
- **Protected Admin Gateway:** Accessible only by the authorized administrator via Supabase Auth or local session authentication.
- **Projects Showcase CMS:** Manage robotics hardware projects, specifications matrices (payload, reach, actuator types), GitHub repositories, and demo videos.
- **Media Asset Library:** Browse uploaded figures, copy Markdown image tags with one click, and safely validate file sizes and MIME types (unsafe executables are automatically rejected).
- **Profile & Branding Customizer:** Edit your biography, technical skills matrix, education, experience, social profiles, and resume link without touching code.

---

## 🛠️ Technology Stack & Pinned Versions

| Layer | Technology | Selected Version |
|---|---|---|
| **Framework** | Next.js (App Router) | `15.5.x` |
| **Runtime / UI** | React / React DOM | `19.0.x` |
| **Language** | TypeScript | `5.7.x` |
| **Styling** | Tailwind CSS & Typography | `3.4.x` |
| **Icons** | Lucide Icons | `0.475.x` |
| **Database & Auth** | Supabase PostgreSQL & Auth | `@supabase/ssr 0.5.x` |
| **Markdown & Math** | CodeMirror 6, KaTeX, Mermaid | `@codemirror 6.x`, `katex 0.16.x` |
| **Document Export** | docx.js | `docx 9.2.x` |
| **Validation** | Zod | `3.24.x` |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js LTS (v20+ or v24 LTS recommended)
- Git

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd PORTFORLIO
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **💡 Zero-Config Local Preview:**  
> The platform includes a built-in offline mock store seeded with realistic robotics projects and control theory articles. You can immediately access the public website and log in to the admin console at `http://localhost:3000/admin` using the password:
> ```
> admin123
> ```

### 3. Run Automated Tests
```bash
npm test
```
Runs 9 comprehensive test suites validating schema sanitization, Vietnamese diacritic slug generation, draft exclusion policies, nested category hierarchies, and DOCX document generation.

---

## ☁️ Production Deployment Guide

Deploying your personal platform involves three free services: **GitHub**, **Supabase**, and **Vercel**.

### Step 1: Set Up Supabase (Database & Storage)

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**, select an organization, name it (e.g. `robotics-portfolio`), choose a strong database password, and pick a region close to your target audience.
3. Once created, open the **SQL Editor** tab from the left sidebar.
4. Click **New Query**, open the file [`supabase/migrations/001_initial_schema.sql`](file:///d:/PROJECT/PORTFORLIO/supabase/migrations/001_initial_schema.sql) in this repository, paste its entire contents into the SQL Editor, and click **Run**.
   - *This creates all tables (`profiles`, `blog_categories`, `blog_posts`, `projects`, etc.) and sets up Row Level Security (RLS) so only you can edit content while the public can only view published articles.*
5. Set up Storage:
   - In Supabase, go to **Storage** → **New Bucket**.
   - Name the bucket `media`.
   - Check the toggle **Public bucket** (so images are viewable by readers).
   - Click **Save bucket**.
6. Create your Admin User:
   - In Supabase, go to **Authentication** → **Users** → **Add User** → **Create User**.
   - Enter your email address and a strong password.
7. Get your API credentials:
   - In Supabase, go to **Project Settings** (gear icon) → **API**.
   - Note down:
     - `Project URL`
     - `anon public` key
     - `service_role` secret key

---

### Step 2: Push Source Code to GitHub

1. Create a new repository on [github.com](https://github.com) named `portfolio`.
2. In your local terminal, initialize and push:
   ```bash
   git init
   git add .
   git commit -m "feat: complete engineering portfolio and technical blogging platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```

---

### Step 3: Deploy to Vercel

1. Log in to [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New...** → **Project**.
3. Select your `portfolio` GitHub repository and click **Import**.
4. In the **Environment Variables** section, add the following variables:

| Variable Name | Value | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Your Supabase `anon public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Your Supabase `service_role` secret key |
| `NEXT_PUBLIC_SITE_URL` | `https://your-custom-domain.vercel.app` | Your Vercel production URL |

5. Click **Deploy**.
6. Vercel will build the project and provide you with a live production URL (e.g., `https://portfolio-xxxx.vercel.app`).

---

## 🔒 Security Best Practices

- **Row Level Security (RLS):** Enforced at the PostgreSQL level. Direct REST requests without a valid admin token cannot modify data or view drafts.
- **Zero Client Leaks:** The `SUPABASE_SERVICE_ROLE_KEY` is strictly accessed in Server Actions and Route Handlers; it is never included in client JavaScript bundles.
- **Input Validation:** All article, category, project, and profile updates are verified with strict **Zod** schemas before reaching the database.
- **Safe Markdown Rendering:** Code blocks and KaTeX math are sanitized to prevent cross-site scripting (XSS).

---

## 📝 License
MIT License. Free to use, adapt, and customize for your personal portfolio and technical writing.
