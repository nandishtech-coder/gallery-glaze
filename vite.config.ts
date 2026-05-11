import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { nitro } from 'nitro/vite'; // You might need to: bun add nitro

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro({
      preset: 'vercel' // This tells TanStack to build for Vercel's architecture
    })
  ],
});
