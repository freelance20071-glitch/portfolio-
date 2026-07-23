/*
# Create portfolio-media storage bucket

## Overview
Creates the public storage bucket used for profile images, project cover/gallery
images, and testimonial avatars. The storage RLS policies (next migration)
reference this bucket by name.

## New Storage
- `portfolio-media` bucket (public = true) — stores all portfolio media.
*/

INSERT INTO storage.buckets (id, name, public)
SELECT 'portfolio-media', 'portfolio-media', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'portfolio-media');
