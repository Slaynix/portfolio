CREATE TABLE public.highlights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL DEFAULT 'highlight',
  title text NOT NULL,
  description text,
  icon text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.highlights TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.highlights TO authenticated;
GRANT ALL ON public.highlights TO service_role;

ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public reads published highlights" ON public.highlights
  FOR SELECT TO anon, authenticated USING (published);

CREATE POLICY "owner manages highlights" ON public.highlights
  FOR ALL TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());

CREATE TRIGGER highlights_set_updated_at BEFORE UPDATE ON public.highlights
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.highlights (section, title, description, icon, sort_order) VALUES
  ('highlight', 'B.Tech in AI & Machine Learning', 'St. John College of Engineering and Management — CGPA 9.30', 'GraduationCap', 0),
  ('highlight', 'Full-Stack & AI Project Development', 'Builds AI-powered web applications end to end.', 'Rocket', 1),
  ('highlight', 'Hackathon & Innovation Enthusiast', 'Turns ideas into working prototypes under time pressure.', 'Trophy', 2),
  ('highlight', 'Strong Problem-Solving Mindset', 'C, C++, Python and DSA fundamentals applied to real problems.', 'Brain', 3),
  ('focus', 'AI Application Development', 'Building tools that use LLM and Gemini APIs in real products.', 'Sparkles', 0),
  ('focus', 'Modern Web Engineering', 'React, TypeScript and Tailwind CSS interfaces with motion.', 'Code2', 1),
  ('focus', 'Backend & Data', 'Supabase, databases and secure API design.', 'Database', 2),
  ('learning', 'Machine Learning', 'Model training workflows and applied ML foundations.', 'Cpu', 0),
  ('learning', 'Generative AI', 'Prompt engineering and Gemini API integrations.', 'Wand2', 1),
  ('learning', 'Data Structures & Algorithms', 'Consistent practice for interviews and contests.', 'Binary', 2);