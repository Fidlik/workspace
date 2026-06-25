# Kompotex.org

Static bilingual presentation site for Kompotex.org.

## Local preview

Open `index.html` directly in a browser, or run:

```powershell
npx wrangler pages dev .
```

## Cloudflare Pages

Recommended settings:

- Project name: `kompotex-org`
- Build command: none
- Build output directory: `KompotexOrg`

If deploying from inside this folder with Wrangler:

```powershell
npx wrangler pages deploy . --project-name kompotex-org
```
