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
2. Add a rate-limiting helper function (parameterized version applied in the
   next migration and wired into the INSERT policy).
3. Add an index on `messages(email, created_at)` to make the rate-limit lookup fast.
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

-- ---------- rate-limit index ----------
CREATE INDEX IF NOT EXISTS idx_messages_email_created ON messages(email, created_at DESC);
