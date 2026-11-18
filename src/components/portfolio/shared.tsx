import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal3D } from "./motion";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto w-[min(1240px,94vw)] scroll-mt-28 py-10 sm:py-14", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
}) {
  return (
    <Reveal3D className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-2.5 inline-flex rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold sm:text-3xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {description ? (
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </Reveal3D>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-border bg-surface-2/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="glass mt-8 rounded-3xl p-10 text-center">
      <p className="font-display text-base">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {hint ?? "Add items from the Portfolio Manager and they will appear here automatically."}
      </p>
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-foreground">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
