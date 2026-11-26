# DR zámečnictví a kovovýroba

Firemní web Daniela Richtera ve Studénce. Statické Astro stránky, vlastní fotografie, lokálně hostované písmo Manrope a kalkulačka ocelové pergoly.

## Vývoj a ověření

Node.js 22.12 nebo novější.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Testy pokrývají původní ceník všech šesti rozměrů, minimální sestavu, dopravu mimo součet, přenos konfigurace do poptávky, neplatné vstupy a chybové odpovědi e-mailové služby. E-mailová služba je v testech nahrazena; žádné zprávy se neodesílají.

Volitelný `tests/browser.mjs` používá Playwright. `PLAYWRIGHT_MODULE` může ukázat na již nainstalovaný modul, `BROWSER_EXECUTABLE` na existující Chromium a `TEST_URL` na běžící lokální nebo vzdálený náhled. Testuje desktop, devět mobilních stránek, 320px šířku, celý průchod kalkulačka–poptávka a zachování údajů při chybě odeslání. Formulář zachytí před odesláním.

## Ceník pergoly

Jediný zdroj cen: `src/data/pergola.mjs`. Zachovává původní ceny konstrukcí a montáže, pevnou cenu krytiny 12 545 Kč, zinku 4 500 Kč a barvy 5 000 Kč. Tyto tři příplatky jsou podle původních podkladů stejné pro všechny rozměry; před ostrým použitím je musí výrobce potvrdit. Součet je **bez DPH**. Doprava podle adresy není v součtu. Sazba DPH ani ceny atypického kotvení se neodhadují.

Konfigurace se ukládá do URL. Poptávka předává rozměr, barvu, krytinu, zinkování, montáž a dopravu; server cenu znovu vypočítá z ceníku. Cenu z prohlížeče nepřebírá jako důvěryhodný údaj.

## Cloudflare Pages + GitHub

Adresa náhledu: **https://dr-zamecnictvi.kompotex.org**. Doménu obsluhuje malý Worker z `cloudflare/domain-worker.mjs`, který předává požadavky do Pages větve `codex/dr-modern-design`. Zachovává cestu, parametry kalkulačky, tělo formuláře a původní veřejnou doménu při přesměrování. Frontend se dál aktualizuje přes GitHub a Cloudflare Pages. Nasazení propojení domény: `wrangler deploy --config wrangler.domain.jsonc`.

Existující projekt: `dr-zamecnictvi-web`, repozitář `Fidlik/workspace`.

- Kořen projektu: `dr-zamecnictvi-web`
- Build: `npm run build`
- Výstup: `dist`
- Produkční větev: `main`; ostatní větve vytvářejí náhledy.
- Pages Function: `functions/api/forms.ts` (běžný statický server ji nespouští).

E-mailový relay je zachován přes FormSubmit. Volitelné proměnné `FORM_PRIMARY_EMAIL` a `FORM_CC_EMAILS` nastavují příjemce a kopie. Výchozím příjemcem je e-mail firmy; bez explicitního nastavení se žádná další kopie neposílá. FormSubmit může vyžadovat aktivaci příjemce. Skutečné doručení je nutné ověřit s majitelem před ostrým spuštěním; automatické testy zprávu neposílají. Neúspěšná odpověď včetně HTTP 200 s `success: false` nevede na děkovací stránku.

Fotografie WebP jsou odvozené z původních podkladů v `public/images` (originály zůstávají zachované). `scripts/prepare-assets.py` je volitelný helper vyžadující Pillow. Písmo Manrope má přiloženou licenci OFL. Žádná analytika ani automatické načtení mapy třetí strany.
