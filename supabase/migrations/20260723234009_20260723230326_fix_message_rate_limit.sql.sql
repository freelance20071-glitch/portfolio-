/*
# Fix message rate limiting — wire into INSERT policy

## Overview
Replaces the rate-limit helper with a parameterized version that accepts the
email as an argument, then updates the anon INSERT policy on `messages` to call
it in the WITH CHECK clause. This blocks rapid duplicate contact-form
submissions at the database level regardless of what the frontend does.

## Changes
1. Create/replace `check_message_rate_limit(p_email text)` — returns false if
   the given email already submitted a message in the last 60 seconds.
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
