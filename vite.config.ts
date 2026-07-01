import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
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
