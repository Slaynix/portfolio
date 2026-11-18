DROP POLICY IF EXISTS "public reads media" ON public.media;
DROP POLICY IF EXISTS "public reads settings" ON public.site_settings;
REVOKE SELECT ON TABLE public.media FROM anon;
REVOKE SELECT ON TABLE public.site_settings FROM anon;