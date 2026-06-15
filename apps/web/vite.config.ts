/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { handleApiRequest } from "./src/lib/apiServer";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "api-server",
      configureServer(server: any) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const handled = await handleApiRequest(req, res);
          if (!handled) {
            next();
          }
        });
      },
    } as any,
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "../../packages/core/src"),
      "@storage": path.resolve(__dirname, "../../packages/storage/src"),
      "@p2p": path.resolve(__dirname, "../../packages/p2p/src"),
      "@evolve/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
