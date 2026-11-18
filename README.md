# Sanskar Girase — Portfolio

A content-driven personal portfolio built with React, TypeScript, TanStack Start, Tailwind CSS, Three.js, Motion, and Supabase. The experience combines a futuristic visual style with a private portfolio manager for maintaining profile content and media.

## Features

- Responsive portfolio sections for introduction, about, education, credentials, projects, skills, and contact.
- Interactive visual effects, motion, and 3D elements.
- Supabase-backed content and authentication integrations.
- Private manager dashboard for portfolio content and media.
- Supabase migrations maintained in `supabase/migrations/`.

## Requirements

- Node.js 22 or later
- Bun (the repository uses `bun.lock`)
- A Supabase project for database-backed and authenticated features

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/Slaynix/sanskar-girase-portfolio.git
   cd sanskar-girase-portfolio
   ```

2. Install dependencies:

   ```bash
   bun install --frozen-lockfile
   ```

3. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

4. Fill in the Supabase values in `.env`. Use the project's publishable key for browser-facing variables. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only and never prefix it with `VITE_`.

5. Start the development server:

   ```bash
   bun run dev
   ```

The development server URL is printed in the terminal after startup.

## Available scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run build` | Create a production build |
| `bun run build:dev` | Create a development-mode build |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format files with Prettier |

## Environment variables

Copy `.env.example` to `.env` and configure the values for your Supabase project.

| Variable | Usage |
| --- | --- |
| `SUPABASE_PROJECT_ID` | Supabase project identifier |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key used by server-side Supabase requests |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier exposed to the Vite client build |
| `VITE_SUPABASE_URL` | Supabase URL exposed to the Vite client build |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key exposed to the Vite client build |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for privileged Supabase operations; never expose it to the browser |

Do not commit `.env`, production credentials, service-role keys, or other secrets. Configure production variables in your hosting provider's environment settings.

## Database

Supabase configuration and SQL migrations are stored in `supabase/`. Review the migration files and apply them to the intended Supabase project using your normal Supabase CLI workflow.

## Git workflow

```bash
git status
git add .
git commit -m "chore: prepare portfolio for deployment"
git push origin main
```

Before pushing, confirm that `.env` is not staged:

```bash
git check-ignore -v .env
git status --short
```

## License

No license has been declared yet. Add a `LICENSE` file before permitting reuse or redistribution of this project.
