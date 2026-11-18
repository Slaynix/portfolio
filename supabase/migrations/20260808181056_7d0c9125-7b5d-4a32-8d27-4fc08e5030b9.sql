CREATE POLICY "owner manages portfolio media" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'portfolio-media' AND public.is_owner())
WITH CHECK (bucket_id = 'portfolio-media' AND public.is_owner());

-- media.bucket now stores the real bucket name
ALTER TABLE public.media ALTER COLUMN bucket SET DEFAULT 'portfolio-media';
UPDATE public.media SET bucket = 'portfolio-media' WHERE bucket = 'public-media';
DROP POLICY IF EXISTS "public reads media" ON public.media;
CREATE POLICY "public reads media" ON public.media FOR SELECT TO anon, authenticated USING (true);