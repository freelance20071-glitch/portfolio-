/*
# Add testimonials table and service_source on messages

## Overview
1. New `testimonials` table — client reviews with name, role, company, rating
   (1-5 stars), avatar, and review text. Displayed publicly to build trust for
   a new freelancer.
2. Add `source_service` column to `messages` — tracks which service card the
   visitor clicked to send the message, so the freelancer knows what the
   client wants.

## New Tables
- `testimonials`: id, client_name, client_role, client_company, avatar_url,
  rating (1-5), review_text, display_order, created_at.

## Modified Tables
- `messages`: added `source_service` text column (nullable).

## Security
- testimonials: public read (anon + authenticated), admin write (authenticated).
- messages: the source_service column is covered by existing policies since
  it's on the same table.
*/

-- ---------- testimonials ----------
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_role text,
  client_company text,
  avatar_url text,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_testimonials" ON testimonials;
CREATE POLICY "anon_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- ---------- messages: add source_service ----------
ALTER TABLE messages ADD COLUMN IF NOT EXISTS source_service text;

-- ---------- seed testimonials ----------
INSERT INTO testimonials (client_name, client_role, client_company, avatar_url, rating, review_text, display_order)
SELECT * FROM (VALUES
  ('Sarah Chen', 'Product Manager', 'Nimbus Labs',
   'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
   5,
   'Alex delivered our analytics dashboard ahead of schedule. The attention to detail and code quality were outstanding. Easily one of the best developers I have worked with.',
   1),
  ('James Patel', 'Founder & CEO', 'Aurora Commerce',
   'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
   5,
   'Our storefront conversion jumped 40% after Alex rebuilt it. He understood our brand instantly and the result was beyond what we imagined. Highly recommended.',
   2),
  ('Maria Garcia', 'Design Lead', 'Pulse Studio',
   'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
   5,
   'Working with Alex was a breeze. He took our design system and turned it into a polished, accessible component library. Communication was clear throughout.',
   3),
  ('David Kim', 'CTO', 'Brightwave',
   'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
   5,
   'Alex is a rare full-stack talent. He handled both the frontend architecture and the backend APIs with equal expertise. Will definitely hire again.',
   4),
  ('Emma Wilson', 'Marketing Director', 'Lumina',
   'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
   5,
   'The landing page Alex built for our campaign loaded instantly and looked stunning on every device. Our sign-up rate doubled. Fantastic work.',
   5)
) AS v(client_name, client_role, client_company, avatar_url, rating, review_text, display_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);
