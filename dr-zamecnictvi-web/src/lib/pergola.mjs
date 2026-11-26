import { pergolaCalculatorSettings as config } from '../data/pergola.mjs';

export const defaults = Object.freeze({ size: config.defaultSizeId, roofing: 'polycarbonate', zinc: 'included', assembly: 'pro', delivery: 'pickup', color: '7016' });
const allowed = {
  size: config.sizes.map(s => s.id), roofing: ['none', 'polycarbonate'],
  zinc: ['none', 'included'], assembly: ['self', 'pro'],
  delivery: ['pickup', 'delivery'], color: config.colors.map(c => c.id),
};
export function parseSelection(params) {
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, allowed[key].includes(params.get(key)) ? params.get(key) : fallback]));
}
export function calculate(selection) {
  for (const key of Object.keys(defaults)) if (!allowed[key].includes(selection[key])) throw new Error(`Neplatná volba: ${key}`);
  const size = config.sizes.find(s => s.id === selection.size);
  const color = config.colors.find(c => c.id === selection.color);
  const rows = {
    structure: size.structure,
    roofing: selection.roofing === 'polycarbonate' ? config.roofingPrice : 0,
    color: config.colorPrice,
    zinc: selection.zinc === 'included' ? config.zincPrice : 0,
    assembly: selection.assembly === 'pro' ? size.assembly : 0,
  };
  return { rows, total: Object.values(rows).reduce((a, b) => a + b, 0), size, color };
}
export const currency = value => `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(value)} Kč`;
export function selectionParams(selection) {
  calculate(selection);
  return new URLSearchParams(Object.entries(selection));
}
export function inquirySummary(selection) {
  const { size, color, total } = calculate(selection);
  return [
    `Ocelová pergola ${size.label}`,
    `Krytina: ${selection.roofing === 'polycarbonate' ? 'komůrkový polykarbonát' : 'bez krytiny'}`,
    `Povrch: komaxit ${color.ral} – ${color.label}`,
    `Žárový zinek: ${selection.zinc === 'included' ? 'ano' : 'ne'}`,
    `Montáž: ${selection.assembly === 'pro' ? 'od DR zámečnictví' : 'vlastní'}`,
    `Doprava: ${selection.delivery === 'delivery' ? 'nacenit dle adresy, mimo součet' : 'osobní vyzvednutí'}`,
    `Orientační cena: ${currency(total)} bez DPH. Konečnou cenu potvrdí výrobce.`,
  ].join('\n');
}
