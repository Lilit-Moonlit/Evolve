import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { handleApiRequest, setupWebSocketServer } from "./src/lib/apiServer";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "api-server",
      configureServer(server: any) {
        // Setup WebSocket server on the same HTTP server
        if (server.httpServer) {
          setupWebSocketServer(server.httpServer);
        }

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
      "@evolve/config": path.resolve(__dirname, "../../packages/config/src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_NOT_FOUND") {
          return;
        }
        warn(warning);
      },
    },
  },
});
