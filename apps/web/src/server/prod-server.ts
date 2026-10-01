/**
 * Standalone production HTTP server for Evolve web app.
 *
 * Reuses the SAME API layer as the Vite dev middleware
 * (`handleApiRequest` + `setupWebSocketServer`) so dev and prod behave
 * identically, then serves the built SPA from ../dist with an
 * index.html fallback for client-side routing.
 *
 * Usage:
 *   cd apps/web && npm run build && npm run serve
 * Env:
 *   PORT          - listen port (default 3000)
 *   DATABASE_URL  - PostgreSQL connection string (optional; JSON fallback otherwise)
 */
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { IncomingMessage, ServerResponse } from "http";
import { handleApiRequest, setupWebSocketServer } from "../lib/apiServer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// src/server/prod-server.ts -> apps/web/dist
const DIST_DIR = path.resolve(__dirname, "..", "..", "dist");
const INDEX_HTML = path.join(DIST_DIR, "index.html");
const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".wasm": "application/wasm",
};

function sendIndex(res: ServerResponse): void {
  if (!fs.existsSync(INDEX_HTML)) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("dist/index.html not found. Run `npm run build` first, then restart the server.");
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", MIME_TYPES[".html"]);
  fs.createReadStream(INDEX_HTML).pipe(res);
}

function serveStatic(req: IncomingMessage, res: ServerResponse): void {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.end();
    return;
  }

  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const filePath = path.normalize(path.join(DIST_DIR, urlPath));

  // Prevent path traversal outside of dist/
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end();
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA fallback: any unknown non-file GET renders the app shell.
  if (req.method === "GET") {
    sendIndex(res);
    return;
  }

  res.statusCode = 404;
  res.end();
}

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  // Lightweight health probe (bypasses rate limiting on purpose).
  if ((req.url || "").split("?")[0] === "/api/health") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  try {
    const handled = await handleApiRequest(req, res);
    if (handled) return;
  } catch (error) {
    console.error("[prod-server] Unhandled API error:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
    }
    res.end(JSON.stringify({ error: "Internal Server Error" }));
    return;
  }

  serveStatic(req, res);
});

// Attach the chat WebSocket on the same HTTP server (same as Vite dev).
setupWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`[evolve] Production server listening on http://localhost:${PORT}`);
  console.log(`[evolve] Serving static files from: ${DIST_DIR}`);
});

function shutdown(signal: string): void {
  console.log(`[evolve] Received ${signal}, shutting down...`);
  server.close(() => process.exit(0));
  // Force-exit if sockets keep the process alive.
  setTimeout(() => process.exit(0), 5000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
