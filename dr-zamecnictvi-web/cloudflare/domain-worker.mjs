// Keep the Kompotex address on the tested GitHub preview branch.
const upstreamOrigin = 'https://codex-dr-modern-design.dr-zamecnictvi-web.pages.dev';

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const target = new URL(incoming.pathname + incoming.search, upstreamOrigin);
    const forwarded = new Request(target, request);
    forwarded.headers.delete('host');
    // Pages validates same-origin form submissions against its own hostname.
    if (forwarded.headers.get('origin') === incoming.origin) {
      forwarded.headers.set('origin', upstreamOrigin);
    }
    const upstream = await fetch(forwarded, { redirect: 'manual' });
    const response = new Response(upstream.body, upstream);
    const location = response.headers.get('location');
    if (location) {
      const destination = new URL(location, upstreamOrigin);
      if (destination.origin === upstreamOrigin) {
        response.headers.set('location', incoming.origin + destination.pathname + destination.search + destination.hash);
      }
    }
    return response;
  },
};
