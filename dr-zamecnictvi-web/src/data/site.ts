export const siteUrl = 'https://www.dr-zamecnictvi.cz';

export const company = {
  name: 'DR zámečnictví a kovovýroba',
  owner: 'Daniel Richter',
  location: 'Studénka, severní Morava',
  workshop: 'Rodinná dílna blízko nádraží ve Studénce',
  email: 'daniel.richter.st@gmail.com',
  ico: '88133443',
  addressName: 'Zakázková kovovýroba',
  addressLines: [
    'Požárnická 261',
    '742 13 Studénka',
    'ČESKÁ REPUBLIKA',
  ],
  mapLabel: 'Požárnická 261, 742 13 Studénka',
  mapEmbedUrl:
    'https://www.google.com/maps?q=Po%C5%BE%C3%A1rnick%C3%A1%20261%2C%20742%2013%20Stud%C3%A9nka-Stud%C3%A9nka%203&z=16&output=embed',
  mapUrl:
    'https://www.google.com/maps/place/Po%C5%BE%C3%A1rnick%C3%A1+261,+742+13+Stud%C3%A9nka-Stud%C3%A9nka+3/',
  description:
    'Zakázková kovovýroba se zaměřením na pergoly, venkovní nábytek, oplocení, brány, schodiště, zábradlí a atypické realizace.',
  intro:
    'Jmenuji se Daniel Richter a v rodinné dílně ve Studénce vyrábím pergoly, venkovní nábytek, oplocení i další kovové prvky na míru. Každou zakázku řeším osobně od konzultace a zaměření až po finální montáž.',
  phones: [
    { label: 'Telefon', display: '724 556 144', href: '724556144' },
  ],
  facebook: 'https://www.facebook.com/DR.zamecnictvi.a.kovovyroba',
};

export type NavItem = {
  href: string;
  label: string;
};

export type FeatureCard = {
  href: string;
  title: string;
  eyebrow: string;
  summary: string;
  image: string;
};

export type PriceRow = {
  label: string;
  value: string;
};

export type CalculatorOption = {
  size: string;
  total: string;
  assembly?: string;
  note?: string;
};

export type SectionBlock = {
  id: string;
  title: string;
  image: string;
  intro: string;
  text: string;
  price?: string;
  priceNote?: string;
  fieldTypesTitle?: string;
  fieldTypesText?: string;
  variants?: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const navItems: NavItem[] = [
  { href: '/pergoly', label: 'Pergoly' },
  { href: '/venkovni-nabytek', label: 'Venkovní nábytek' },
  { href: '/oploceni', label: 'Oplocení' },
  { href: '/ostatni', label: 'Ostatní' },
  { href: '/kontakty', label: 'Kontakt' },
];

export const strengths = [
  'Férové jednání',
  'Osobní konzultace, návrh a zaměření',
  'Dodržení smluveného termínu',
  'Poctivá řemeslná práce s citem pro detail',
];

export const process = [
  {
    title: 'Konzultace',
    text: 'Projdeme představu, místo realizace i rozpočet. Každá zakázka má své specifické požadavky.',
  },
  {
    title: 'Návrh a zaměření',
    text: 'Navrhnu vhodné technické řešení, materiál i povrchovou úpravu tak, aby výsledek fungoval dlouhodobě.',
  },
  {
    title: 'Výroba',
    text: 'V dílně vznikne přesná konstrukce s důrazem na pevnost, detaily a čistý vzhled.',
  },
  {
    title: 'Montáž',
    text: 'Realizaci dokončím montáží a finálním doladěním na místě, aby vše sedělo přesně podle domluvy.',
  },
];

export const stats = [
  { value: '10+', label: 'let zkušeností v oboru' },
  { value: '5', label: 'hlavních sekcí nabídky' },
  { value: '1:1', label: 'osobní vedení zakázky' },
];

export const featuredSections: FeatureCard[] = [
  {
    href: '/pergoly',
    title: 'Pergoly',
    eyebrow: 'Úvodní foto, kalkulačka, poptávka',
    summary: 'Ocelové pergoly na míru s cenovým přehledem, rozměry a nezávaznou poptávkou.',
    image: '/images/portfolio/pristresek-1-2023.jpg',
  },
  {
    href: '/venkovni-nabytek',
    title: 'Venkovní nábytek',
    eyebrow: 'Kuchyně a stoly',
    summary: 'Venkovní kuchyně a stoly s orientační cenou a objednávkovým formulářem.',
    image: '/images/portfolio/image0-scaled.jpeg',
  },
  {
    href: '/oploceni',
    title: 'Brány a oplocení',
    eyebrow: 'Ploty, výplně, brány',
    summary: 'Kované ploty, tahokov, hliníkové i ocel-dřevo kombinace a různé typy bran.',
    image: '/images/portfolio/plot-tahokov-2023.jpg',
  },
  {
    href: '/ostatni',
    title: 'Ostatní',
    eyebrow: 'Schodiště, zábradlí, umělecké projekty',
    summary: 'Zakázkové realizace, které stojí na přesném detailu a individuálním návrhu.',
    image: '/images/portfolio/schodiste-3-2023.jpg',
  },
];

export const gallery = [
  {
    src: '/images/portfolio/pristresek-1-2023.jpg',
    alt: 'Ocelová pergola na míru',
    caption: 'Pergoly a venkovní realizace s důrazem na pevnost a čisté linie',
  },
  {
    src: '/images/portfolio/plot-tahokov-2023.jpg',
    alt: 'Tahokovové oplocení',
    caption: 'Oplocení navržené podle domu, pozemku a potřeb soukromí',
  },
  {
    src: '/images/portfolio/image0-scaled.jpeg',
    alt: 'Stůl a lavice v interiéru',
    caption: 'Venkovní nábytek i stoly řešené s důrazem na čistý detail',
  },
  {
    src: '/images/portfolio/schodiste-3-2023.jpg',
    alt: 'Kovové schodiště',
    caption: 'Schodiště a zábradlí pro interiér i exteriér',
  },
  {
    src: '/images/portfolio/industrialni-stul-2.jpg',
    alt: 'Industriální stůl s masivní deskou',
    caption: 'Masivní stoly a atypické kusy s výrazným charakterem',
  },
];

export const references = [
  {
    quote:
      'S prací DR zámečnictví a kovovýroba jsme byli maximálně spokojeni. Daniel nám věcně poradil a pomohl zvolit nejlepší variantu plotové výplně po praktické i estetické stránce.',
    author: 'Spokojený zákazník',
  },
];

export const pergolaBasePriceRows: PriceRow[] = [
  { label: 'Konstrukce 3000/4000', value: '35 500 Kč' },
  { label: 'Střešní krytina (16 komůrkový polykarbonát)', value: '12 545 Kč' },
  { label: 'Barva (komaxit)', value: '5 000 Kč' },
  { label: 'Žárový zinek', value: '4 500 Kč' },
  { label: 'Montáž', value: '8 000 Kč' },
  { label: 'Doprava', value: 'Dle adresy' },
  { label: 'Celkem', value: '65 545 Kč' },
];

export const pergolaCalculatorOptions: CalculatorOption[] = [
  { size: '3000 / 4000', total: '65 545 Kč', assembly: '8 000 Kč' },
  { size: '3000 / 5000', total: '77 545 Kč', assembly: '10 000 Kč' },
  { size: '3000 / 6000', total: '89 545 Kč', assembly: '13 000 Kč' },
  { size: '4000 / 4000', total: '84 545 Kč', assembly: '10 000 Kč' },
  { size: '5000 / 4000', total: '99 545 Kč', assembly: '12 000 Kč' },
  { size: '6000 / 4000', total: '112 545 Kč', assembly: '14 000 Kč' },
  { size: 'Rozměry na míru', total: 'Individuální cenová nabídka', note: 'Cena dle konkrétního zadání a místa montáže.' },
];

export const venkovniNabytekSections: SectionBlock[] = [
  {
    id: 'kuchyne',
    title: 'Kuchyně',
    image: '/images/portfolio/industrialni-stul-2.jpg',
    intro: 'Venkovní kuchyně na míru podle prostoru a způsobu používání.',
    text:
      'Venkovní kuchyně navrhuji jako praktický a odolný prvek pro pergolu, terasu nebo zahradu. Důležitá je správná pracovní výška, stabilita konstrukce a sladění s okolním prostorem.',
    price: 'Základní rozměr kuchyně dle vzorové fotografie 1800 / 600 / 900: 40 615 Kč',
    priceNote: 'Konečná cena se může upravit podle konkrétního provedení, vybavení a místa realizace.',
    ctaLabel: 'Objednávkový formulář',
    ctaHref: '/objednavka?produkt=venkovni-kuchyne',
  },
  {
    id: 'stoly',
    title: 'Stoly',
    image: '/images/grily.jpg',
    intro: 'Kovové stoly a podnože pro venkovní i interiérové použití.',
    text:
      'Stůl nebo podnož vyrábím vždy s ohledem na konkrétní desku, zatížení a styl prostoru. Důležitá je tuhost konstrukce, čisté napojení a proporce, které fungují i vizuálně.',
    price: 'Stůl 1500 / 900: 20 000 Kč',
    priceNote: 'Při atypických rozměrech nebo jiném materiálovém řešení připravím individuální nabídku.',
    ctaLabel: 'Objednávkový formulář',
    ctaHref: '/objednavka?produkt=stul',
  },
];

export const oploceniSections: SectionBlock[] = [
  {
    id: 'kovane-ploty',
    title: 'Kované ploty',
    image: '/images/portfolio/plot-tahokov-2023.jpg',
    intro: 'Reprezentativní ploty s poctivým detailem a klasickým charakterem.',
    text:
      'Kované ploty vyrábím s důrazem na rytmus, proporce a řemeslné zpracování detailu. Každý návrh přizpůsobuji domu, okolí i požadované míře zdobnosti.',
    fieldTypesTitle: 'Typy polí',
    fieldTypesText:
      'Typy polí řeším individuálně podle stylu domu, šířky polí a návaznosti na bránu nebo branku.',
    variants: [
      'Rovná pole s čistým rytmem',
      'Dekorativnější pole s kovaným detailem',
      'Kombinace s bránou a vstupní brankou',
    ],
    ctaLabel: 'Nezávazný formulář',
    ctaHref: '/poptavka?produkt=kovane-ploty',
  },
  {
    id: 'tahokov-ploty',
    title: 'Tahokov ploty',
    image: '/images/ploty.jpg',
    intro: 'Současné oplocení s čistou linií a vyšší mírou soukromí.',
    text:
      'Tahokov je vhodný tam, kde chcete moderní vzhled, pevnost a zároveň technicky čisté řešení. Výplň působí současně a dobře funguje i u novostaveb.',
    fieldTypesTitle: 'Typy polí',
    fieldTypesText:
      'Volím různé hustoty a členění výplní podle požadovaného soukromí, rytmu a vzhledu fasády.',
    variants: [
      'Jemnější výplně s větší průhledností',
      'Hustší pole pro více soukromí',
      'Jednoduché moderní rámy a sloupky',
    ],
    ctaLabel: 'Nezávazný formulář',
    ctaHref: '/poptavka?produkt=tahokov-ploty',
  },
  {
    id: 'hlinikove',
    title: 'Hliníkové',
    image: '/images/brany.jpg',
    intro: 'Lehké a snadno udržovatelné oplocení pro současné domy.',
    text:
      'Hliníkové řešení je vhodné tam, kde je důležitá jednoduchá údržba, čistý detail a lehčí vizuální výraz. Důležitá je správná skladba lamel a jejich návaznost na vstupy.',
    fieldTypesTitle: 'Typy polí',
    fieldTypesText:
      'Nabídku přizpůsobuji rozestupům lamel, požadované průhlednosti a celkovému stylu domu.',
    variants: [
      'Vodorovné lamelové pole',
      'Svislé členění',
      'Kombinace s hliníkovou brankou nebo bránou',
    ],
    ctaLabel: 'Nezávazný formulář',
    ctaHref: '/poptavka?produkt=hlinikove-oploceni',
  },
  {
    id: 'ocel-drevo',
    title: 'Ocel / dřevo kombinace',
    image: '/images/ploty.jpg',
    intro: 'Kombinace pevné ocelové konstrukce a teplejšího přírodního výrazu.',
    text:
      'Spojení oceli a dřeva funguje tam, kde chcete zachovat technickou pevnost, ale zároveň dodat realizaci měkčí a příjemnější vzhled. Návrh vždy řeším podle konkrétní stavby.',
    fieldTypesTitle: 'Typy polí',
    fieldTypesText:
      'Kombinace materiálů umožňuje různé rytmy latí, hustotu výplně i návaznost na ostatní prvky kolem domu.',
    variants: [
      'Svislé dřevěné latě v ocelovém rámu',
      'Vodorovné členění',
      'Kombinace s brankou a bránou ve stejném stylu',
    ],
    ctaLabel: 'Nezávazný formulář',
    ctaHref: '/poptavka?produkt=ocel-drevo',
  },
  {
    id: 'samonosne-brany',
    title: 'Brány - samonosné',
    image: '/images/brany.jpg',
    intro: 'Samosnosné brány pro pohodlný a spolehlivý vjezd.',
    text:
      'Samosnosné brány navrhuji tak, aby dobře fungovaly v každodenním provozu, měly čistý chod a byly vizuálně sladěné s celým oplocením. Důležitý je detail i konstrukční tuhost.',
    fieldTypesTitle: 'Typy polí',
    fieldTypesText:
      'Výplň brány může navazovat na kované, tahokovové, hliníkové i kombinované oplocení.',
    variants: [
      'Výplň sladěná s plotem',
      'Plnější řešení pro větší soukromí',
      'Moderní i klasický výraz',
    ],
    ctaLabel: 'Nezávazný formulář',
    ctaHref: '/poptavka?produkt=samonosna-brana',
  },
  {
    id: 'dvoukridle-brany',
    title: 'Brány - dvoukřídlé',
    image: '/images/brany.jpg',
    intro: 'Dvoukřídlé brány pro vstupy, kde dává tradiční otevírání nejlepší smysl.',
    text:
      'Dvoukřídlé brány jsou vhodné tam, kde prostor a provoz lépe vyhovuje klasickému řešení. Důležité je přesné osazení, tuhost konstrukce a napojení na okolní oplocení.',
    fieldTypesTitle: 'Typy polí',
    fieldTypesText:
      'Stejně jako u ostatních realizací řeším výplň a rytmus polí podle charakteru domu a oplocení.',
    variants: [
      'Symetrické křídlo',
      'Kombinace s brankou',
      'Navázání na kovaný i moderní výraz',
    ],
    ctaLabel: 'Nezávazný formulář',
    ctaHref: '/poptavka?produkt=dvoukridla-brana',
  },
];

export const ostatniSections: SectionBlock[] = [
  {
    id: 'schodiste',
    title: 'Schodiště',
    image: '/images/portfolio/schodiste-3-2023.jpg',
    intro: 'Schodiště na míru s důrazem na bezpečnost, proporce a čistý detail.',
    text:
      'Kovová schodiště navrhuji jako pevný a přirozený prvek prostoru. Každé řešení vzniká podle dispozice stavby, provozu i požadovaného výrazu.',
    fieldTypesTitle: 'Typy polí',
    fieldTypesText:
      'Podobu výplní a detailů řeším podle typu schodiště, stylu interiéru nebo exteriéru a návaznosti na zábradlí.',
    variants: [
      'Samonosná i kombinovaná řešení',
      'Jednodušší technický výraz',
      'Výraznější designové pojetí',
    ],
    ctaLabel: 'Nezávazný formulář',
    ctaHref: '/poptavka?produkt=schodiste',
  },
  {
    id: 'zabradli',
    title: 'Zábradlí',
    image: '/images/portfolio/zabradli-1-2023.jpg',
    intro: 'Interiérové i exteriérové zábradlí navržené podle konkrétní stavby.',
    text:
      'Zábradlí musí být bezpečné, pohodlné na úchop a zároveň působit přirozeně v prostoru, kde se nachází. Důležitý je pro mě detail napojení, rytmus i povrchová úprava.',
    fieldTypesTitle: 'Typy polí',
    fieldTypesText:
      'Nabízím různé typy výplní od jemnějších po výraznější, podle charakteru schodiště, balkonu nebo terasy.',
    variants: [
      'Svislé členění',
      'Jednoduché moderní výplně',
      'Kombinace s dalšími kovovými prvky',
    ],
    ctaLabel: 'Nezávazný formulář',
    ctaHref: '/poptavka?produkt=zabradli',
  },
  {
    id: 'umelecke-projekty',
    title: 'Umělecké projekty',
    image: '/images/grily.jpg',
    intro: 'Atypické realizace, kde se potkává řemeslo, nápad a individuální návrh.',
    text:
      'Nejzajímavější projekty často vznikají tam, kde neexistuje hotová šablona. Umělecké a atypické realizace řeším individuálně podle zadání, prostoru a hledaného výrazu.',
    fieldTypesTitle: 'Typy řešení',
    fieldTypesText:
      'Každý projekt má jiné zadání, proto zde nevycházím z pevného katalogu, ale z návrhu, funkce a charakteru prostoru.',
    variants: [
      'Originální kusy podle návrhu nebo vzoru',
      'Kovové prvky do interiéru i exteriéru',
      'Spojení technické přesnosti a kreativního přístupu',
    ],
    ctaLabel: 'Nezávazný formulář',
    ctaHref: '/poptavka?produkt=umelecky-projekt',
  },
];
