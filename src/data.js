export const evidenceTypes = [
  { id: 'traditional', label: 'Uso tradicional', short: 'Tradición', color: 'terracotta', description: 'Documentado en fuentes comunitarias o etnobotánicas.' },
  { id: 'phytochemical', label: 'Fitoquímica', short: 'Compuestos', color: 'violet', description: 'Compuestos o grupos de compuestos caracterizados en la planta.' },
  { id: 'in-vitro', label: 'In vitro', short: 'In vitro', color: 'blue', description: 'Observado en ensayos de laboratorio fuera de un organismo vivo.' },
  { id: 'animal', label: 'Estudios animales', short: 'Animal', color: 'amber', description: 'Observado en modelos animales preclínicos.' },
  { id: 'human', label: 'Estudios en personas', short: 'Personas', color: 'green', description: 'Evidencia proveniente de estudios con participantes humanos.' },
];

export const plants = [
  {
    id: 'yerba-mate', common: 'Yerba mate', guarani: "Ka'a", scientific: 'Ilex paraguariensis A.St.-Hil.', family: 'Aquifoliaceae', part: 'Leaves', parts: ['Leaves'], preparation: ['Infusion', 'Tereré', 'Mate'],
    categories: ['Stimulant', 'Polyphenol-rich'], activities: ['Antioxidant activity reported'], compounds: ['Methylxanthines', 'Polyphenols', 'Saponins'], shared: ['Caffeine', 'Chlorogenic acids'], evidence: ['traditional', 'phytochemical', 'in-vitro', 'animal', 'human'], level: 'Broad literature', color: 'green', initials: 'YM',
    traditional: 'Consumed daily as mate and tereré; traditionally used as a social beverage and to support alertness.',
    note: 'This profile describes documented use and research signals; it is not a recommendation for use.',
    references: ['Heck & de Mejia (2007) — Comprehensive Reviews in Food Science', 'Bracesco et al. (2011) — Journal of Ethnopharmacology'],
    evidenceNotes: { traditional: 'Widely documented beverage tradition in Paraguay and the Southern Cone.', phytochemical: 'Methylxanthines, polyphenols and saponins have been characterized.', 'in-vitro': 'Multiple laboratory assays report antioxidant activity.', animal: 'Preclinical studies are available for selected extracts.', human: 'Human literature exists, with varied designs and outcomes.' }
  },
  {
    id: 'cedron', common: 'Cedrón', guarani: 'Kaʼay', scientific: 'Aloysia citrodora Palau', family: 'Verbenaceae', part: 'Leaves', parts: ['Leaves'], preparation: ['Infusion', 'Tereré'],
    categories: ['Digestive', 'Relaxing / traditional calming use'], activities: ['Antioxidant activity reported', 'Antimicrobial activity reported'], compounds: ['Phenylpropanoids', 'Terpenes', 'Polyphenols'], shared: ['Citral', 'Verbascoside'], evidence: ['traditional', 'phytochemical', 'in-vitro'], level: 'Early evidence', color: 'sage', initials: 'CE',
    traditional: 'Leaves are prepared as an aromatic infusion and are commonly added to tereré for a refreshing, digestive tradition.',
    note: 'Traditional digestive and calming language is preserved as cultural documentation, not as a clinical claim.',
    references: ['Tajidin et al. (2012) — Industrial Crops and Products', 'Sample regional ethnobotanical record — prototype placeholder'],
    evidenceNotes: { traditional: 'Commonly recorded in household infusions and tereré blends.', phytochemical: 'Aromatic terpenes and phenylpropanoid compounds are reported.', 'in-vitro': 'Some extracts have been evaluated in laboratory assays.' }
  },
  {
    id: 'burrito', common: 'Burrito', guarani: 'Burrito', scientific: 'Aloysia polystachya (Griseb.) Moldenke', family: 'Verbenaceae', part: 'Leaves', parts: ['Leaves'], preparation: ['Infusion', 'Tereré'],
    categories: ['Digestive', 'Relaxing / traditional calming use'], activities: ['Antioxidant activity reported'], compounds: ['Terpenes', 'Flavonoids', 'Phenylpropanoids'], shared: ['Verbascoside'], evidence: ['traditional', 'phytochemical', 'in-vitro', 'animal'], level: 'Developing', color: 'mint', initials: 'BU',
    traditional: 'Aromatic leaves are used in infusions and tereré, especially in household preparations after meals.',
    note: 'A documented traditional pattern does not establish safety or effectiveness for a particular condition.',
    references: ['Fritz et al. (2007) — Essential oil characterization', 'Prototype literature placeholder — verify before publication'],
    evidenceNotes: { traditional: 'Recorded as a household aromatic plant in the region.', phytochemical: 'Essential oils and flavonoid compounds have been reported.', 'in-vitro': 'Selected extracts have been assessed in laboratory models.', animal: 'Some preclinical work is reported; transfer to humans is uncertain.' }
  },
  {
    id: 'stevia', common: 'Stevia', guarani: "Ka'a he'ẽ", scientific: 'Stevia rebaudiana (Bertoni) Bertoni', family: 'Asteraceae', part: 'Leaves', parts: ['Leaves'], preparation: ['Infusion', 'Mate', 'Tereré'],
    categories: ['Polyphenol-rich', 'Sweet-tasting plant'], activities: ['Antioxidant activity reported'], compounds: ['Diterpene glycosides', 'Polyphenols', 'Flavonoids'], shared: ['Chlorogenic acids'], evidence: ['traditional', 'phytochemical', 'in-vitro', 'animal', 'human'], level: 'Broad literature', color: 'lime', initials: 'ST',
    traditional: 'Leaves are known for their sweet taste and are used in beverages and home preparations.',
    note: 'Sweet taste and laboratory findings are presented separately from any clinical interpretation.',
    references: ['Gantait et al. (2015) — Plant Science', 'Geuns (2003) — Phytochemistry'],
    evidenceNotes: { traditional: 'Cultivated and used as a sweet-tasting plant in Paraguay.', phytochemical: 'Steviol glycosides and polyphenols are well characterized.', 'in-vitro': 'Extracts and compounds have been tested in laboratory systems.', animal: 'Preclinical studies exist for selected preparations.', human: 'Human studies exist, but this app does not interpret clinical efficacy.' }
  },
  {
    id: 'carqueja', common: 'Carqueja', guarani: 'Jaguarete kaʼa', scientific: 'Baccharis trimera (Less.) DC.', family: 'Asteraceae', part: 'Aerial parts', parts: ['Aerial parts'], preparation: ['Infusion', 'Decoction', 'Tereré'],
    categories: ['Digestive', 'Diuretic traditional use'], activities: ['Antioxidant activity reported', 'Anti-inflammatory activity reported'], compounds: ['Diterpenes', 'Flavonoids', 'Polyphenols'], shared: ['Quercetin derivatives'], evidence: ['traditional', 'phytochemical', 'in-vitro', 'animal'], level: 'Developing', color: 'ochre', initials: 'CA',
    traditional: 'Aerial parts are used in regional infusions and decoctions; sometimes included in bitter tereré blends.',
    note: 'The term “diuretic” here describes a traditional category, not a medical effect demonstrated in people.',
    references: ['Borella et al. (2006) — Phytochemical studies', 'Prototype literature placeholder — verify before publication'],
    evidenceNotes: { traditional: 'Traditional use records include bitter infusions and decoctions.', phytochemical: 'Flavonoids and diterpenes are reported in extracts.', 'in-vitro': 'Laboratory activity has been reported for selected fractions.', animal: 'Animal evidence is limited to specific experimental preparations.' }
  },
  {
    id: 'mentai', common: "Menta'i", guarani: "Menta'i", scientific: 'Mentha × piperita L.', family: 'Lamiaceae', part: 'Leaves', parts: ['Leaves'], preparation: ['Infusion', 'Tereré'],
    categories: ['Digestive', 'Refreshing aromatic'], activities: ['Antimicrobial activity reported'], compounds: ['Monoterpenes', 'Phenolic acids', 'Flavonoids'], shared: ['Rosmarinic acid'], evidence: ['traditional', 'phytochemical', 'in-vitro'], level: 'Early evidence', color: 'teal', initials: 'ME',
    traditional: 'A familiar aromatic addition to tereré and infusions, valued for its cooling flavor and household use after meals.',
    note: 'Flavor, cultural use, and experimental findings are separate information layers in this profile.',
    references: ['McKay & Blumberg (2006) — Phytotherapy Research', 'Prototype local-use record — placeholder'],
    evidenceNotes: { traditional: 'Aromatic mint preparations are common in home beverage traditions.', phytochemical: 'Menthol-rich essential oil and phenolic compounds are documented.', 'in-vitro': 'Laboratory assays report activity for some preparations.' }
  },
  {
    id: 'pitanga', common: 'Pitanga', guarani: 'Ñangapiry', scientific: 'Eugenia uniflora L.', family: 'Myrtaceae', part: 'Leaves and fruit', parts: ['Leaves', 'Fruit'], preparation: ['Infusion', 'Decoction'],
    categories: ['Antioxidant activity reported', 'Digestive'], activities: ['Antioxidant activity reported', 'Antimicrobial activity reported'], compounds: ['Anthocyanins', 'Terpenes', 'Polyphenols'], shared: ['Quercetin derivatives', 'Ellagic acid'], evidence: ['traditional', 'phytochemical', 'in-vitro', 'animal'], level: 'Developing', color: 'coral', initials: 'PI',
    traditional: 'Leaves and fruit appear in regional food and household traditions; leaves may be prepared as an infusion.',
    note: 'Food use, traditional use and experimental activity are different evidence categories.',
    references: ['Auricchio et al. (2007) — Food Chemistry', 'Prototype ethnobotanical record — placeholder'],
    evidenceNotes: { traditional: 'Regional food and household use is documented.', phytochemical: 'Pigments, terpenes and polyphenols have been characterized.', 'in-vitro': 'Antioxidant and antimicrobial assays are reported.', animal: 'Some preclinical studies are available.' }
  },
  {
    id: 'guavira', common: 'Guavira', guarani: 'Aratiku guasu', scientific: 'Campomanesia xanthocarpa O.Berg', family: 'Myrtaceae', part: 'Fruit and leaves', parts: ['Fruit', 'Leaves'], preparation: ['Infusion', 'Food preparation'],
    categories: ['Antioxidant activity reported', 'Polyphenol-rich'], activities: ['Antioxidant activity reported'], compounds: ['Polyphenols', 'Carotenoids', 'Tannins'], shared: ['Chlorogenic acids', 'Quercetin derivatives'], evidence: ['traditional', 'phytochemical', 'in-vitro'], level: 'Early evidence', color: 'gold', initials: 'GU',
    traditional: 'A native fruit with food and household relevance; leaves are also found in traditional preparations.',
    note: 'The profile does not infer therapeutic outcomes from nutritional or laboratory data.',
    references: ['Sample native-fruit composition study — prototype placeholder', 'Verify regional taxonomy before publication'],
    evidenceNotes: { traditional: 'Food and household relevance is documented in regional contexts.', phytochemical: 'Polyphenols, tannins and pigments have been reported.', 'in-vitro': 'Laboratory antioxidant assays are available for selected extracts.' }
  },
  {
    id: 'tilo', common: 'Tilo', guarani: 'Tilo', scientific: 'Tilia cordata Mill.', family: 'Malvaceae', part: 'Flowers and bracts', parts: ['Flowers'], preparation: ['Infusion'],
    categories: ['Relaxing / traditional calming use'], activities: ['Antioxidant activity reported'], compounds: ['Flavonoids', 'Volatile oils', 'Mucilage polysaccharides'], shared: ['Quercetin derivatives'], evidence: ['traditional', 'phytochemical', 'in-vitro', 'human'], level: 'Broad literature', color: 'lavender', initials: 'TI',
    traditional: 'Flowers are used as a fragrant infusion in household calming traditions.',
    note: 'This prototype records a traditional category without making a recommendation or medical promise.',
    references: ['European Medicines Agency — linden flower monograph placeholder', 'Prototype ethnobotanical record — placeholder'],
    evidenceNotes: { traditional: 'Flower infusions are documented in household traditions.', phytochemical: 'Flavonoids and volatile compounds are characterized.', 'in-vitro': 'Some laboratory studies report antioxidant signals.', human: 'Human literature exists, but outcomes are not interpreted here.' }
  },
  {
    id: 'boldo', common: 'Boldo', guarani: 'Boldo', scientific: 'Peumus boldus Molina', family: 'Monimiaceae', part: 'Leaves', parts: ['Leaves'], preparation: ['Infusion'],
    categories: ['Digestive'], activities: ['Antioxidant activity reported'], compounds: ['Alkaloids', 'Essential oils', 'Flavonoids'], shared: ['Catechins'], evidence: ['traditional', 'phytochemical', 'in-vitro'], level: 'Early evidence', color: 'blue', initials: 'BO',
    traditional: 'Leaves are used in bitter infusions and are associated with digestive household traditions.',
    note: 'Bitter taste and traditional digestive use should not be read as evidence of treatment efficacy.',
    references: ['Speisky & Cassels (1994) — Pharmacological Reviews', 'Prototype regional-use record — placeholder'],
    evidenceNotes: { traditional: 'Bitter leaf infusions are documented in household traditions.', phytochemical: 'Alkaloids and essential oil constituents are reported.', 'in-vitro': 'Laboratory research exists for selected compounds and extracts.' }
  }
];

export const categories = [
  { id: 'digestive', label: 'Digestive', type: 'Traditional use', description: 'Plants documented in household digestive traditions.', color: 'terracotta', plantIds: ['cedron', 'burrito', 'carqueja', 'mentai', 'pitanga', 'boldo'] },
  { id: 'stimulant', label: 'Stimulant', type: 'Traditional use', description: 'Plants associated with alertness or invigorating beverages.', color: 'amber', plantIds: ['yerba-mate'] },
  { id: 'calming', label: 'Relaxing / calming', type: 'Traditional use', description: 'Plants documented in household calming or evening infusions.', color: 'violet', plantIds: ['cedron', 'burrito', 'tilo'] },
  { id: 'diuretic', label: 'Diuretic', type: 'Traditional use', description: 'A traditional category; not a clinical effectiveness claim.', color: 'blue', plantIds: ['carqueja'] },
  { id: 'antioxidant', label: 'Antioxidant activity', type: 'Experimental evidence', description: 'Activity reported in laboratory or preclinical studies.', color: 'green', plantIds: ['yerba-mate', 'cedron', 'stevia', 'carqueja', 'pitanga', 'guavira', 'tilo', 'boldo'] },
  { id: 'antimicrobial', label: 'Antimicrobial activity', type: 'Experimental evidence', description: 'Reported in laboratory assays for selected preparations.', color: 'teal', plantIds: ['cedron', 'mentai', 'pitanga'] },
  { id: 'caffeine', label: 'Caffeine-containing', type: 'Phytochemical evidence', description: 'Caffeine is reported as a constituent in the plant material.', color: 'orange', plantIds: ['yerba-mate'] },
  { id: 'polyphenol', label: 'Polyphenol-rich', type: 'Phytochemical evidence', description: 'Polyphenol groups are reported in the available profile.', color: 'violet', plantIds: ['yerba-mate', 'stevia', 'guavira'] }
];

export function getPlant(id) { return plants.find((plant) => plant.id === id) || plants[0]; }
export function getEvidence(id) { return evidenceTypes.find((item) => item.id === id); }
