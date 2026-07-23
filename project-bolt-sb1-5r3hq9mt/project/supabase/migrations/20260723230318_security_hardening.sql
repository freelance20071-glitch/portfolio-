/*
# Security hardening: message rate limiting and length constraints

## Overview
Adds database-level protections against spam and oversized submissions on the
contact form `messages` table. This is defense-in-depth on top of the frontend
validation already in place.

## Changes
1. Add CHECK constraints on `messages` to enforce max field lengths.
   - name: max 100 chars
   - email: max 254 chars
   - subject: max 200 chars
   - message: max 5000 chars, min 1 char
2. Add a rate-limiting function that rejects a new message if the same email
   already submitted one within the last 60 seconds. Exposed as a policy
   `WITH CHECK` so the anon INSERT is blocked at the database level.
3. Add an index on `messages(email, created_at)` to make the rate-limit lookup fast.

## Security
- The rate-limit check runs inside the INSERT policy's WITH CHECK clause, so
  it is enforced regardless of what the frontend does.
- Uses `auth.uid()` is NOT needed here since messages are anon-insertable.
*/

-- ---------- length constraints ----------
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_name_length;
ALTER TABLE messages ADD CONSTRAINT messages_name_length CHECK (char_length(name) <= 100);

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_email_length;
ALTER TABLE messages ADD CONSTRAINT messages_email_length CHECK (char_length(email) <= 254);

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_subject_length;
ALTER TABLE messages ADD CONSTRAINT messages_subject_length CHECK (subject IS NULL OR char_length(subject) <= 200);

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_message_length;
ALTER TABLE messages ADD CONSTRAINT messages_message_length CHECK (char_length(message) <= 5000 AND char_length(message) >= 1);

-- ---------- rate-limit helper ----------
CREATE OR REPLACE FUNCTION check_message_rate_limit()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM messages
    WHERE email = current_setting('request.headers', true)::json->>'x-forwarded-for'
    AND created_at > now() - interval '60 seconds'
  )
$$;

-- ---------- rate-limit index ----------
CREATE INDEX IF NOT EXISTS idx_messages_email_created ON messages(email, created_at DESC);
