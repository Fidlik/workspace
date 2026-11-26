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
    { label: 'Daniel Richter', display: '724 556 144', href: '724556144' },
    { label: 'Zdeněk Richter', display: '724 588 754', href: '724588754' },
  ],
  facebook: 'https://www.facebook.com/DR.zamecnictvi.a.kovovyroba',
};

export type Photo = {src: string; alt: string; caption?: string};

export type SectionBlock = {
  id: string;
  title: string;
  text: string;
  intro?: string;
  price?: string;
  photos: Photo[];
  ctaHref: string;
};

const photo = (file: string, alt: string): Photo => ({src: '/images/' + file, alt, caption: alt});

export const pergolaPhotos = [
  photo('portfolio/pristresek-1-2023.webp', 'Ocelový přístřešek s polykarbonátovou krytinou'),
  photo('legacy/pristresek-a.webp', 'Ocelový přístřešek u domu'),
  photo('legacy/pristresek-b.webp', 'Přístřešek nad vstupem'),
  photo('legacy/pristresek-c.webp', 'Přístřešek přes celou šířku vjezdu'),
];

const fencePhotos = [
  photo('portfolio/plot-tahokov-2023.webp', 'Oplocení s tahokovovou výplní'),
  photo('legacy/kovany-plot.webp', 'Kovaný plot'),
  photo('legacy/tahokov.webp', 'Plot z tahokovu'),
];
const gatePhotos = [
  photo('legacy/vjezdova-brana.webp', 'Vjezdová brána s oplocením'),
  photo('legacy/brana.webp', 'Vjezdová brána na míru'),
];
const kitchenPhotos = [
  photo('products/kuchyne-1505.webp', 'Venkovní kuchyně na míru'),
  photo('products/kuchyne-1544.webp', 'Venkovní kuchyně s kovovým rámem a dřevěnou výplní'),
  photo('products/kuchyne-1487.webp', 'Venkovní kuchyně s dřezem'),
  photo('products/kuchyne-1619.webp', 'Detail úložného prostoru venkovní kuchyně'),
  photo('products/kuchyne-1664.webp', 'Detail zpracování kuchyňské linky'),
];
const tablePhotos = [
  photo('products/stul-1703.webp', 'Stůl na míru'),
  photo('products/stul-1739.webp', 'Stůl z čelního pohledu'),
  photo('products/stul-1793.webp', 'Stůl z bočního pohledu'),
  photo('products/stul-1907.webp', 'Detail hrany stolu'),
  photo('portfolio/image0-scaled.webp', 'Jídelní stůl a lavice s kovovou podnoží'),
];
const stairPhotos = [
  photo('portfolio/schodiste-3-2023.webp', 'Venkovní kovové schodiště'),
  photo('legacy/schodiste.webp', 'Schodiště s kovovým zábradlím'),
];
const railingPhotos = [
  photo('portfolio/zabradli-1-2023.webp', 'Kovové zábradlí na míru'),
  photo('legacy/zabradli.webp', 'Zábradlí na míru'),
  photo('legacy/kovane-zabradli.webp', 'Ručně kované zábradlí'),
];
const artPhotos = [
  photo('legacy/socha.webp', 'Kovová plastika'),
  photo('legacy/obraz.webp', 'Kovový obraz'),
  photo('legacy/gril.webp', 'Zahradní gril na míru'),
];

export const services = [
  { title: 'Pergoly', href: '/pergoly', photo: pergolaPhotos[0],
    text: 'Ocelové pergoly na míru s důrazem na pevnost, čisté provedení a dlouhou životnost.' },
  { title: 'Venkovní nábytek', href: '/venkovni-nabytek', photo: kitchenPhotos[0],
    text: 'Venkovní kuchyně a stoly z odolných materiálů, navržené pro konkrétní prostor a každodenní používání.' },
  { title: 'Brány a oplocení', href: '/oploceni', photo: fencePhotos[0],
    text: 'Brány, ploty a oplocení na míru. Od návrhu až po montáž včetně případného pohonu.' },
  { title: 'Další realizace', href: '/ostatni', photo: stairPhotos[0],
    text: 'Atypická kovovýroba pro domácnosti i firmy. Od jednotlivých prvků po rozsáhlé realizace.' },
];

export const venkovniNabytekSections: SectionBlock[] = [
  { id: 'kuchyne', title: 'Kuchyně',
    intro: 'Venkovní vaření bez kompromisů.',
    text: 'Navrhujeme a vyrábíme kuchyně a stoly, které mají originální design, jsou funkční a odolné. Venkovní kuchyně přizpůsobíme vašemu prostoru a způsobu používání, aby dobře sloužila na zahradě i na terase.',
    price: 'Vzorová kuchyně 1 800 × 600 × 900 mm: 40 615 Kč',
    photos: kitchenPhotos, ctaHref: '/objednavka?produkt=venkovni-kuchyne' },
  { id: 'stoly', title: 'Stoly',
    text: 'Kovové stoly a podnože pro venkovní i interiérové použití. Konstrukce je pevná a stabilní, ke stolu vám rádi vyrobíme i lavice ve stejném designu.',
    photos: tablePhotos, ctaHref: '/objednavka?produkt=stul' },
];

export const oploceniSections: SectionBlock[] = [
  { id: 'ploty', title: 'Ploty',
    text: 'Oplocení vyrábíme na míru konkrétnímu prostoru i vašim požadavkům. Od návrhu konstrukce až po poslední detail dbáme na přesné zpracování, pevnost a dlouhou životnost.',
    photos: fencePhotos, ctaHref: '/poptavka?produkt=oploceni' },
  { id: 'brany', title: 'Brány',
    text: 'Každou bránu vyrábíme s ohledem na prostor, způsob otevírání a každodenní provoz. Důraz klademe na pevnou konstrukci, přesné osazení a spolehlivý chod po mnoho let.',
    photos: gatePhotos, ctaHref: '/poptavka?produkt=brana' },
];

export const ostatniSections: SectionBlock[] = [
  { id: 'schodiste', title: 'Schodiště',
    text: 'Interiérové i venkovní schodiště na míru s důrazem na pevnost konstrukce, bezpečnost i pohodlný pohyb.',
    photos: stairPhotos, ctaHref: '/poptavka?produkt=schodiste' },
  { id: 'zabradli', title: 'Zábradlí',
    text: 'Bezpečné a stabilní řešení pro schodiště, balkony i terasy s důrazem na přesné osazení a čisté linie.',
    photos: railingPhotos, ctaHref: '/poptavka?produkt=zabradli' },
  { id: 'umelecke-projekty', title: 'Umělecká a atypická výroba',
    text: 'Originální kovové objekty, sochy i atypické výrobky, které vznikají podle individuálních představ. I odvážným nápadům dokážeme dát skutečnou podobu.',
    photos: artPhotos, ctaHref: '/poptavka?produkt=umelecky-projekt' },
];

export const galleryHighlights = [fencePhotos[0], gatePhotos[0], kitchenPhotos[1], stairPhotos[0], artPhotos[2]];
export const gallery = [...new Set([...galleryHighlights, ...pergolaPhotos, ...fencePhotos, ...gatePhotos,
  ...kitchenPhotos, ...tablePhotos, ...stairPhotos, ...railingPhotos, ...artPhotos])];
