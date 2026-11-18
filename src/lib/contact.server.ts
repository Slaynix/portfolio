import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const HOUR_MS = 60 * 60 * 1000;
const MAX_PER_EMAIL_PER_HOUR = 3;
const MAX_PER_VISITOR_PER_HOUR = 8;

export function hashVisitor(ip: string | undefined) {
  if (!ip) return null;
  const salt = process.env["SUPABASE_URL"] ?? "portfolio";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 40);
}

/** Rate-limits and stores a contact submission. Throws a user-facing Error when blocked. */
export async function storeContactMessage(input: ContactInput, ipHash: string | null) {
  const since = new Date(Date.now() - HOUR_MS).toISOString();
  const email = input.email.toLowerCase();

  const byEmail = await supabaseAdmin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);
  if ((byEmail.count ?? 0) >= MAX_PER_EMAIL_PER_HOUR) {
    throw new Error("You've already sent a few messages recently. Please try again later.");
  }

  if (ipHash) {
    const byVisitor = await supabaseAdmin
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if ((byVisitor.count ?? 0) >= MAX_PER_VISITOR_PER_HOUR) {
      throw new Error("Too many messages from this device. Please try again later.");
    }
  }

  const duplicate = await supabaseAdmin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .eq("message", input.message)
    .gte("created_at", new Date(Date.now() - 24 * HOUR_MS).toISOString());
  if ((duplicate.count ?? 0) > 0) {
    throw new Error("Looks like you already sent this message.");
  }

  const { error } = await supabaseAdmin.from("messages").insert({
    name: input.name,
    email,
    subject: input.subject || null,
    message: input.message,
    ip_hash: ipHash,
  });
  if (error) throw new Error("Could not send your message. Please try again.");
  return { ok: true as const };
}
