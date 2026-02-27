import { error, json } from "../../_lib/response.js";
import { assertAdmin } from "../../_lib/security.js";

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!assertAdmin(request)) return error("Unauthorized", 401);

  const [statusRows, typeRows] = await Promise.all([
    env.DB.prepare("SELECT status, COUNT(*) as total FROM tickets GROUP BY status ORDER BY status").all(),
    env.DB.prepare("SELECT type, COUNT(*) as total FROM tickets GROUP BY type ORDER BY type").all()
  ]);

  const byStatus = Object.fromEntries((statusRows.results || []).map(r => [r.status, Number(r.total)]));
  const byType = Object.fromEntries((typeRows.results || []).map(r => [r.type, Number(r.total)]));

  return json({ byStatus, byType });
}