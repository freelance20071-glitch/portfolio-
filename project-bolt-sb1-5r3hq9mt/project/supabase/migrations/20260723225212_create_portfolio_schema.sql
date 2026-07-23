/*
# Portfolio website schema

## Overview
Full schema for a personal portfolio website with an admin dashboard.
The public site reads published content anonymously; the admin (authenticated)
manages all content through a protected dashboard.

## New Tables
1. `profile` — single-row admin profile (name, title, bio, image, resume, socials, contact).
2. `projects` — portfolio projects with published/featured toggles, images, video, tech, features.
3. `skills` — skills grouped by category with percentage and display order.
4. `services` — offered services with icon, title, description, display order.
5. `experiences` — career timeline entries.
6. `messages` — contact form submissions (read/unread state).
7. `settings` — single-row site settings (theme, colors, font).
8. `project_views` — lightweight view counter for projects.

## Security (RLS)
- Public (anon) can SELECT published projects, profile, skills, services, experiences, settings.
- Public (anon) can INSERT messages (contact form) and project_views (view tracking).
- Authenticated admin has full CRUD on all tables.
- Drafts/unpublished projects are invisible to anon.
*/

-- ---------- profile ----------
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Your Name',
  title text NOT NULL DEFAULT 'Professional Title',
  bio text NOT NULL DEFAULT 'Short introduction about yourself.',
  profile_image_url text,
  resume_url text,
  email text,
  phone text,
  linkedin_url text,
  github_url text,
  fiverr_url text,
  contra_url text,
  years_experience integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_profile" ON profile;
CREATE POLICY "anon_read_profile" ON profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_profile" ON profile;
CREATE POLICY "auth_insert_profile" ON profile FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_profile" ON profile;
CREATE POLICY "auth_update_profile" ON profile FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_profile" ON profile;
CREATE POLICY "auth_delete_profile" ON profile FOR DELETE
  TO authenticated USING (true);

-- ---------- projects ----------
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text NOT NULL,
  long_description text NOT NULL,
  technologies text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  challenges_solved text,
  category text,
  status text NOT NULL DEFAULT 'completed',
  cover_image_url text,
  gallery_urls text[] NOT NULL DEFAULT '{}',
  video_url text,
  live_demo_url text,
  github_url text,
  completion_date date,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_published_projects" ON projects;
CREATE POLICY "anon_read_published_projects" ON projects FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- ---------- skills ----------
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  percentage integer NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  category text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_skills" ON skills;
CREATE POLICY "anon_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_skills" ON skills;
CREATE POLICY "auth_insert_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_skills" ON skills;
CREATE POLICY "auth_update_skills" ON skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_skills" ON skills;
CREATE POLICY "auth_delete_skills" ON skills FOR DELETE
  TO authenticated USING (true);

-- ---------- services ----------
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text,
  title text NOT NULL,
  description text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_services" ON services;
CREATE POLICY "anon_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

-- ---------- experiences ----------
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  description text,
  start_date text NOT NULL,
  end_date text,
  current boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_experiences" ON experiences;
CREATE POLICY "anon_read_experiences" ON experiences FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_experiences" ON experiences;
CREATE POLICY "auth_insert_experiences" ON experiences FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_experiences" ON experiences;
CREATE POLICY "auth_update_experiences" ON experiences FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_experiences" ON experiences;
CREATE POLICY "auth_delete_experiences" ON experiences FOR DELETE
  TO authenticated USING (true);

-- ---------- messages ----------
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_messages" ON messages;
CREATE POLICY "auth_read_messages" ON messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_messages" ON messages;
CREATE POLICY "auth_update_messages" ON messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_messages" ON messages;
CREATE POLICY "auth_delete_messages" ON messages FOR DELETE
  TO authenticated USING (true);

-- ---------- settings ----------
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme text NOT NULL DEFAULT 'dark',
  primary_color text NOT NULL DEFAULT '#2563eb',
  accent_color text NOT NULL DEFAULT '#06b6d4',
  font text NOT NULL DEFAULT 'Inter',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_settings" ON settings;
CREATE POLICY "anon_read_settings" ON settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_settings" ON settings;
CREATE POLICY "auth_insert_settings" ON settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_settings" ON settings;
CREATE POLICY "auth_update_settings" ON settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_settings" ON settings;
CREATE POLICY "auth_delete_settings" ON settings FOR DELETE
  TO authenticated USING (true);

-- ---------- project_views ----------
CREATE TABLE IF NOT EXISTS project_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_project_views" ON project_views;
CREATE POLICY "anon_insert_project_views" ON project_views FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_project_views" ON project_views;
CREATE POLICY "auth_read_project_views" ON project_views FOR SELECT
  TO authenticated USING (true);

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON experiences(display_order);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_views_project_id ON project_views(project_id);

-- ---------- seed default profile + settings ----------
INSERT INTO profile (name, title, bio, years_experience, email)
SELECT 'Alex Morgan', 'Senior Full-Stack Engineer & UI Designer',
       'I craft modern, performant web applications and design systems. Passionate about clean architecture, delightful user experiences, and shipping products that feel premium.',
       7, 'hello@alexmorgan.dev'
WHERE NOT EXISTS (SELECT 1 FROM profile);

INSERT INTO settings (theme, primary_color, accent_color, font)
SELECT 'dark', '#2563eb', '#06b6d4', 'Inter'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- ---------- seed sample skills ----------
INSERT INTO skills (name, icon, percentage, category, display_order)
SELECT * FROM (VALUES
  ('React', 'Code', 95, 'Frontend', 1),
  ('TypeScript', 'Code', 90, 'Frontend', 2),
  ('Tailwind CSS', 'Palette', 92, 'Frontend', 3),
  ('Next.js', 'Globe', 85, 'Frontend', 4),
  ('Node.js', 'Server', 88, 'Backend', 1),
  ('Python', 'Server', 80, 'Backend', 2),
  ('PostgreSQL', 'Database', 85, 'Databases', 1),
  ('MongoDB', 'Database', 75, 'Databases', 2),
  ('Figma', 'PenTool', 90, 'UI/UX', 1),
  ('Framer Motion', 'Sparkles', 85, 'UI/UX', 2),
  ('OpenAI API', 'Bot', 80, 'AI Tools', 1),
  ('Vercel', 'Rocket', 88, 'Deployment', 1),
  ('Docker', 'Container', 78, 'Deployment', 2)
) AS v(name, icon, percentage, category, display_order)
WHERE NOT EXISTS (SELECT 1 FROM skills);

-- ---------- seed sample services ----------
INSERT INTO services (icon, title, description, display_order)
SELECT * FROM (VALUES
  ('Layout', 'Website Design', 'Custom, modern websites tailored to your brand and audience.', 1),
  ('AppWindow', 'Web Applications', 'Full-stack web apps with robust backends and intuitive frontends.', 2),
  ('BarChart3', 'Dashboard Development', 'Data-rich admin dashboards and analytics tools.', 3),
  ('Smartphone', 'Responsive Design', 'Pixel-perfect experiences across every device size.', 4),
  ('Rocket', 'Landing Pages', 'High-converting landing pages that load fast and look stunning.', 5),
  ('PenTool', 'UI/UX Design', 'User-centered design systems and interactive prototypes.', 6)
) AS v(icon, title, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM services);

-- ---------- seed sample experiences ----------
INSERT INTO experiences (role, company, description, start_date, end_date, current, display_order)
SELECT * FROM (VALUES
  ('Senior Full-Stack Engineer', 'Nimbus Labs', 'Leading frontend architecture and design system for a SaaS platform serving 100k+ users.', '2021', 'Present', true, 1),
  ('Frontend Engineer', 'Brightwave Studio', 'Built marketing sites and web apps for startups and enterprise clients.', '2018', '2021', false, 2),
  ('UI Designer', 'Pixel Forge', 'Designed interfaces and brand systems for digital products.', '2016', '2018', false, 3)
) AS v(role, company, description, start_date, end_date, current, display_order)
WHERE NOT EXISTS (SELECT 1 FROM experiences);

-- ---------- seed sample projects ----------
INSERT INTO projects (title, slug, short_description, long_description, technologies, features, challenges_solved, category, status, cover_image_url, gallery_urls, video_url, live_demo_url, github_url, completion_date, featured, published)
SELECT * FROM (VALUES
  ('Nimbus Analytics', 'nimbus-analytics',
   'A real-time analytics dashboard for SaaS teams.',
   'Nimbus Analytics is a comprehensive analytics platform that gives product teams real-time visibility into user behavior, funnels, and retention. Built with a focus on performance and clarity.',
   ARRAY['React','TypeScript','Node.js','PostgreSQL','Tailwind CSS'],
   ARRAY['Real-time event tracking','Custom funnel builder','Exportable reports','Role-based access'],
   'Handling high-throughput event ingestion with sub-second query latency.',
   'Web Applications','completed',
   'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200',
   ARRAY['https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200'],
   'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
   'https://example.com','https://github.com/example/nimbus', DATE '2023-09-15', true, true),
  ('Aurora Commerce', 'aurora-commerce',
   'A headless e-commerce storefront with a premium feel.',
   'Aurora Commerce is a headless storefront built for speed and conversion. Features a custom checkout, advanced filtering, and a fully responsive design system.',
   ARRAY['Next.js','Stripe','Supabase','Tailwind CSS'],
   ARRAY['Headless CMS integration','Stripe checkout','Advanced product filtering','Wishlist & cart'],
   'Optimizing Core Web Vitals while supporting thousands of product variants.',
   'Web Applications','completed',
   'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1200',
   ARRAY['https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200'],
   NULL, 'https://example.com','https://github.com/example/aurora', DATE '2023-05-20', true, true),
  ('Pulse Design System', 'pulse-design-system',
   'An open-source component library for modern apps.',
   'Pulse is a design system and component library built with accessibility and theming at its core. Used across multiple products to ensure consistency.',
   ARRAY['React','TypeScript','Storybook','Framer Motion'],
   ARRAY['50+ accessible components','Dark mode support','Token-based theming','Zero-runtime CSS'],
   'Building a theming engine that supports runtime color switching without flash.',
   'UI/UX','completed',
   'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1200',
   ARRAY['https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=1200'],
   NULL, NULL, 'https://github.com/example/pulse', DATE '2022-11-10', false, true)
) AS v(title, slug, short_description, long_description, technologies, features, challenges_solved, category, status, cover_image_url, gallery_urls, video_url, live_demo_url, github_url, completion_date, featured, published)
WHERE NOT EXISTS (SELECT 1 FROM projects);
