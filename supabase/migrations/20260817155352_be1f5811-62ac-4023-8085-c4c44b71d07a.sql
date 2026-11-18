ALTER TABLE public.messages
  ADD CONSTRAINT messages_name_len CHECK (char_length(btrim(name)) BETWEEN 2 AND 100) NOT VALID,
  ADD CONSTRAINT messages_email_valid CHECK (char_length(email) <= 255 AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') NOT VALID,
  ADD CONSTRAINT messages_subject_len CHECK (subject IS NULL OR char_length(subject) <= 150) NOT VALID,
  ADD CONSTRAINT messages_message_len CHECK (char_length(btrim(message)) BETWEEN 10 AND 2000) NOT VALID;

REVOKE SELECT ON public.profile FROM anon;
GRANT SELECT (
  id, full_name, title, tagline, intro, bio, location, avatar_url, hero_media_url,
  interests, goals, level_label, xp_override, extra, published, created_at, updated_at
) ON public.profile TO anon;