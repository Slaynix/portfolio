import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import { isPdf, isVideo } from "@/lib/media";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export type MediaViewerProps = {
  open: boolean;
  onClose: () => void;
  url: string;
  fileName?: string | null;
  title?: string | null;
  subtitle?: string | null;
  children?: React.ReactNode;
};

export function MediaViewer({
  open,
  onClose,
  url,
  fileName,
  title,
  subtitle,
  children,
}: MediaViewerProps) {
  const [zoom, setZoom] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);
  const pdf = isPdf(url, fileName);
  const video = isVideo(url, fileName);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const goFullscreen = () => {
    void frameRef.current?.requestFullscreen?.();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-6">
      <button
        aria-label="Close preview"
        onClick={onClose}
        className="absolute inset-0 bg-background/85 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-[92vh] w-[min(1200px,96vw)] flex-col overflow-hidden rounded-3xl glass glow-ring"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 p-4">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold">{title ?? fileName}</p>
            {subtitle ? (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {!pdf && !video ? (
              <>
                <IconBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.25))}>
                  <Minus className="h-4 w-4" />
                </IconBtn>
                <span className="w-12 text-center text-xs text-muted-foreground">
                  {Math.round(zoom * 100)}%
                </span>
                <IconBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(4, z + 0.25))}>
                  <Plus className="h-4 w-4" />
                </IconBtn>
                <IconBtn label="Reset zoom" onClick={() => setZoom(1)}>
                  <RotateCcw className="h-4 w-4" />
                </IconBtn>
              </>
            ) : null}
            <IconBtn label="Fullscreen" onClick={goFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </IconBtn>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label="Open in new tab"
              className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-surface-2"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={url}
              download={fileName ?? true}
              aria-label="Download file"
              className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-surface-2"
            >
              <Download className="h-4 w-4" />
            </a>
            <IconBtn label="Close" onClick={onClose}>
              <X className="h-4 w-4" />
            </IconBtn>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-0 lg:flex-row">
          <div
            ref={frameRef}
            className={cn(
              "scrollbar-slim min-h-0 flex-1 overflow-auto bg-black/40",
              !pdf && !video ? "grid place-items-center p-4" : "",
            )}
          >
            {pdf ? (
              <iframe
                src={`${url}#view=FitH`}
                title={title ?? "Document"}
                className="h-full min-h-[60vh] w-full border-0 bg-white"
              />
            ) : video ? (
              <video src={url} controls className="h-full w-full bg-black" />
            ) : (
              <img
                src={url}
                alt={title ?? fileName ?? "Preview"}
                style={{ transform: `scale(${zoom})` }}
                className="max-h-full origin-center transition-transform duration-200"
                loading="lazy"
              />
            )}
          </div>
          {children ? (
            <aside className="scrollbar-slim max-h-[38vh] shrink-0 overflow-auto border-t border-border/70 p-5 lg:max-h-none lg:w-[340px] lg:border-l lg:border-t-0">
              {children}
            </aside>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-xl border border-border transition-colors hover:bg-surface-2"
    >
      {children}
    </button>
  );
}
