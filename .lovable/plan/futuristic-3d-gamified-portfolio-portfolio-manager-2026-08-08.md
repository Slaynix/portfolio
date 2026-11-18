# Futuristic 3D Gamified Portfolio + Portfolio Manager

Public site: anyone can browse your portfolio — no login, no personal/private data exposed.
Private manager: only you can sign in to add and edit content. Everything on the public site comes from the database, so you never touch code again.

## What gets built

### Backend (Lovable Cloud)
- Tables: `profile`, `about`, `education`, `certificates`, `projects`, `achievements`, `skills`, `documents` (resume + other files), `social_links`, `media`, `badges`, `settings`.
- Every content table has `published`, `sort_order`, timestamps, and flexible `extra` JSON so new fields never need a redesign.
- Public read policies return only `published` rows. All writes require the owner role (`user_roles` + `has_role`), never a client-side flag.
- Secure file storage buckets: `public-media` (images, videos, PDFs shown on site) and `private-media` (drafts/personal docs, signed URLs only).
- Owner-only sign-in at `/auth` (email + password). The first account you create is promoted to owner; nobody else can access the manager.

### Public sections (all data-driven, unlimited items)
Home, About, Education, Certificates, Projects, Achievements, Skills, Resume, Contact — each its own route with unique SEO metadata.
- Hero: name, title, intro, profile visual, XP/level indicators, badges, magnetic CTAs.
- Education: futuristic vertical 3D timeline cards with attachments.
- Certificates: 3D tilt/glow gallery -> large modal; images get zoom + fullscreen + download, PDFs get embedded viewer with zoom, fullscreen, download, open-in-new-tab.
- Projects: sticky stacking cards with scroll scaling and parallax -> detail modal with image gallery, tech badges, GitHub/live buttons, video and PDF.
- Achievements: badge grid with modal detail.
- Skills: interactive cards with category, XP level, icon, linked projects.
- Resume: view + download from your uploaded PDF (supports multiple documents).
- Contact: validated form (Zod) with loading/success/error states, saved to a `messages` table, plus social links.
- Gamification: level, XP, badges (AI Explorer, Code Builder, Problem Solver, Hackathon Participant, Full-Stack Learner, Innovation Builder), counts of certificates/projects/hackathons — derived automatically from your content.

### Portfolio Manager (`/manager`, owner only)
Sidebar dashboard: Profile, About, Education, Certificates, Projects, Achievements, Skills, Resume, Media Library, Social Links, Settings.
Every type supports Add, Edit, Preview, Replace, Delete, drag Reorder, Publish/Unpublish, Save.

### Uploads + Media Library
- Reusable drag-and-drop uploader: JPG/JPEG/PNG/WebP/SVG, PDF, MP4/WebM, DOC/DOCX/PPTX.
- Shows preview, name, type, size, progress, status, replace, delete, with clear error messages.
- Media Library: filter by type/category, search by filename, and a picker so any stored file can be attached to a certificate, project, achievement, education entry, or profile without re-uploading.

### Design & motion
Dark futuristic theme on `#0C0C0C`, neon gradient accents, glassmorphism, soft glow, large modern headings, generous spacing — all as semantic tokens in `src/styles.css`.
Framer Motion for fade-ins, scroll reveal, staggered cards, magnetic buttons, 3D tilt, parallax, modal transitions. React Three Fiber particle/geometry field behind the hero, lazy-loaded.

### Performance & responsiveness
Lazy-loaded 3D and PDF viewers, lazy images, memoized lists, reduced particle count and disabled heavy effects on mobile, full `prefers-reduced-motion` support, no horizontal scroll, touch-friendly targets, works from mobile to ultra-wide.

## Technical notes
- TanStack Start routes; reads go through public server functions, writes through `requireSupabaseAuth` server functions with owner-role checks. Manager routes live under the `_authenticated` gate.
- Reusable generic CRUD hooks + a schema-driven form/list layer, so a new content type is config, not new UI.
- Storage keys are namespaced per content type; private files served via short-lived signed URLs.
- No keys, admin credentials, or storage secrets in frontend code.

## Build order
1. Cloud enable + schema, grants, RLS, storage buckets, owner auth.
2. Design tokens, layout shell, 3D background, motion primitives.
3. Public sections wired to the database.
4. Manager dashboard, uploader, media library, reorder/publish.
5. Gamification, performance pass, responsive/QA pass.
