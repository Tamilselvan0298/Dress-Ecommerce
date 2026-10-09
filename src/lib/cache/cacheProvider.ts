// Cache and Rate Limiting Abstraction

class InMemoryCache {
  private store = new Map<string, { value: unknown; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  // Rate Limiting helper: maxRequests within windowSeconds
  async checkRateLimit(key: string, maxRequests = 10, windowSeconds = 60): Promise<{ allowed: boolean; remaining: number }> {
    const rateKey = `rate:${key}`;
    const now = Date.now();
    const entry = this.store.get(rateKey);

    if (!entry || now > entry.expiresAt) {
      this.store.set(rateKey, { value: 1, expiresAt: now + windowSeconds * 1000 });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    const currentCount = Number(entry.value) || 0;
    if (currentCount >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    this.store.set(rateKey, { value: currentCount + 1, expiresAt: entry.expiresAt });
    return { allowed: true, remaining: maxRequests - (currentCount + 1) };
  }
}

export const cache = new InMemoryCache();

