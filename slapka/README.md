# Šlapka

Česká webová aplikace pro plánování středečních vyjížděk na kole a rozdělení společných útrat.

## Co je hotové

- Seznam vyjížděk s možností přidat novou vyjížďku
- Kliknutí na vyjížďku přepne celý detail: plán, jezdce, účtenky a QR platby
- Úprava vyjížďky: název, datum, start a odkaz na mapy.com
- Seznam jezdců a výběr, kdo jede v konkrétní den
- Více účtenek na jednu vyjížďku
- Nahrání fotky účtenky s náhledem
- OCR pokus o přečtení celkové částky přes Tesseract.js v prohlížeči
- Nabídka nalezených částek a ruční úprava částky
- Rozdělení vybrané účtenky stejným dílem mezi vybrané jezdce
- Výchozí příjemce podle člověka, který platil
- Editovatelný účet příjemce a zpráva pro platbu
- QR platby ve formátu SPD pro vyrovnání
- Přístupové heslo před načtením celé aplikace
- Ukládání do Cloudflare D1 přes Pages Function `/api/state`
- Lokální fallback do prohlížeče, pokud API není dostupné

## Cloudflare Pages

Nastavení projektu:

- Framework preset: žádný / static site
- Root directory: `slapka`
- Build command: nechat prázdné nebo `exit 0`
- Build output directory: `.`

## Přístupové heslo

V Cloudflare Pages nastav environment variable:

```text
ACCESS_PASSWORD=nejake-spolecne-tymoves-heslo
```

Bez této proměnné aplikace vrátí chybu a nenačte se. Po zadání hesla se uloží bezpečná cookie `slapka_access` a celý tým může aplikaci upravovat. Odhlášení je přes `/logout` nebo tlačítko `Odhlásit` v horní liště.

Starší proměnná `ADMIN_PASSWORD` funguje jako fallback, ale pro nové nasazení používej `ACCESS_PASSWORD`.

## Cloudflare D1

Aplikace očekává D1 binding:

```text
DB
```

Schéma databáze je v:

```text
migrations/0001_initial_schema.sql
```

## Technický název

Složka a URL používají `slapka` bez diakritiky. V uživatelském rozhraní je název **Šlapka**.
