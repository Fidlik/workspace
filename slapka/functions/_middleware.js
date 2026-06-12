const COOKIE_NAME = "slapka_access";

function loginPage(error = "") {
  return new Response(`<!doctype html>
<html lang="cs">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Šlapka · vstup</title>
    <style>
      :root { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1f2720; background: #f6f2e9; }
      * { box-sizing: border-box; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; background: linear-gradient(135deg, rgba(39,103,73,.14), transparent 38%), radial-gradient(circle at 85% 12%, rgba(214,120,50,.16), transparent 34%), #f6f2e9; }
      form { width: min(100%, 390px); display: grid; gap: 16px; padding: 24px; border: 1px solid #ddd3c1; border-radius: 8px; background: #fffdf7; box-shadow: 0 18px 50px rgba(55,46,31,.12); }
      h1 { margin: 0; font-size: clamp(2.5rem, 12vw, 4.5rem); line-height: .92; }
      p { margin: 0; color: #647067; }
      label span { display: block; margin-bottom: 8px; color: #647067; font-size: .82rem; font-weight: 750; }
      input { width: 100%; min-height: 46px; border: 1px solid #ddd3c1; border-radius: 8px; background: #fffefa; color: #1f2720; padding: 10px 12px; font: inherit; }
      input:focus { outline: none; border-color: #276749; box-shadow: 0 0 0 3px rgba(39,103,73,.13); }
      button { min-height: 44px; border: 0; border-radius: 8px; background: #276749; color: white; padding: 10px 14px; font: inherit; font-weight: 850; cursor: pointer; }
      .error { min-height: 20px; color: #9a3412; font-weight: 750; }
    </style>
  </head>
  <body>
    <form method="post" action="/">
      <div>
        <p>Středeční vyjížďky</p>
        <h1>Šlapka</h1>
      </div>
      <label>
        <span>Vstupní heslo</span>
        <input name="password" type="password" autocomplete="current-password" autofocus />
      </label>
      <p class="error">${error}</p>
      <button type="submit">Vstoupit</button>
    </form>
  </body>
</html>`, {
    status: error ? 401 : 200,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

function getCookie(request, name) {
  const cookie = request.headers.get("cookie") || "";
  return cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1) || "";
}

function accessPassword(env) {
  return env.ACCESS_PASSWORD || env.ADMIN_PASSWORD || "";
}

function accessCookie(password) {
  return `${COOKIE_NAME}=${encodeURIComponent(password)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const password = accessPassword(env);

  if (!password) {
    return new Response("ACCESS_PASSWORD is not configured", { status: 503 });
  }

  if (url.pathname === "/logout") {
    return new Response(null, {
      status: 302,
      headers: {
        location: "/",
        "set-cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
      }
    });
  }

  if (request.method === "POST" && url.pathname === "/") {
    const form = await request.formData();
    if (form.get("password") === password) {
      return new Response(null, {
        status: 302,
        headers: {
          location: "/",
          "set-cookie": accessCookie(password)
        }
      });
    }
    return loginPage("Heslo nesedí.");
  }

  if (getCookie(request, COOKIE_NAME) === password) {
    return next();
  }

  return loginPage();
}
