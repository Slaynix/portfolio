import { supabase } from "@/integrations/supabase/client";
import { guessKind } from "@/lib/media";

const BUCKET = "portfolio-media";

export function publicFileUrl(path: string) {
  return `/api/public/file/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export type MediaRow = {
  id: string;
  path: string;
  url: string | null;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  kind: string;
  category: string;
  alt_text: string | null;
  created_at: string;
};

export async function isOwner() {
  const { data, error } = await supabase.rpc("is_owner");
  if (error) return false;
  return Boolean(data);
}

export async function listRows(table: string) {
  const { data, error } = await supabase
    .from(table as never)
    .select("*")
    .order("sort_order" as never, { ascending: true })
    .order("created_at" as never, { ascending: true });
  if (error) {
    // tables without sort_order
    const fallback = await supabase.from(table as never).select("*");
    if (fallback.error) throw fallback.error;
    return (fallback.data ?? []) as Record<string, unknown>[];
  }
  return (data ?? []) as Record<string, unknown>[];
}

export async function saveRow(table: string, values: Record<string, unknown>, id?: string) {
  if (id) {
    const { error } = await supabase
      .from(table as never)
      .update(values as never)
      .eq("id" as never, id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await supabase
    .from(table as never)
    .insert(values as never)
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function deleteRow(table: string, id: string) {
  const { error } = await supabase
    .from(table as never)
    .delete()
    .eq("id" as never, id);
  if (error) throw error;
}

export async function setSortOrder(table: string, id: string, sort_order: number) {
  const { error } = await supabase
    .from(table as never)
    .update({ sort_order } as never)
    .eq("id" as never, id);
  if (error) throw error;
}

export async function listMedia() {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as MediaRow[];
}

export async function uploadFile(
  file: File,
  category: string,
  onProgress?: (percent: number) => void,
) {
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${category}/${Date.now()}-${safeName}`;
  onProgress?.(15);
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    ...(file.type ? { contentType: file.type } : {}),
  });
  if (error) throw error;
  onProgress?.(75);
  const url = publicFileUrl(path);
  const { data, error: rowError } = await supabase
    .from("media")
    .insert({
      bucket: BUCKET,
      path,
      url,
      file_name: file.name,
      mime_type: file.type || null,
      file_size: file.size,
      kind: guessKind(file.type, file.name),
      category,
    })
    .select("*")
    .single();
  if (rowError) throw rowError;
  onProgress?.(100);
  return data as unknown as MediaRow;
}

export async function deleteMedia(row: MediaRow) {
  await supabase.storage.from(BUCKET).remove([row.path]);
  const { error } = await supabase.from("media").delete().eq("id", row.id);
  if (error) throw error;
}

export async function listMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
