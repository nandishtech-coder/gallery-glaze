import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// On Vercel, build with Nitro's Vercel preset so the output lands in
// `.vercel/output` (Build Output API) which Vercel picks up automatically.
const isVercel = !!process.env.VERCEL;

export default defineConfig({
  ...(isVercel ? { nitro: { preset: "vercel" } } : {}),
  tanstackStart: {
    spa: {
      enabled: true,
    },
    // Preview server (used by prerender in build:dev) doesn't wire the
    // Cloudflare `env` object into the SSR handler, so the CF adapter's
    // `env.ASSETS` check crashes when prerendering the SPA shell. Don't
    // fail the build on that — the SPA still boots on the client.
    prerender: {
      failOnError: false,
    },
  },
});
