export function isPdf(url?: string | null, name?: string | null) {
  const target = `${url ?? ""} ${name ?? ""}`.toLowerCase();
  return target.includes(".pdf");
}

export function isVideo(url?: string | null, name?: string | null) {
  const target = `${url ?? ""} ${name ?? ""}`.toLowerCase();
  return [".mp4", ".webm", ".mov"].some((ext) => target.includes(ext));
}

export function isImage(url?: string | null, name?: string | null) {
  const target = `${url ?? ""} ${name ?? ""}`.toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"].some((ext) =>
    target.includes(ext),
  );
}

export function formatBytes(bytes?: number | null) {
  if (!bytes && bytes !== 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export const MEDIA_CATEGORIES = [
  "profile",
  "certificate",
  "project",
  "achievement",
  "education",
  "resume",
  "logo",
  "video",
  "other",
] as const;

export function guessKind(mime: string, name: string) {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf" || name.toLowerCase().endsWith(".pdf")) return "pdf";
  return "document";
}
