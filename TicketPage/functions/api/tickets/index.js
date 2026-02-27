import { error, json, parseJson } from "../../_lib/response.js";
import { checkAndConsumeRateLimit, fingerprintRequest, verifyTurnstileToken } from "../../_lib/security.js";
import { createId, nowIso, toPublicTicketRow } from "../../_lib/utils.js";
import { parseListQuery, validateCreateTicket } from "../../_lib/validation.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const parsed = parseListQuery(url);
  if (parsed.error) return error(parsed.error, 400);

  const { type, status, q, page, pageSize } = parsed;

  const conditions = [];
  const binds = [];

  if (type) {
    conditions.push("type = ?");
    binds.push(type);
  }
  if (status) {
    conditions.push("status = ?");
    binds.push(status);
  }
  if (q) {
    conditions.push("(title LIKE ? OR description LIKE ?)");
    const like = `%${q}%`;
    binds.push(like, like);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * pageSize;

  const listStmt = env.DB.prepare(
    `SELECT id, type, title, description, status, year, language, genre_json, created_at, updated_at
     FROM tickets
     ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`
  ).bind(...binds, pageSize, offset);

  const countStmt = env.DB.prepare(`SELECT COUNT(*) as total FROM tickets ${where}`).bind(...binds);

  const [listRes, countRes] = await Promise.all([listStmt.all(), countStmt.first()]);

  const tickets = (listRes.results || []).map(toPublicTicketRow);
  const total = Number(countRes?.total || 0);

  return json({
    tickets,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const body = await parseJson(request);
  const validationError = validateCreateTicket(body);
  if (validationError) return error(validationError, 400);

  const { ipHash, uaHash } = await fingerprintRequest(request, env);
  const limit = await checkAndConsumeRateLimit(env, `submit:${ipHash}`);

  if (!limit.allowed) {
    return error("Rate limit exceeded. Please try later.", 429);
  }

  const remoteIp = request.headers.get("CF-Connecting-IP") || undefined;
  const turnstileOk = await verifyTurnstileToken(env, body.turnstileToken, remoteIp);
  if (!turnstileOk) return error("Turnstile verification failed.", 403);

  const id = createId();
  const now = nowIso();
  const genre = Array.isArray(body.genre) ? body.genre.map(x => String(x).trim()).filter(Boolean) : [];

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO tickets (
        id, type, title, description, status, year, language, genre_json,
        ip_hash, ua_hash, created_at, updated_at
      ) VALUES (?1, ?2, ?3, ?4, 'new', ?5, ?6, ?7, ?8, ?9, ?10, ?10)`
    ).bind(
      id,
      body.type,
      body.title.trim(),
      typeof body.description === "string" ? body.description.trim() : "",
      body.year ? Number(body.year) : null,
      typeof body.language === "string" ? body.language.trim() : null,
      JSON.stringify(genre),
      ipHash,
      uaHash,
      now
    ),
    env.DB.prepare(
      "INSERT INTO ticket_events (ticket_id, event_type, event_payload, created_at) VALUES (?1, 'created', ?2, ?3)"
    ).bind(id, JSON.stringify({ status: "new" }), now)
  ]);

  return json({ id, status: "new", createdAt: now }, 201);
}