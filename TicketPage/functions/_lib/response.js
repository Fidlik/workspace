export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    }
  });
}

export function error(message, status = 400) {
  return json({ error: message }, status);
}

export async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}