/**
 * Minimal async KV store with optional Redis backing.
 *
 * Set REDIS_URL to back this with Redis (survives restarts, shared across
 * instances). Without it a plain in-memory Map is used — fine for the
 * single-instance MVP deploy.
 */
import Redis from "ioredis";

interface KVEntry {
  value: string;
  expiresAt: number | null;
}

const memoryStore = new Map<string, KVEntry>();

function memoryGet(key: string): string | null {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
}

function memorySet(key: string, value: string, ttlMs?: number): void {
  memoryStore.set(key, {
    value,
    expiresAt: ttlMs ? Date.now() + ttlMs : null,
  });
}

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  // Lazy singleton so requiring this module never opens a connection
  // unless Redis is actually configured.
  if (!(globalThis as { __evolveRedis?: Redis | null }).__evolveRedis) {
    try {
      const client = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 2,
        lazyConnect: false,
      });
      client.on("error", (err: Error) => {
        console.error("[kv] Redis error:", err.message);
      });
      (globalThis as { __evolveRedis?: Redis | null }).__evolveRedis = client;
    } catch (err) {
      console.error("[kv] Failed to initialize Redis, using memory:", err);
      (globalThis as { __evolveRedis?: Redis | null }).__evolveRedis = null;
    }
  }
  return (globalThis as { __evolveRedis?: Redis | null }).__evolveRedis ?? null;
}

export interface KvStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlMs?: number): Promise<void>;
  del(key: string): Promise<void>;
}

export const kv: KvStore = {
  async get(key: string): Promise<string | null> {
    const redis = getRedis();
    if (redis) {
      try {
        return await redis.get(key);
      } catch (err) {
        console.error("[kv] Redis get failed, falling back to memory:", err);
      }
    }
    return memoryGet(key);
  },

  async set(key: string, value: string, ttlMs?: number): Promise<void> {
    const redis = getRedis();
    if (redis) {
      try {
        if (ttlMs) {
          await redis.set(key, value, "PX", ttlMs);
        } else {
          await redis.set(key, value);
        }
        return;
      } catch (err) {
        console.error("[kv] Redis set failed, falling back to memory:", err);
      }
    }
    memorySet(key, value, ttlMs);
  },

  async del(key: string): Promise<void> {
    const redis = getRedis();
    if (redis) {
      try {
        await redis.del(key);
      } catch (err) {
        console.error("[kv] Redis del failed:", err);
      }
    }
    memoryStore.delete(key);
  },
};
