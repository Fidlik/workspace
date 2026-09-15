# machura.cz

Statický responzivní rozcestník: FLEXWEL / David Machura a IT / Zdeněk Machura.

## Nahrání na hosting

Nahrajte **obsah složky `dist`** do kořenového adresáře webu (například `www` nebo `public_html`). `index.html` má být přímo v kořeni webu. Zachovejte složku `assets`.

Není potřeba build, npm, Node.js, PHP ani databáze. Web funguje také otevřením `dist/index.html` v prohlížeči. Veškeré obrázky a styly jsou lokální, bez CDN a externích fontů.

## Cílové odkazy

- FLEXWEL je nastavený na `https://www.flexwel.cz/` v `dist/index.html`.
- IT adresu doplňte v `dist/config.js` do `itUrl`, například `itUrl: "https://vas-it-web.cz/"`. Po doplnění bude klikatelná celá pravá polovina. Dokud je hodnota prázdná, zůstává neaktivní s textem „Připravujeme“. Nejde o nefunkční odkaz na `#`.
- Levá polovina je klikatelná celá. Oba odkazy po nastavení fungují i klávesnicí.

## Úpravy

Texty: `dist/index.html`. Vzhled a mobilní rozložení: `dist/styles.css`. Ilustrační fotografie vytvořené AI: `dist/assets/`. Nejde o fotografie skutečné dílny nebo konkrétní realizace firmy.

Na šířce do 760 px jsou panely pod sebou. Animace respektují nastavení omezeného pohybu. Web nepoužívá cookies, analytiku ani formuláře.
