export const siteUrl = 'https://www.dr-zamecnictvi.cz';

export const company = {
  name: 'DR zámečnictví a kovovýroba',
  owner: 'Daniel Richter',
  location: 'Studénka, severní Morava',
  workshop: 'Rodinná dílna blízko nádraží ve Studénce',
  description:
    'Zakázková kovovýroba se zaměřením na pergoly, venkovní nábytek, oplocení, brány, zábradlí a atypické realizace.',
  intro:
    'Jmenuji se Daniel Richter a v rodinné dílně ve Studénce vyrábím pergoly, venkovní nábytek, oplocení i další kovové prvky na míru. Každou zakázku řeším osobně od konzultace a zaměření až po finální montáž.',
  phones: [
    { label: 'Telefon', display: '724 556 144', href: '724556144' },
    { label: 'Druhý kontakt', display: '773 835 402', href: '773835402' },
  ],
  facebook: 'https://www.facebook.com/DR.zamecnictvi.a.kovovyroba',
};

export type Service = {
  slug: string;
  href: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  image: string;
  bullets: string[];
  detailTitle: string;
  detailIntro: string;
  detailPoints: string[];
};

export type NavLink = {
  href: string;
  label: string;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export type CollectionPage = {
  slug: string;
  href: string;
  title: string;
  eyebrow: string;
  summary: string;
  intro: string;
  image: string;
  items: Array<{
    href: string;
    label: string;
    summary: string;
  }>;
};

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

export const services: Service[] = [
  {
    slug: 'pergoly',
    href: '/pergoly',
    title: 'Pergoly',
    eyebrow: 'Ocelové pergoly na míru',
    summary: 'Pergoly navržené podle domu, terasy a způsobu využití venkovního prostoru.',
    description:
      'Ocelové pergoly navrhuji tak, aby byly pevné, čisté vizuálně a dobře fungovaly v každodenním provozu. Výsledkem je konstrukce, která doplní dům a vydrží dlouhé roky.',
    image: '/images/hero.jpg',
    bullets: [
      'Pergoly pro terasy a zahradní posezení',
      'Individuální rozměry, členění i způsob kotvení',
      'Důraz na konstrukční pevnost a čistý detail',
    ],
    detailTitle: 'Pergola jako funkční součást domu',
    detailIntro:
      'Pergola musí dobře sedět prostoru, proporčně navazovat na dům a zároveň bez problémů snášet každodenní používání i počasí.',
    detailPoints: [
      'Řeším návrh konstrukce podle rozměrů terasy i charakteru domu.',
      'Dbám na pevnost, čisté napojení a dlouhodobou životnost materiálu.',
      'Výsledná pergola má fungovat jako přirozené rozšíření venkovního bydlení.',
    ],
  },
  {
    slug: 'kuchyne',
    href: '/kuchyne',
    title: 'Venkovní kuchyně',
    eyebrow: 'Zakázkové sestavy do exteriéru',
    summary: 'Odolné venkovní kuchyně na míru pro zahrady, pergoly i terasy.',
    description:
      'Venkovní kuchyně vyrábím tak, aby byly praktické, odolné a vizuálně sladěné s celou realizací. Každá sestava vzniká podle prostoru a konkrétního způsobu používání.',
    image: '/images/grily.jpg',
    bullets: [
      'Konstrukce na míru podle dispozice terasy nebo pergoly',
      'Odolné materiálové řešení pro venkovní provoz',
      'Možnost navázání na gril nebo další prvky',
    ],
    detailTitle: 'Vaření venku bez kompromisů',
    detailIntro:
      'Venkovní kuchyně má být odolná, praktická a dobře navržená do prostoru, kde bude opravdu používána.',
    detailPoints: [
      'Navrhuji skladbu prvků podle konkrétního provozu a rozměrů místa.',
      'Konstrukce řeším s důrazem na stabilitu a snadnou údržbu.',
      'Celek může přirozeně navazovat na pergolu, gril nebo posezení.',
    ],
  },
  {
    slug: 'stoly',
    href: '/stoly',
    title: 'Stoly',
    eyebrow: 'Venkovní i interiérové podnože',
    summary: 'Masivní i subtilní kovové stoly a podnože podle rozměru a stylu prostoru.',
    description:
      'Kovové stoly a podnože vyrábím jako samostatné kusy i jako součást větších realizací. Důležitá je stabilita, proporce a vizuální čistota.',
    image: '/images/grily.jpg',
    bullets: [
      'Podnože pro jídelní i venkovní stoly',
      'Rozměry a tvar přizpůsobené konkrétní desce',
      'Spojení řemeslné přesnosti a čistého vzhledu',
    ],
    detailTitle: 'Stůl, který unese provoz i design',
    detailIntro:
      'Podnož nebo celý stůl musí fungovat prakticky a současně působit vyváženě v prostoru, pro který vzniká.',
    detailPoints: [
      'Každý kus přizpůsobuji rozměru, materiálu desky i typu použití.',
      'Důležitá je tuhost konstrukce a přesné zpracování detailů.',
      'Výsledkem je kus nábytku, který nepůsobí sériově, ale přirozeně.',
    ],
  },
  {
    slug: 'ploty',
    href: '/ploty',
    title: 'Ploty',
    eyebrow: 'Kované i tahokov řešení',
    summary: 'Ploty na míru pro rodinné domy, firmy i atypické pozemky.',
    description:
      'Vyrábím kované i tahokov ploty s důrazem na vzhled, bezpečí a dlouhou životnost. Každý plot vzniká na míru podle prostoru i stylu domu.',
    image: '/images/ploty.jpg',
    bullets: [
      'Kované ploty s klasickým i moderním výrazem',
      'Tahokov ploty pro čisté linie a větší soukromí',
      'Návrh sloupků, výplní i povrchové úpravy v jednom řešení',
    ],
    detailTitle: 'Plot, který sedí domu i pozemku',
    detailIntro:
      'Plot není jen hranice pozemku. Je to první věc, kterou na domě lidé vidí, a zároveň musí dlouhodobě fungovat v provozu i počasí.',
    detailPoints: [
      'Navrhnu vhodný typ výplně podle míry soukromí, vzhledu a údržby.',
      'Řeším nové ploty i navázání na stávající konstrukce a vjezdy.',
      'K dispozici jsou klasické kované varianty i současné tahokov provedení.',
    ],
  },
  {
    slug: 'kovane-ploty',
    href: '/kovane-ploty',
    title: 'Kované ploty',
    eyebrow: 'Klasika s poctivým detailem',
    summary: 'Kované ploty na míru s důrazem na reprezentativní vzhled a pevnost.',
    description:
      'Kované ploty mají výrazný charakter a vyžadují poctivé řemeslné zpracování. Navrhuji je tak, aby působily reprezentativně a zároveň dobře sloužily v běžném provozu.',
    image: '/images/ploty.jpg',
    bullets: [
      'Klasický i střídmě moderní výraz',
      'Ruční zpracování detailů a zakončení',
      'Sladění s bránou, brankou i okolní architekturou',
    ],
    detailTitle: 'Kovaný plot, který dává domu charakter',
    detailIntro:
      'U kovaných plotů hraje zásadní roli rytmus, detail a správné proporce. Jen tak nepůsobí těžce nebo přeplácaně.',
    detailPoints: [
      'Navrhnu vhodný motiv a míru zdobnosti podle domu i okolí.',
      'Dbám na pevnost konstrukce i čisté napojení na sloupky a vstupy.',
      'Celek může navazovat na bránu, branku nebo další kovové prvky.',
    ],
  },
  {
    slug: 'tahokov',
    href: '/tahokov',
    title: 'Tahokov',
    eyebrow: 'Současné oplocení s čistou linií',
    summary: 'Tahokovové výplně pro moderní oplocení s větším soukromím a odolností.',
    description:
      'Tahokov je vhodný tam, kde je žádoucí moderní vzhled, pevnost a zároveň určitá míra clonění. Výborně funguje v kombinaci s jednoduchou ocelovou konstrukcí.',
    image: '/images/ploty.jpg',
    bullets: [
      'Moderní a čisté oplocení',
      'Vyšší míra soukromí než u otevřených výplní',
      'Dobré sladění s novostavbami i minimalistickou architekturou',
    ],
    detailTitle: 'Tahokov jako elegantní technické řešení',
    detailIntro:
      'Tahokovové oplocení musí dobře fungovat konstrukčně i vizuálně, jinak ztrácí svůj čistý výraz.',
    detailPoints: [
      'Volím vhodný typ výplně podle požadované průhlednosti a charakteru domu.',
      'Konstrukci řeším tak, aby výplně působily čistě a bez rušivých detailů.',
      'Výsledkem je oplocení, které je současné, pevné a praktické.',
    ],
  },
  {
    slug: 'hlinikove',
    href: '/hlinikove',
    title: 'Hliníkové oplocení',
    eyebrow: 'Lehký vzhled a jednoduchá údržba',
    summary: 'Hliníkové výplně a oplocení pro moderní domy a dlouhodobý bezstarostný provoz.',
    description:
      'Hliníkové oplocení je vhodné tam, kde je důležitá nízká údržba, čistý vzhled a lehčí výraz celé realizace. Pomohu navrhnout řešení, které bude technicky i esteticky fungovat.',
    image: '/images/brany.jpg',
    bullets: [
      'Čisté linie pro současnou architekturu',
      'Nižší nároky na údržbu',
      'Možnost sladění s bránou, brankou i dalšími prvky',
    ],
    detailTitle: 'Hliník tam, kde má být lehkost a pořádek',
    detailIntro:
      'Hliníkové oplocení musí být navrženo tak, aby nepůsobilo levně ani technicky nedotaženě. Klíč je ve správné skladbě a detailu.',
    detailPoints: [
      'Pomohu zvolit rytmus lamel a celkový výraz oplocení.',
      'Řeším návaznost na vstupy, sloupky i ostatní části realizace.',
      'Výsledkem je jednoduché a reprezentativní oplocení na dlouhá léta.',
    ],
  },
  {
    slug: 'brany',
    href: '/brany',
    title: 'Brány',
    eyebrow: 'Vjezdové brány i vstupní branky',
    summary: 'Funkční a vizuálně čisté vstupy k domu, firmě nebo zahradě.',
    description:
      'Vjezdové brány a vchodové branky navrhuji tak, aby ladily s oplocením, byly pohodlné na každodenní používání a vydržely roky.',
    image: '/images/brany.jpg',
    bullets: [
      'Vjezdové brány sladěné s plotovými dílci',
      'Vchodové branky s důrazem na pevnost a detail',
      'Řešení pro nové stavby i rekonstrukce stávajících vstupů',
    ],
    detailTitle: 'Vstup, který funguje každý den',
    detailIntro:
      'Brána i branka musí vydržet opakované používání, sedět přesně do prostoru a zároveň působit reprezentativně.',
    detailPoints: [
      'Návrh konstrukce přizpůsobím šířce vjezdu i charakteru oplocení.',
      'Dbám na hladký chod, stabilitu a čistý detail spojů i výplní.',
      'Při návrhu myslím i na budoucí pohodlí při obsluze a údržbě.',
    ],
  },
  {
    slug: 'schodiste',
    href: '/schodiste',
    title: 'Schodiště',
    eyebrow: 'Interiérová i exteriérová řešení',
    summary: 'Schodiště na míru s důrazem na bezpečnost, proporce a čistý detail.',
    description:
      'Kovová schodiště navrhuji jako pevný a přirozený prvek prostoru. Každé řešení vzniká podle dispozice stavby, provozu i požadovaného výrazu.',
    image: '/images/zabradli.jpg',
    bullets: [
      'Samonosná i kombinovaná řešení',
      'Důraz na pohodlné používání a bezpečnost',
      'Možnost sladění se zábradlím a dalšími prvky',
    ],
    detailTitle: 'Schodiště, které funguje i vizuálně drží prostor',
    detailIntro:
      'Schodiště je konstrukční i architektonický prvek zároveň. Musí být bezpečné, pohodlné a dobře zpracované v každém detailu.',
    detailPoints: [
      'Návrh přizpůsobuji prostoru, sklonu i očekávanému provozu.',
      'Důležité jsou správné proporce, tuhost a kultivovaný detail napojení.',
      'Výsledkem je schodiště, které nepůsobí těžkopádně, ale jistě.',
    ],
  },
  {
    slug: 'zabradli',
    href: '/zabradli',
    title: 'Zábradlí',
    eyebrow: 'Interiér i exteriér',
    summary: 'Bezpečné a elegantní zábradlí na schody, balkony i terasy.',
    description:
      'Kovové zábradlí vyrábím jako funkční bezpečnostní prvek i jako součást architektury. Může být decentní, technické i výrazně designové.',
    image: '/images/zabradli.jpg',
    bullets: [
      'Zábradlí pro schodiště, terasy a balkony',
      'Řešení pro rodinné domy i komerční prostory',
      'Cit pro proporce, rytmus a detail',
    ],
    detailTitle: 'Bezpečnost bez kompromisu v detailu',
    detailIntro:
      'Zábradlí musí být pevné, pohodlné na úchop a zároveň ladit s prostorem, ve kterém se nachází.',
    detailPoints: [
      'Každý návrh přizpůsobuji konkrétní stavbě a stylu okolí.',
      'Důležitý je pro mě detail napojení, rytmus výplní i povrch.',
      'Výsledkem je konstrukce, která působí lehce, ale funguje poctivě.',
    ],
  },
  {
    slug: 'umelecke-projekty',
    href: '/umelecke-projekty',
    title: 'Umělecké projekty',
    eyebrow: 'Atypické realizace a originální kusy',
    summary: 'Zakázky, kde se potkává řemeslo, nápad a individuální návrh.',
    description:
      'Nejzajímavější projekty často vznikají tam, kde neexistuje hotová šablona. Umělecké a atypické realizace řeším individuálně podle zadání, prostoru a hledaného výrazu.',
    image: '/images/grily.jpg',
    bullets: [
      'Originální kusy podle návrhu nebo vzoru',
      'Spojení technické přesnosti a kreativního přístupu',
      'Výroba atypických kovových prvků pro interiér i exteriér',
    ],
    detailTitle: 'Když má kovový prvek vlastní příběh',
    detailIntro:
      'U atypických projektů není důležitá jen funkce, ale i atmosféra a originalita. Právě to z nich dělá nejzajímavější práci.',
    detailPoints: [
      'Mohu vycházet z výkresu, předlohy i volnější představy klienta.',
      'Každý kus řeším individuálně s důrazem na konstrukci i charakter.',
      'Vznikají tak realizace, které nepůsobí sériově ani zaměnitelně.',
    ],
  },
];

export const featuredSections = [
  {
    href: '/pergoly',
    title: 'Pergoly',
    eyebrow: 'Ocelové konstrukce',
    summary: 'Pergoly na míru pro terasy, zahrady a venkovní posezení.',
    image: '/images/hero.jpg',
  },
  {
    href: '/venkovni-nabytek',
    title: 'Venkovní nábytek',
    eyebrow: 'Kuchyně a stoly',
    summary: 'Zakázkové kuchyně, stoly a další vybavení pro venkovní provoz.',
    image: '/images/grily.jpg',
  },
  {
    href: '/oploceni',
    title: 'Oplocení',
    eyebrow: 'Ploty, brány a výplně',
    summary: 'Kované, tahokovové i hliníkové řešení včetně bran a branek.',
    image: '/images/ploty.jpg',
  },
  {
    href: '/ostatni',
    title: 'Ostatní',
    eyebrow: 'Schodiště, zábradlí, atypy',
    summary: 'Kovové prvky, které řešíme individuálně podle prostoru a zadání.',
    image: '/images/zabradli.jpg',
  },
];

export const collections: CollectionPage[] = [
  {
    slug: 'venkovni-nabytek',
    href: '/venkovni-nabytek',
    title: 'Venkovní nábytek',
    eyebrow: 'Kuchyně a stoly',
    summary: 'Zakázkové prvky pro komfortní venkovní vaření i posezení.',
    intro:
      'Venkovní nábytek řeším jako funkční součást pergol, teras a zahradních zón. Důraz je na odolnost, přesnost a na to, aby celek dobře fungoval v běžném provozu.',
    image: '/images/grily.jpg',
    items: [
      {
        href: '/kuchyne',
        label: 'Kuchyně',
        summary: 'Venkovní kuchyně na míru podle prostoru a způsobu používání.',
      },
      {
        href: '/stoly',
        label: 'Stoly',
        summary: 'Kovové stoly a podnože pro exteriér i interiér.',
      },
    ],
  },
  {
    slug: 'oploceni',
    href: '/oploceni',
    title: 'Oplocení',
    eyebrow: 'Kompletní řešení vstupu a hranice pozemku',
    summary: 'Od reprezentativních kovaných plotů po současné tahokovové a hliníkové varianty.',
    intro:
      'Oplocení není jen technická nutnost. Je to zásadní vizuální prvek domu i praktická součást každodenního provozu. Proto řeším celek, ne jen jednotlivý díl.',
    image: '/images/ploty.jpg',
    items: [
      {
        href: '/kovane-ploty',
        label: 'Kované ploty',
        summary: 'Tradiční a reprezentativní řešení s řemeslným detailem.',
      },
      {
        href: '/tahokov',
        label: 'Tahokov',
        summary: 'Moderní oplocení s čistou linií a větším soukromím.',
      },
      {
        href: '/hlinikove',
        label: 'Hliníkové',
        summary: 'Lehké a snadno udržovatelné oplocení pro současné domy.',
      },
      {
        href: '/brany',
        label: 'Brány',
        summary: 'Vjezdové brány a branky sladěné s celým oplocením.',
      },
    ],
  },
  {
    slug: 'ostatni',
    href: '/ostatni',
    title: 'Ostatní',
    eyebrow: 'Schodiště, zábradlí a atypické realizace',
    summary: 'Kategorie pro projekty, kde je potřeba individuální technické i vizuální řešení.',
    intro:
      'Do této části patří realizace, které se nevejdou do jedné jednoduché škatulky. Společný mají důraz na přesnost, detail a zakázkový přístup.',
    image: '/images/zabradli.jpg',
    items: [
      {
        href: '/schodiste',
        label: 'Schodiště',
        summary: 'Schodiště navržená podle prostoru, provozu a bezpečnostních nároků.',
      },
      {
        href: '/zabradli',
        label: 'Zábradlí',
        summary: 'Interiérové i exteriérové zábradlí s citlivým detailem.',
      },
      {
        href: '/umelecke-projekty',
        label: 'Umělecké projekty',
        summary: 'Originální a atypické realizace podle návrhu nebo představy.',
      },
    ],
  },
];

export const references = [
  {
    quote:
      'S prací DR zámečnictví a kovovýroba jsme byli maximálně spokojeni. Daniel nám věcně poradil a pomohl zvolit nejlepší variantu plotové výplně po praktické i estetické stránce.',
    author: 'Spokojený zákazník',
  },
];

export const gallery = [
  {
    src: '/images/hero.jpg',
    alt: 'Kovová realizace DR zámečnictví',
    caption: 'Zakázková kovovýroba s důrazem na detail a dlouhou životnost',
  },
  {
    src: '/images/ploty.jpg',
    alt: 'Plot na míru',
    caption: 'Oplocení navržené podle domu, pozemku a potřeb soukromí',
  },
  {
    src: '/images/brany.jpg',
    alt: 'Brána a branka',
    caption: 'Brány a branky sladěné s celým oplocením',
  },
  {
    src: '/images/zabradli.jpg',
    alt: 'Kovové zábradlí',
    caption: 'Zábradlí a schodišťové prvky pro interiér i exteriér',
  },
  {
    src: '/images/grily.jpg',
    alt: 'Venkovní kovový prvek',
    caption: 'Venkovní nábytek, kuchyně a atypické realizace',
  },
];

export const stats = [
  { value: '10+', label: 'let zkušeností v oboru' },
  { value: '1:1', label: 'osobní vedení zakázky' },
  { value: '5', label: 'hlavních sekcí v nabídce' },
];

export const navItems: NavItem[] = [
  { href: '/pergoly', label: 'Pergoly' },
  {
    href: '/venkovni-nabytek',
    label: 'Venkovní nábytek',
    children: [
      { href: '/kuchyne', label: 'Kuchyně' },
      { href: '/stoly', label: 'Stoly' },
    ],
  },
  {
    href: '/oploceni',
    label: 'Oplocení',
    children: [
      { href: '/kovane-ploty', label: 'Kované ploty' },
      { href: '/tahokov', label: 'Tahokov' },
      { href: '/hlinikove', label: 'Hliníkové' },
      { href: '/brany', label: 'Brány' },
    ],
  },
  {
    href: '/ostatni',
    label: 'Ostatní',
    children: [
      { href: '/schodiste', label: 'Schodiště' },
      { href: '/zabradli', label: 'Zábradlí' },
      { href: '/umelecke-projekty', label: 'Umělecké projekty' },
    ],
  },
  { href: '/kontakty', label: 'Kontakt' },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}
