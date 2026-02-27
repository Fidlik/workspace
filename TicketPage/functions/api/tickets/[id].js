import { error, json } from "../../_lib/response.js";
import { safeJsonParse, toPublicTicketRow } from "../../_lib/utils.js";

export async function onRequestGet(context) {
  const { env, params } = context;
  const id = params?.id;

  if (!id) return error("Missing ticket id.", 400);

  const ticket = await env.DB.prepare(
    `SELECT id, type, title, description, status, year, language, genre_json, created_at, updated_at
     FROM tickets WHERE id = ?1`
  ).bind(id).first();

  if (!ticket) return error("Ticket not found.", 404);

  const eventsRes = await env.DB.prepare(
    `SELECT event_type, event_payload, created_at
     FROM ticket_events
     WHERE ticket_id = ?1
     ORDER BY created_at ASC`
  ).bind(id).all();

  const events = (eventsRes.results || []).map(row => ({
    eventType: row.event_type,
    payload: safeJsonParse(row.event_payload, null),
    createdAt: row.created_at
  }));

  return json({ ticket: toPublicTicketRow(ticket), events });
}