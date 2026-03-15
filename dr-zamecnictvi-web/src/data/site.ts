export const siteUrl = 'https://www.dr-zamecnictvi.cz';

export const company = {
  name: 'DR zámečnictví a kovovýroba',
  owner: 'Daniel Richter',
  location: 'Studénka, severní Morava',
  workshop: 'Rodinná dílna blízko nádraží ve Studénce',
  description:
    'Zakázková kovovýroba a zámečnictví se zaměřením na ploty, brány, zábradlí a atypické ocelové realizace.',
  intro:
    'Jmenuji se Daniel Richter a v rodinné dílně ve Studénce vyrábím ploty, brány, zábradlí i další kovové prvky na míru. Každou zakázku řeším osobně od konzultace a zaměření až po finální montáž.',
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
    slug: 'brany',
    href: '/brany',
    title: 'Brány a branky',
    eyebrow: 'Vjezdové brány i vstupní branky',
    summary: 'Funkční a vizuálně čisté vstupy k domu, firmě nebo zahradě.',
    description:
      'Vjezdové brány a vchodové branky navrhuji tak, aby ladily s plotem, byly pohodlné na každodenní používání a vydržely roky.',
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
    slug: 'ostatni',
    href: '/ostatni',
    title: 'Ostatní realizace',
    eyebrow: 'Krby, grily a atypické projekty',
    summary: 'Zakázkové kovové prvky, které se nevejdou do šablony.',
    description:
      'Vedle hlavních realizací vznikají také zahradní grily, krby, podnože stolů a další atypické nebo umělecké projekty na míru.',
    image: '/images/grily.jpg',
    bullets: [
      'Zahradní grily a krby',
      'Interiérové podnože a menší designové prvky',
      'Atypické a umělecké projekty podle zadání nebo návrhu',
    ],
    detailTitle: 'Když má projekt vlastní charakter',
    detailIntro:
      'Nejzajímavější zakázky často vznikají tam, kde se nedá sáhnout po hotovém řešení. Právě takové realizace mě baví nejvíc.',
    detailPoints: [
      'Mohu vyrobit produkt podle výkresu, vzoru nebo vlastního návrhu.',
      'U atypických realizací hledám rovnováhu mezi řemeslem a originalitou.',
      'Každý kus vzniká individuálně podle prostoru a představy zákazníka.',
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
    caption: 'Ploty navržené podle domu, pozemku a potřeb soukromí',
  },
  {
    src: '/images/brany.jpg',
    alt: 'Brána a branka',
    caption: 'Brány a branky sladěné s celým oplocením',
  },
  {
    src: '/images/zabradli.jpg',
    alt: 'Kovové zábradlí',
    caption: 'Zábradlí pro schodiště, terasy i balkony',
  },
  {
    src: '/images/grily.jpg',
    alt: 'Kovový gril',
    caption: 'Krby, grily a další atypické kovové prvky',
  },
];

export const stats = [
  { value: '10+', label: 'let zkušeností v oboru' },
  { value: '1:1', label: 'osobní vedení zakázky' },
  { value: '4', label: 'hlavní oblasti realizací' },
];

export const navItems = [
  { href: '/', label: 'Úvod' },
  { href: '/ploty', label: 'Ploty' },
  { href: '/brany', label: 'Brány' },
  { href: '/zabradli', label: 'Zábradlí' },
  { href: '/ostatni', label: 'Ostatní' },
  { href: '/fotogalerie', label: 'Fotogalerie' },
  { href: '/kontakty', label: 'Kontakty' },
];
