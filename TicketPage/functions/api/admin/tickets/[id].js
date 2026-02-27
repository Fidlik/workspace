import { error, json, parseJson } from "../../../_lib/response.js";
import { assertAdmin } from "../../../_lib/security.js";
import { nowIso } from "../../../_lib/utils.js";
import { validateAdminPatch } from "../../../_lib/validation.js";

export async function onRequestPatch(context) {
  const { request, env, params } = context;

  if (!assertAdmin(request)) return error("Unauthorized", 401);

  const id = params?.id;
  if (!id) return error("Missing ticket id.", 400);

  const body = await parseJson(request);
  const validationError = validateAdminPatch(body);
  if (validationError) return error(validationError, 400);

  const existing = await env.DB.prepare("SELECT id, status FROM tickets WHERE id = ?1").bind(id).first();
  if (!existing) return error("Ticket not found.", 404);

  const now = nowIso();
  const note = typeof body.adminNote === "string" ? body.adminNote.trim() : "";

  const statements = [
    env.DB.prepare("UPDATE tickets SET status = ?2, updated_at = ?3 WHERE id = ?1").bind(id, body.status, now),
    env.DB.prepare("INSERT INTO ticket_events (ticket_id, event_type, event_payload, created_at) VALUES (?1, 'status_changed', ?2, ?3)")
      .bind(id, JSON.stringify({ from: existing.status, to: body.status }), now)
  ];

  if (note) {
    statements.push(
      env.DB.prepare("INSERT INTO ticket_events (ticket_id, event_type, event_payload, created_at) VALUES (?1, 'admin_note', ?2, ?3)")
        .bind(id, JSON.stringify({ note }), now)
    );
  }

  await env.DB.batch(statements);

  return json({ id, status: body.status, updatedAt: now });
}