// Lightweight signed-cookie sessions using Web Crypto (HMAC-SHA256),
// works in both Next.js Edge middleware and normal API routes with
// no extra dependencies.
//
// Add SESSION_SECRET to .env.local -- any long random string, e.g.
// generate one with: openssl rand -base64 32

const encoder = new TextEncoder();

async function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set in your environment.");
  }
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: ArrayBuffer) {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export type Role = "staff" | "owner";

export async function createSessionToken(role: Role, ttlSeconds = 60 * 60 * 12) {
  const payload = JSON.stringify({ role, exp: Date.now() + ttlSeconds * 1000 });
  const payloadB64 = toBase64Url(encoder.encode(payload).buffer as ArrayBuffer);
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const sigB64 = toBase64Url(sig);
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<{ role: Role } | null> {
  if (!token) return null;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;

  const key = await getKey();
  const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const expectedSigB64 = toBase64Url(expectedSig);

  if (expectedSigB64 !== sigB64) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    );
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (payload.role !== "staff" && payload.role !== "owner") return null;
    return { role: payload.role };
  } catch {
    return null;
  }
}
