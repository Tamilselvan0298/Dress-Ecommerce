import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

const SECRET = process.env.SESSION_SECRET || "vaishiri-super-secret-key-production-2026";
const CUSTOMER_COOKIE = "vaishiri_session";
const ADMIN_COOKIE = "vaishiri_admin_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
  exp: number; // Unix timestamp in seconds
}

export function signToken(data: Omit<SessionPayload, "exp">, expiresInDays = 7): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const payload: SessionPayload = { ...data, exp };
  const jsonStr = JSON.stringify(payload);
  const base64 = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(base64).digest("base64url");
  return `${base64}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const [base64, signature] = token.split(".");
    if (!base64 || !signature) return null;

    // Check with current secret, or fallback to legacy secret for active sessions
    const expectedSig = crypto.createHmac("sha256", SECRET).update(base64).digest("base64url");
    const legacySig = crypto.createHmac("sha256", "avantika-super-secret-key-production-2026").update(base64).digest("base64url");
    if (signature !== expectedSig && signature !== legacySig) return null;

    const jsonStr = Buffer.from(base64, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(jsonStr);

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE)?.value || cookieStore.get("avantika_session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentAdmin(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value || cookieStore.get("avantika_admin_session")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN")) {
    return null;
  }
  return payload;
}

export { CUSTOMER_COOKIE, ADMIN_COOKIE };

