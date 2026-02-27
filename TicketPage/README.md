# TicketPage (Cloudflare Pages + Functions + D1)

Anonymous ticket/request tool for a personal movie database.

## Features
- Anonymous ticket creation (`issue`, `movie`, `tv`)
- Public board with filters and search
- Admin triage page with status changes and optional notes
- Turnstile verification + basic D1-backed rate limiting
- D1 ticket event history for audit trail

## API
- `POST /api/tickets`
- `GET /api/tickets`
- `GET /api/tickets/:id`
- `PATCH /api/admin/tickets/:id`
- `GET /api/admin/stats`

## Local setup
1. Install dependencies:
   - `npm install`
2. Create D1 DB and apply migration:
   - `wrangler d1 create ticket-page-db`
   - Copy returned `database_id` into `wrangler.toml`
   - `wrangler d1 migrations apply ticket-page-db --local`
3. Set secrets:
   - `wrangler secret put TURNSTILE_SECRET`
   - `wrangler secret put HASH_SALT`
4. Configure `config.js` with your Turnstile site key.
5. Run local dev:
   - `npm run dev`

## Cloudflare Access
Protect `/admin*` and `/api/admin*` with Cloudflare Access policies.

## Deploy
- `wrangler d1 migrations apply ticket-page-db --remote`
- `npm run deploy`

## Tests
- `npm test`

## Notes
- For local testing only, you can bypass Turnstile by setting env var `SKIP_TURNSTILE=true`.
- Default submit rate limit is 5 submissions per hour per IP hash.