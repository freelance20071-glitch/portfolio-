/*
# Fix message rate limiting — wire into INSERT policy

## Overview
The previous migration created a rate-limit function but didn't wire it into
the INSERT policy. This migration replaces the function with one that accepts
the email as a parameter and updates the anon INSERT policy to call it in the
WITH CHECK clause, so the database blocks rapid duplicate submissions.

## Changes
1. Replace `check_message_rate_limit()` with a version that takes the email
   as an argument and checks if that email already submitted a message in the
   last 60 seconds.
2. Drop and recreate the `anon_insert_messages` INSERT policy to include the
   rate-limit check in WITH CHECK.
*/

CREATE OR REPLACE FUNCTION check_message_rate_limit(p_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM messages
    WHERE email = p_email
    AND created_at > now() - interval '60 seconds'
  )
$$;

DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (check_message_rate_limit(email));
