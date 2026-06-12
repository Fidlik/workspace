# Šlapka

Česká webová aplikace pro plánování středečních vyjížděk na kole a rozdělení společných útrat.

## MVP

- Vytvořit týdenní vyjížďku s datem, startem a odkazem na mapu
- Přidat účastníky vyjížďky
- Nahrát fotku účtenky ke společné útratě
- Rozdělit částku mezi vybrané lidi
- Vygenerovat QR platbu pro vyrovnání
- Umožnit každému upravit bankovní účet v profilu

## Hosting

- Cloudflare Pages pro webovou aplikaci
- Cloudflare D1 pro data aplikace
- Cloudflare R2 pro fotky účtenek
- Cloudflare Workers nebo Pages Functions pro API

## Technický název

Složka a URL používají `slapka` bez diakritiky. V uživatelském rozhraní bude název **Šlapka**.
