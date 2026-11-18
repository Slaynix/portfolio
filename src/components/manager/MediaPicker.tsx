import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { deleteMedia, listMedia, uploadFile, type MediaRow } from "@/lib/manager-api";
import { MEDIA_CATEGORIES, formatBytes, isImage } from "@/lib/media";
import { cn } from "@/lib/utils";

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/svg+xml,image/gif,application/pdf,video/mp4,video/webm,.doc,.docx,.ppt,.pptx";

export function MediaLibrary({
  onPick,
  onClose,
  defaultCategory = "other",
  compact = false,
}: {
  onPick?: (row: MediaRow) => void;
  onClose?: () => void;
  defaultCategory?: string;
  compact?: boolean;
}) {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(defaultCategory);
  const [filter, setFilter] = useState("");
  const [kind, setKind] = useState("all");
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    try {
      setRows(await listMedia());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load media.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 50MB.`);
        continue;
      }
      setProgress(5);
      try {
        const row = await uploadFile(file, category, setProgress);
        setRows((prev) => [row, ...prev]);
        toast.success(`${file.name} uploaded.`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Could not upload ${file.name}.`);
      } finally {
        setProgress(null);
      }
    }
  }

  const visible = rows.filter(
    (row) =>
      (kind === "all" || row.kind === kind) &&
      row.file_name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-xs"
        >
          {MEDIA_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
        >
          <Upload className="h-3.5 w-3.5" /> Upload files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search filename…"
          className="min-w-[140px] flex-1 rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-xs"
        />
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-xs"
        >
          {["all", "image", "pdf", "video", "document"].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {progress !== null ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading library…
        </div>
      ) : visible.length === 0 ? (
        <p className="py-8 text-sm text-muted-foreground">
          No files yet. Upload images, PDFs, videos or documents and reuse them anywhere.
        </p>
      ) : (
        <div
          className={cn(
            "grid gap-3",
            compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {visible.map((row) => (
            <div key={row.id} className="glass overflow-hidden rounded-2xl">
              <div className="grid h-28 place-items-center bg-surface-2/60">
                {isImage(row.url, row.file_name) ? (
                  <img
                    src={row.url ?? ""}
                    alt={row.alt_text ?? row.file_name}
                    loading="lazy"
                    className="h-28 w-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {row.kind}
                  </span>
                )}
              </div>
              <div className="space-y-2 p-2.5">
                <p className="truncate text-[11px]" title={row.file_name}>
                  {row.file_name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {row.category} · {formatBytes(row.file_size)}
                </p>
                <div className="flex items-center gap-1.5">
                  {onPick ? (
                    <button
                      type="button"
                      onClick={() => onPick(row)}
                      className="flex-1 rounded-lg bg-primary/15 px-2 py-1 text-[11px] text-primary"
                    >
                      Use
                    </button>
                  ) : (
                    <a
                      href={row.url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 rounded-lg bg-primary/15 px-2 py-1 text-center text-[11px] text-primary"
                    >
                      Open
                    </a>
                  )}
                  <button
                    type="button"
                    aria-label={`Delete ${row.file_name}`}
                    onClick={async () => {
                      if (!confirm(`Delete ${row.file_name}?`)) return;
                      try {
                        await deleteMedia(row);
                        setRows((prev) => prev.filter((item) => item.id !== row.id));
                      } catch (error) {
                        toast.error(
                          error instanceof Error ? error.message : "Could not delete file.",
                        );
                      }
                    }}
                    className="grid h-6 w-6 place-items-center rounded-lg border border-border text-muted-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaPickerDialog({
  open,
  onClose,
  onPick,
  category,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (row: MediaRow) => void;
  category?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur">
      <div className="glass max-h-[85vh] w-[min(900px,96vw)] overflow-y-auto rounded-3xl p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Media library</h2>
        <MediaLibrary
          compact
          defaultCategory={category ?? "other"}
          onClose={onClose}
          onPick={(row) => {
            onPick(row);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
