import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isOwner, listMessages } from "@/lib/manager-api";
import { ENTITIES } from "@/lib/manager-schema";
import { EntityManager } from "@/components/manager/EntityManager";
import { MediaLibrary } from "@/components/manager/MediaPicker";

export const Route = createFileRoute("/_authenticated/manager")({
  head: () => ({
    meta: [
      { title: "Portfolio Manager — Owner Dashboard" },
      {
        name: "description",
        content: "Private dashboard to add, edit, reorder and publish portfolio content and files.",
      },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Portfolio Manager — Owner Dashboard" },
      { property: "og:description", content: "Private owner dashboard for portfolio content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Portfolio Manager — Owner Dashboard" },
      { name: "twitter:description", content: "Private dashboard to add, edit, reorder and publish portfolio content and files." },
    ],
  }),
  component: ManagerPage,
});

type TabKey = string;

function ManagerPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [owner, setOwner] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabKey>("profile");
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    void (async () => {
      const ok = await isOwner();
      setOwner(ok);
    })();
  }, []);

  useEffect(() => {
    if (owner && tab === "messages") {
      void listMessages()
        .then((rows) => setMessages(rows as Record<string, unknown>[]))
        .catch(() => setMessages([]));
    }
  }, [owner, tab]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (owner === null) {
    return <p className="mx-auto w-[min(1180px,92vw)] py-16 text-sm text-muted-foreground">Checking access…</p>;
  }

  if (!owner) {
    return (
      <div className="mx-auto w-[min(560px,92vw)] py-16">
        <div className="glass rounded-3xl p-8 text-center">
          <h1 className="font-display text-xl font-semibold">Owner access only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account is signed in but is not the portfolio owner, so it cannot edit content.
          </p>
          <button
            onClick={() => void signOut()}
            className="mt-6 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    ...ENTITIES.map((entity) => ({ key: entity.table, label: entity.label })),
    { key: "media", label: "Media Library" },
    { key: "messages", label: "Messages" },
  ];

  const active = ENTITIES.find((entity) => entity.table === tab);

  return (
    <div className="mx-auto w-[min(1180px,92vw)] py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">Private</p>
          <h1 className="font-display text-2xl font-semibold">
            <span className="text-gradient">Portfolio Manager</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="rounded-xl border border-border px-3 py-2 text-xs">
            View site
          </Link>
          <button
            onClick={() => void signOut()}
            className="rounded-xl border border-border px-3 py-2 text-xs"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="glass h-max rounded-3xl p-2">
          <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`whitespace-nowrap rounded-2xl px-3 py-2 text-left text-xs transition-colors ${
                  tab === item.key
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0">
          {active ? (
            <EntityManager key={active.table} config={active} />
          ) : tab === "media" ? (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">
                <span className="text-gradient">Media Library</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Upload images, PDFs, videos and documents once, then reuse them anywhere.
              </p>
              <MediaLibrary />
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="font-display text-xl font-semibold">
                <span className="text-gradient">Messages</span>
              </h2>
              {messages.length === 0 ? (
                <p className="glass rounded-2xl p-6 text-sm text-muted-foreground">
                  No messages yet.
                </p>
              ) : (
                messages.map((row) => (
                  <div key={String(row["id"])} className="glass rounded-2xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{String(row["name"])}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(String(row["created_at"])).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{String(row["email"])}</p>
                    {row["subject"] ? (
                      <p className="mt-2 text-xs font-medium">{String(row["subject"])}</p>
                    ) : null}
                    <p className="mt-1 whitespace-pre-wrap text-sm">{String(row["message"])}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
