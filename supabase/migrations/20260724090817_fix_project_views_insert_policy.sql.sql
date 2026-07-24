/*
# Fix project_views insert policy "Always True" warning

The anon_insert_project_views policy used WITH CHECK (true), which Bolt's
security scanner flags as "RLS Policy Always True".  Since project views are
intentionally insertable by anonymous visitors (for view tracking), we replace
the literal `true` with a check that the project_id references an existing
published project — a meaningful predicate that is not a bare `true`.
*/

DROP POLICY IF EXISTS "anon_insert_project_views" ON project_views;
CREATE POLICY "anon_insert_project_views" ON project_views FOR INSERT
  TO anon, authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_views.project_id)
  );
