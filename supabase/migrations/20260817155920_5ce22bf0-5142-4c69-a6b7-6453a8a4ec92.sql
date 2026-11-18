ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS ip_hash text;

CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages (created_at DESC);
CREATE INDEX IF NOT EXISTS messages_ip_hash_idx ON public.messages (ip_hash);

DROP POLICY IF EXISTS "anyone can send a message" ON public.messages;

CREATE OR REPLACE FUNCTION public.submit_contact_message(
  _name text,
  _email text,
  _subject text,
  _message text,
  _ip_hash text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text := btrim(coalesce(_name, ''));
  v_email text := lower(btrim(coalesce(_email, '')));
  v_subject text := nullif(btrim(coalesce(_subject, '')), '');
  v_message text := btrim(coalesce(_message, ''));
  v_ip text := nullif(btrim(coalesce(_ip_hash, '')), '');
  v_count integer;
BEGIN
  IF char_length(v_name) < 2 OR char_length(v_name) > 100 THEN
    RAISE EXCEPTION 'invalid_name';
  END IF;
  IF char_length(v_email) > 255 OR v_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;
  IF v_subject IS NOT NULL AND char_length(v_subject) > 150 THEN
    RAISE EXCEPTION 'invalid_subject';
  END IF;
  IF char_length(v_message) < 10 OR char_length(v_message) > 2000 THEN
    RAISE EXCEPTION 'invalid_message';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.messages m
  WHERE lower(m.email) = v_email AND m.created_at > now() - interval '1 hour';
  IF v_count >= 3 THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;

  IF v_ip IS NOT NULL THEN
    SELECT count(*) INTO v_count
    FROM public.messages m
    WHERE m.ip_hash = v_ip AND m.created_at > now() - interval '1 hour';
    IF v_count >= 8 THEN
      RAISE EXCEPTION 'rate_limited';
    END IF;
  END IF;

  SELECT count(*) INTO v_count
  FROM public.messages m
  WHERE m.message = v_message AND m.created_at > now() - interval '1 day';
  IF v_count >= 1 THEN
    RAISE EXCEPTION 'duplicate_message';
  END IF;

  INSERT INTO public.messages (name, email, subject, message, ip_hash)
  VALUES (v_name, v_email, v_subject, v_message, v_ip);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_contact_message(text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_contact_message(text, text, text, text, text) TO anon, authenticated;