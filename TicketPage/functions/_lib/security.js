import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_SECONDS } from "./constants.js";

const encoder = new TextEncoder();

export async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  const bytes = new Uint8Array(digest);
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export async function fingerprintRequest(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
  const ua = request.headers.get("User-Agent") || "unknown";
  const salt = env.HASH_SALT || "dev-salt-change-me";

  const ipHash = await sha256(`${salt}:ip:${ip}`);
  const uaHash = await sha256(`${salt}:ua:${ua}`);
  return { ipHash, uaHash };
}

export async function verifyTurnstileToken(env, token, remoteIp) {
  if (env.SKIP_TURNSTILE === "true") return true;
  if (!env.TURNSTILE_SECRET) return false;

  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  if (remoteIp) form.append("remoteip", remoteIp);

  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form
  });

  if (!resp.ok) return false;
  const data = await resp.json();
  return Boolean(data?.success);
}

export async function checkAndConsumeRateLimit(env, key) {
  const now = new Date();
  const nowIso = now.toISOString();
  const windowSeconds = RATE_LIMIT_WINDOW_SECONDS;

  const row = await env.DB.prepare("SELECT key, window_start, count FROM rate_limits WHERE key = ?1")
    .bind(key)
    .first();

  if (!row) {
    await env.DB.prepare("INSERT INTO rate_limits (key, window_start, count) VALUES (?1, ?2, 1)")
      .bind(key, nowIso)
      .run();
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  const start = new Date(row.window_start);
  const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);

  if (elapsed >= windowSeconds) {
    await env.DB.prepare("UPDATE rate_limits SET window_start = ?2, count = 1 WHERE key = ?1")
      .bind(key, nowIso)
      .run();
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (row.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: windowSeconds - elapsed };
  }

  await env.DB.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?1")
    .bind(key)
    .run();

  return { allowed: true, remaining: RATE_LIMIT_MAX - (row.count + 1) };
}

export function assertAdmin(request) {
  const accessEmail = request.headers.get("cf-access-authenticated-user-email");
  const accessJwt = request.headers.get("cf-access-jwt-assertion");
  return Boolean(accessEmail || accessJwt);
}