// The shared Lovable config installs TanStack Start, React, Tailwind,
// path aliases, and Nitro. Let Nitro detect the deployment provider so
// Vercel builds use the Vercel preset instead of the Render preset.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Keep the project's custom SSR error wrapper as the TanStack server entry.
    server: { entry: "server" },
  },
});
