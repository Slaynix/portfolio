// The shared Lovable config installs TanStack Start, React, Tailwind,
// path aliases, and Nitro. Override Nitro's default Cloudflare preset for Render.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "render_com",
  },
  tanstackStart: {
    // Keep the project's custom SSR error wrapper as the TanStack server entry.
    server: { entry: "server" },
  },
});
