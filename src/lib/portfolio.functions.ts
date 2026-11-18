import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const PUBLIC_PROFILE_COLUMNS =
  "id, full_name, title, tagline, intro, bio, location, avatar_url, hero_media_url, interests, goals, level_label, xp_override, extra, published, created_at, updated_at";

export const getPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicClient();

  const [
    profile,
    education,
    certificates,
    projects,
    achievements,
    skills,
    documents,
    socialLinks,
    highlights,
    settings,
  ] = await Promise.all([
    db.from("profile").select(PUBLIC_PROFILE_COLUMNS).limit(1).maybeSingle(),
    db.from("education").select("*").eq("published", true).order("sort_order"),
    db.from("certificates").select("*").eq("published", true).order("sort_order"),
    db.from("projects").select("*").eq("published", true).order("sort_order"),
    db.from("achievements").select("*").eq("published", true).order("sort_order"),
    db.from("skills").select("*").eq("published", true).order("sort_order"),
    db.from("documents").select("*").eq("published", true).order("sort_order"),
    db.from("social_links").select("*").eq("published", true).order("sort_order"),
    db.from("highlights").select("*").eq("published", true).order("sort_order"),
    db.from("site_settings").select("*").limit(1).maybeSingle(),
  ]);

  return {
    profile: profile.data ?? null,
    education: education.data ?? [],
    certificates: certificates.data ?? [],
    projects: projects.data ?? [],
    achievements: achievements.data ?? [],
    skills: skills.data ?? [],
    documents: documents.data ?? [],
    socialLinks: socialLinks.data ?? [],
    highlights: highlights.data ?? [],
    settings: settings.data ?? null,
  };
});

export const sendMessage = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      name: string;
      email: string;
      subject: string;
      message: string;
      honeypot?: string;
      elapsedMs?: number;
    }) => {
    const name = data.name?.trim() ?? "";
    const email = data.email?.trim() ?? "";
    const subject = data.subject?.trim() ?? "";
    const message = data.message?.trim() ?? "";
      return {
        name,
        email,
        subject,
        message,
        honeypot: (data.honeypot ?? "").trim(),
        elapsedMs: typeof data.elapsedMs === "number" ? data.elapsedMs : undefined,
      };
    },
  )
  .handler(async ({ data }) => {
    const { name, email, subject, message } = data;
    const reject = (error: string) => ({ ok: false as const, error });
    if (data.honeypot.length > 0) return reject("Submission blocked.");
    if (typeof data.elapsedMs === "number" && data.elapsedMs < 2000)
      return reject("That was too fast — please take a moment and try again.");
    if (name.length < 2 || name.length > 100) return reject("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255)
      return reject("Please enter a valid email address.");
    if (subject.length > 150) return reject("Subject is too long.");
    if (message.length < 10 || message.length > 2000)
      return reject("Message must be between 10 and 2000 characters.");

    const { getRequestIP } = await import("@tanstack/react-start/server");
    const { hashVisitor, storeContactMessage } = await import("@/lib/contact.server");
    const ip = getRequestIP({ xForwardedFor: true });
    try {
      await storeContactMessage({ name, email, subject, message }, hashVisitor(ip));
      return { ok: true as const };
    } catch (error) {
      return reject(
        error instanceof Error ? error.message : "Could not send your message. Please try again.",
      );
    }
  });
