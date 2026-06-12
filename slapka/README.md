# Šlapka

Česká webová aplikace pro plánování středečních vyjížděk na kole a rozdělení společných útrat.

## Co je hotové v prototypu

- Úprava plánované vyjížďky: název, datum, start a odkaz na mapy.com
- Seznam jezdců a výběr, kdo v daný den jede
- Nahrání fotky účtenky s náhledem
- OCR pokus o přečtení celkové částky přes Tesseract.js v prohlížeči
- Nabídka nalezených částek a ruční úprava částky
- Rozdělení stejným dílem mezi vybrané jezdce
- Výchozí příjemce podle člověka, který platil
- Editovatelný účet příjemce a zpráva pro platbu
- QR platby ve formátu SPD pro vyrovnání
- Lokální ukládání demo dat do prohlížeče

## Otevření

Prototyp je statický web. Stačí otevřít `index.html` nebo nasadit složku `slapka` jako statický projekt.

## Cloudflare Pages

Pro první nasazení na Cloudflare Pages použij:

- Framework preset: žádný / static site
- Root directory: `slapka`
- Build command: nechat prázdné
- Build output directory: `.`

Později přidáme backend:

- Cloudflare D1 pro uživatele, vyjížďky a účtenky
- Cloudflare R2 pro fotky účtenek
- Cloudflare Pages Functions nebo Workers pro login, OCR pipeline a ukládání

## Technický název

Složka a URL používají `slapka` bez diakritiky. V uživatelském rozhraní je název **Šlapka**.
