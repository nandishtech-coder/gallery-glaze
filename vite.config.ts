import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Disable the Cloudflare Worker build wrapper so the SSR bundle emits
// `dist/server/server.js` (which TanStack's SPA prerender expects),
// and produce a static `dist/client/index.html` shell for Vercel.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    spa: {
      enabled: true,
    },
  },
});
