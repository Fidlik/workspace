# DR zámečnictví a kovovýroba

Lehká rebuild verze firemního webu postavená v Astro místo pluginově těžkého WordPressu.

## Lokální vývoj

```sh
npm install
npm run dev
```

Produkce:

```sh
npm run build
npm run preview
```

## Co je hotové

- moderní statický Astro web
- úvodní stránka
- samostatné stránky pro hlavní služby
- fotogalerie a kontakty
- připraveno pro nasazení na GitHub + Cloudflare Pages

## GitHub + Cloudflare Pages

1. Vytvoř GitHub repozitář a nahraj obsah této složky.
2. V Cloudflare Pages založ nový projekt z GitHub repozitáře.
3. Nastav build command na `npm run build`.
4. Nastav output directory na `dist`.
5. Po prvním deployi připoj vlastní doménu `dr-zamecnictvi.cz`.

## Další vhodné kroky

- doplnit více referencí a fotek od majitele
- přidat přesměrování ze starých URL, pokud budou potřeba kvůli SEO
- případně doplnit jednoduchý formulář nebo CMS pro editaci obsahu
