// Ceník převzatý z prvního návrhu. Před použitím jako závazné nabídky jej potvrdí výrobce.
export const pergolaCalculatorSettings = {
  defaultSizeId: '3000x4000',
  roofingPrice: 12545,
  zincPrice: 4500,
  colorPrice: 5000,
  deliveryNote: 'Dopravu naceníme samostatně podle adresy. Není zahrnuta v součtu.',
  sizes: [
    { id: '3000x4000', label: '3 × 4 m', structure: 35500, assembly: 8000 },
    { id: '3000x5000', label: '3 × 5 m', structure: 45500, assembly: 10000 },
    { id: '3000x6000', label: '3 × 6 m', structure: 54500, assembly: 13000 },
    { id: '4000x4000', label: '4 × 4 m', structure: 52500, assembly: 10000 },
    { id: '5000x4000', label: '5 × 4 m', structure: 65500, assembly: 12000 },
    { id: '6000x4000', label: '6 × 4 m', structure: 76500, assembly: 14000 },
  ],
  colors: [
    { id: '7016', label: 'Antracit', ral: 'RAL 7016', swatch: '#444d56' },
    { id: '9005', label: 'Černá matná', ral: 'RAL 9005', swatch: '#171918' },
    { id: '9010', label: 'Bílá', ral: 'RAL 9010', swatch: '#f0f1ec' },
  ],
};
