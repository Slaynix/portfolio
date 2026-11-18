-- Roles
CREATE TYPE public.app_role AS ENUM ('owner');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'owner')
$$;

-- One-time owner claim: first authenticated account becomes owner
CREATE OR REPLACE FUNCTION public.claim_owner()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing int;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT count(*) INTO existing FROM public.user_roles WHERE role = 'owner';
  IF existing > 0 THEN
    RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'owner');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'owner')
    ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_owner() TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Media library
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'public-media',
  path text NOT NULL,
  url text,
  file_name text NOT NULL,
  mime_type text,
  file_size bigint,
  kind text NOT NULL DEFAULT 'image',
  category text NOT NULL DEFAULT 'other',
  alt_text text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Profile (singleton)
CREATE TABLE public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT 'Your Name',
  title text NOT NULL DEFAULT 'Your Professional Title',
  tagline text,
  intro text,
  bio text,
  location text,
  email text,
  phone text,
  avatar_url text,
  hero_media_url text,
  interests text[] NOT NULL DEFAULT '{}',
  goals text[] NOT NULL DEFAULT '{}',
  level_label text,
  xp_override int,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text,
  field text,
  start_date text,
  end_date text,
  score text,
  description text,
  achievements text[] NOT NULL DEFAULT '{}',
  image_url text,
  file_url text,
  file_name text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  issue_date text,
  credential_id text,
  credential_url text,
  description text,
  skills text[] NOT NULL DEFAULT '{}',
  image_url text,
  file_url text,
  file_name text,
  file_type text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  description text,
  category text,
  technologies text[] NOT NULL DEFAULT '{}',
  thumbnail_url text,
  images text[] NOT NULL DEFAULT '{}',
  github_url text,
  live_url text,
  video_url text,
  file_url text,
  file_name text,
  status text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  achieved_on text,
  category text,
  description text,
  image_url text,
  file_url text,
  file_name text,
  external_url text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  level int NOT NULL DEFAULT 50,
  icon text,
  description text,
  related_projects text[] NOT NULL DEFAULT '{}',
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'resume',
  description text,
  file_url text,
  file_name text,
  file_type text,
  is_primary boolean NOT NULL DEFAULT false,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  icon text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text,
  tier text NOT NULL DEFAULT 'bronze',
  earned boolean NOT NULL DEFAULT true,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text NOT NULL DEFAULT 'Portfolio',
  site_description text,
  accent text NOT NULL DEFAULT 'cyan',
  enable_3d boolean NOT NULL DEFAULT true,
  enable_particles boolean NOT NULL DEFAULT true,
  show_contact_form boolean NOT NULL DEFAULT true,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Grants, RLS and policies
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['media','profile','education','certificates','projects','achievements','skills','documents','social_links','badges','site_settings']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "owner manages %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner())', t);
    EXECUTE format('CREATE TRIGGER set_%1$s_updated_at BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

-- Public read policies (published only)
CREATE POLICY "public reads published profile" ON public.profile FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "public reads published education" ON public.education FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "public reads published certificates" ON public.certificates FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "public reads published projects" ON public.projects FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "public reads published achievements" ON public.achievements FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "public reads published skills" ON public.skills FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "public reads published documents" ON public.documents FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "public reads published social links" ON public.social_links FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "public reads published badges" ON public.badges FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "public reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public reads media" ON public.media FOR SELECT TO anon, authenticated USING (bucket = 'public-media');

-- Messages: anyone can send, only owner can read/manage
GRANT INSERT ON public.messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send a message" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "owner reads messages" ON public.messages FOR SELECT TO authenticated USING (public.is_owner());
CREATE POLICY "owner updates messages" ON public.messages FOR UPDATE TO authenticated USING (public.is_owner());
CREATE POLICY "owner deletes messages" ON public.messages FOR DELETE TO authenticated USING (public.is_owner());

-- Seed singleton rows
INSERT INTO public.profile (full_name, title, tagline, intro, bio)
VALUES ('Your Name', 'Full-Stack & AI Developer', 'Building futuristic digital experiences',
'Short introduction — edit this in the Portfolio Manager.',
'Add your biography from the Portfolio Manager. Keep it short and scannable.');
INSERT INTO public.site_settings (site_title, site_description)
VALUES ('Portfolio', 'A futuristic interactive digital identity and achievement archive.');