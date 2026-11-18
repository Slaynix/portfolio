import { createFileRoute } from "@tanstack/react-router";

/**
 * Serves portfolio media (images / PDFs / videos) from private storage.
 * Only the owner can upload, so every object in this bucket is portfolio
 * material that is meant to be publicly viewable.
 */
export const Route = createFileRoute("/api/public/file/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage
          .from("portfolio-media")
          .createSignedUrl(path, 60 * 60);

        if (error || !data?.signedUrl) return new Response("Not found", { status: 404 });

        const upstream = await fetch(data.signedUrl);
        if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404 });

        const headers = new Headers();
        headers.set("content-type", upstream.headers.get("content-type") ?? "application/octet-stream");
        const length = upstream.headers.get("content-length");
        if (length) headers.set("content-length", length);
        headers.set("cache-control", "public, max-age=3600");
        return new Response(upstream.body, { status: 200, headers });
      },
    },
  },
});
