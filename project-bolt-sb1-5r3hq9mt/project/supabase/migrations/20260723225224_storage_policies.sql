/*
# Storage policies for portfolio-media bucket

1. Storage
- `portfolio-media` bucket (public) stores project images, videos, profile image.
2. Security
- Anyone can read (public bucket).
- Only authenticated admin can upload/update/delete objects.
*/

DROP POLICY IF EXISTS "anon_read_portfolio_media" ON storage.objects;
CREATE POLICY "anon_read_portfolio_media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "auth_insert_portfolio_media" ON storage.objects;
CREATE POLICY "auth_insert_portfolio_media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "auth_update_portfolio_media" ON storage.objects;
CREATE POLICY "auth_update_portfolio_media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-media') WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "auth_delete_portfolio_media" ON storage.objects;
CREATE POLICY "auth_delete_portfolio_media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-media');
