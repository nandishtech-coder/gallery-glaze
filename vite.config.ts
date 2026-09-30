import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// On Vercel, build with Nitro's Vercel preset so the output lands in
// `.vercel/output` (Build Output API). The config wrapper replaces the
// preset's `compiled` hook, so we write Vercel's routing/function config here.
const isVercel = !!process.env.VERCEL;

const vercelNitro = {
  preset: "vercel",
  hooks: {
    async compiled(nitro: {
      options: { output: { dir: string; serverDir: string } };
    }) {
      const { dir, serverDir } = nitro.options.output;
      await mkdir(serverDir, { recursive: true });
      await writeFile(
        join(dir, "config.json"),
        JSON.stringify(
          {
            version: 3,
            routes: [
              { handle: "filesystem" },
              { src: "/(.*)", dest: "/__server" },
            ],
          },
          null,
          2,
        ),
      );
      await writeFile(
        join(serverDir, ".vc-config.json"),
        JSON.stringify(
          {
            handler: "index.mjs",
            launcherType: "Nodejs",
            shouldAddHelpers: false,
            supportsResponseStreaming: true,
            runtime: "nodejs22.x",
          },
          null,
          2,
        ),
      );
    },
  },
};

export default defineConfig({
  ...(isVercel ? { nitro: vercelNitro } : {}),
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
