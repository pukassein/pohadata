const path = require('node:path');
const dotenv = require('dotenv');
const { profiles } = require('../server/seed-data');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const { savePlant } = require('../server/repository');
const { pool } = require('../server/db');

const descriptions = {
  'yerba-mate': 'Se consume diariamente como mate y tereré; tradicionalmente se reconoce como bebida social y asociada a la atención.',
  cedron: 'Las hojas se preparan como infusión aromática y suelen añadirse al tereré en contextos domésticos.',
  burrito: 'Las hojas aromáticas se utilizan en infusiones y tereré, especialmente en preparaciones domésticas posteriores a las comidas.',
  stevia: 'Las hojas son conocidas por su sabor dulce y se utilizan en bebidas y preparaciones domésticas.',
  carqueja: 'Las partes aéreas aparecen en infusiones y decocciones regionales; a veces se incorporan a tererés amargos.',
  mentai: 'Es una adición aromática frecuente al tereré y a las infusiones, valorada por su sabor refrescante y uso doméstico.',
  pitanga: 'Las hojas y frutos aparecen en prácticas alimentarias y domésticas regionales; las hojas pueden prepararse como infusión.',
  guavira: 'Fruto nativo con relevancia alimentaria y doméstica; las hojas también aparecen en preparaciones tradicionales.',
  tilo: 'Las flores se utilizan como infusión fragante en contextos domésticos de calma tradicional.',
  boldo: 'Las hojas se utilizan en infusiones amargas y se asocian con prácticas digestivas domésticas.',
};
const evidenceNotes = {
  traditional: 'Registro de uso tradicional o etnobotánico; no equivale a eficacia clínica.',
  phytochemical: 'Se han descrito compuestos o grupos de compuestos en la planta o sus extractos.',
  'in-vitro': 'Se informaron observaciones en ensayos de laboratorio; no deben extrapolarse automáticamente a personas.',
  animal: 'Se informaron observaciones en modelos animales para preparaciones específicas.',
  human: 'Existe literatura con participantes humanos; este perfil no interpreta eficacia clínica.',
};

function toPayload(profile) {
  const [slug, commonName, guaraniName, scientificName, family, _description, parts, preparations, categories, activityNames, compounds, evidenceTypes, _notes, references] = profile;
  const description = descriptions[slug] || '';
  const uses = [...new Set(categories)].map((category) => ({ category, description, plantPart: parts.join(', '), preparation: preparations.join(', '), contextNotes: 'Registro importado desde el prototipo estático.' }));
  const activities = [...new Set(activityNames)].map((name) => ({ name, description: 'Actividad reportada en la literatura o en el registro inicial; no equivale a eficacia clínica.' }));
  return { slug, commonName, guaraniName, scientificName, family, description, parts, preparations: preparations.map((name) => ({ name })), traditionalUses: uses, compounds: compounds.map(([name, compoundClass]) => ({ name, compoundClass, qualitativelyIdentified: true, quantitativeValues: [] })), activities, evidence: evidenceTypes.map((evidenceType) => ({ evidenceType, notes: evidenceNotes[evidenceType], activityIndex: ['in-vitro', 'animal', 'human'].includes(evidenceType) ? 0 : null, compoundIndex: evidenceType === 'phytochemical' ? 0 : null, traditionalUseIndex: evidenceType === 'traditional' ? 0 : null })), references: references.map(([authors, title]) => ({ authors, title, notes: /placeholder|prototipo|verificar/i.test(title) ? 'Referencia heredada del prototipo; verificar antes de publicar.' : '' })) };
}

(async () => {
  for (const profile of profiles) { const payload = toPayload(profile); const existing = await pool.query('SELECT id FROM plants WHERE slug=$1', [payload.slug]); await savePlant(payload, existing.rows[0]?.id || null); console.log(`Importada: ${payload.commonName}`); }
  console.log(`${profiles.length} perfiles importados.`);
  await pool.end();
})().catch(async (error) => { console.error(error.message); await pool.end(); process.exitCode = 1; });
