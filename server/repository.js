const { pool } = require('./db');

const empty = (value) => value === undefined || value === null ? '' : value;
const list = (value) => Array.isArray(value) ? value : [];

function slugify(value) {
  return String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `planta-${Date.now()}`;
}

function completeness(plant) {
  const missing = [];
  if (!plant.commonName || !plant.scientificName || !plant.family) missing.push('identificación');
  if (!plant.traditionalUses.length) missing.push('usos tradicionales');
  if (!plant.preparations.length) missing.push('preparación');
  if (!plant.compounds.length) missing.push('fitoquímica');
  if (!plant.activities.length && !plant.evidence.length) missing.push('actividad/evidencia');
  if (!plant.references.length) missing.push('referencias');
  return { complete: missing.length === 0, missing };
}

async function fetchPlantRows(queryable, where = '', params = []) {
  const { rows } = await queryable.query(`SELECT * FROM plants ${where} ORDER BY common_name`, params);
  return Promise.all(rows.map((row) => hydratePlant(queryable, row)));
}

async function hydratePlant(queryable, row) {
  const [parts, synonyms, preparations, uses, compounds, activities, evidence, references] = await Promise.all([
    queryable.query('SELECT name FROM plant_parts WHERE plant_id = $1 ORDER BY sort_order, name', [row.id]),
    queryable.query('SELECT name FROM plant_synonyms WHERE plant_id = $1 ORDER BY name', [row.id]),
    queryable.query(`SELECT pm.name, pp.notes FROM plant_preparations pp JOIN preparation_methods pm ON pm.id = pp.preparation_id WHERE pp.plant_id = $1 ORDER BY pm.name`, [row.id]),
    queryable.query('SELECT * FROM traditional_uses WHERE plant_id = $1 ORDER BY id', [row.id]),
    queryable.query('SELECT * FROM compounds WHERE plant_id = $1 ORDER BY name', [row.id]),
    queryable.query('SELECT * FROM activities WHERE plant_id = $1 ORDER BY name', [row.id]),
    queryable.query('SELECT * FROM evidence_records WHERE plant_id = $1 ORDER BY evidence_type, id', [row.id]),
    queryable.query('SELECT * FROM plant_references WHERE plant_id = $1 ORDER BY created_at, id', [row.id]),
  ]);

  const quantities = compounds.rows.length
    ? await queryable.query('SELECT * FROM quantitative_values WHERE compound_id = ANY($1::uuid[]) ORDER BY id', [compounds.rows.map((item) => item.id)])
    : { rows: [] };
  const quantityByCompound = new Map();
  quantities.rows.forEach((item) => {
    if (!quantityByCompound.has(item.compound_id)) quantityByCompound.set(item.compound_id, []);
    quantityByCompound.get(item.compound_id).push(item);
  });
  const referenceIndex = new Map(references.rows.map((item, index) => [item.id, index]));
  const activityIndex = new Map(activities.rows.map((item, index) => [item.id, index]));
  const compoundIndex = new Map(compounds.rows.map((item, index) => [item.id, index]));
  const useIndex = new Map(uses.rows.map((item, index) => [item.id, index]));

  const plant = {
    id: row.id,
    slug: row.slug,
    commonName: row.common_name,
    guaraniName: row.guarani_name || '',
    scientificName: row.scientific_name,
    family: row.botanical_family || '',
    description: row.description || '',
    image: { url: row.image_url || '', caption: row.image_caption || '', credit: row.image_credit || '', license: row.image_license || '' },
    synonyms: synonyms.rows.map((item) => item.name),
    parts: parts.rows.map((item) => item.name),
    preparations: preparations.rows.map((item) => ({ name: item.name, notes: item.notes || '' })),
    traditionalUses: uses.rows.map((item) => ({ category: item.category, description: item.description, plantPart: item.plant_part || '', preparation: item.preparation || '', contextNotes: item.context_notes || '', referenceIndex: item.reference_id ? referenceIndex.get(item.reference_id) : null })),
    compounds: compounds.rows.map((item) => ({ name: item.name, compoundClass: item.compound_class || '', notes: item.notes || '', qualitativelyIdentified: item.qualitatively_identified, quantitativeValues: (quantityByCompound.get(item.id) || []).map((value) => ({ value: value.value, minimumValue: value.minimum_value, maximumValue: value.maximum_value, unit: value.unit || '', basis: value.basis || '', plantPart: value.plant_part || '', extractionMethod: value.extraction_method || '', sampleConditions: value.sample_conditions || '', notes: value.notes || '', referenceIndex: value.reference_id ? referenceIndex.get(value.reference_id) : null })) })),
    activities: activities.rows.map((item) => ({ name: item.name, description: item.description || '' })),
    evidence: evidence.rows.map((item) => ({ evidenceType: item.evidence_type, notes: item.notes || '', activityIndex: item.activity_id ? activityIndex.get(item.activity_id) : null, compoundIndex: item.compound_id ? compoundIndex.get(item.compound_id) : null, traditionalUseIndex: item.traditional_use_id ? useIndex.get(item.traditional_use_id) : null, referenceIndex: item.reference_id ? referenceIndex.get(item.reference_id) : null })),
    references: references.rows.map((item) => ({ authors: item.authors || '', title: item.title, publicationYear: item.publication_year || '', journalOrSource: item.journal_or_source || '', doi: item.doi || '', url: item.url || '', citationText: item.citation_text || '', notes: item.notes || '' })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  plant.completeness = completeness(plant);
  plant.categories = [...new Set(plant.traditionalUses.map((item) => item.category).filter(Boolean))];
  plant.activities = plant.activities;
  plant.evidenceTypes = [...new Set(plant.evidence.map((item) => item.evidenceType))];
  return plant;
}

async function getPlants() { return fetchPlantRows(pool); }
async function getPlant(idOrSlug) {
  const { rows } = await pool.query('SELECT * FROM plants WHERE id::text = $1 OR slug = $1 LIMIT 1', [idOrSlug]);
  return rows[0] ? hydratePlant(pool, rows[0]) : null;
}

function valueOrNull(value) { return value === '' || value === undefined || value === null ? null : value; }
function indexValue(value, values) {
  if (value === null || value === undefined || value === '') return null;
  if (Number.isInteger(value)) return values[value]?.id || null;
  return values.find((item) => item.id === value)?.id || null;
}

async function savePlant(input, id = null) {
  const commonName = String(input.commonName || '').trim();
  const scientificName = String(input.scientificName || '').trim();
  if (!commonName || !scientificName) throw new Error('El nombre común y el nombre científico son obligatorios.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const slug = slugify(input.slug || commonName);
    const duplicate = await client.query('SELECT id FROM plants WHERE slug = $1 AND ($2::uuid IS NULL OR id <> $2)', [slug, id]);
    if (duplicate.rows.length) throw new Error('Ya existe una planta con ese identificador.');
    let plantRow;
    if (id) {
      const updated = await client.query(`UPDATE plants SET slug=$1, common_name=$2, guarani_name=$3, scientific_name=$4, botanical_family=$5, description=$6, image_url=$7, image_caption=$8, image_credit=$9, image_license=$10 WHERE id=$11 RETURNING *`, [slug, commonName, valueOrNull(input.guaraniName), scientificName, valueOrNull(input.family), valueOrNull(input.description), valueOrNull(input.image?.url), valueOrNull(input.image?.caption), valueOrNull(input.image?.credit), valueOrNull(input.image?.license), id]);
      if (!updated.rows.length) throw new Error('La planta no existe.');
      plantRow = updated.rows[0];
      await Promise.all([
        client.query('DELETE FROM evidence_records WHERE plant_id=$1', [id]),
        client.query('DELETE FROM traditional_uses WHERE plant_id=$1', [id]),
        client.query('DELETE FROM plant_preparations WHERE plant_id=$1', [id]),
        client.query('DELETE FROM preparation_methods WHERE id IN (SELECT preparation_id FROM plant_preparations WHERE plant_id=$1) AND NOT EXISTS (SELECT 1 FROM plant_preparations WHERE preparation_id = preparation_methods.id)', [id]),
        client.query('DELETE FROM plant_parts WHERE plant_id=$1', [id]),
        client.query('DELETE FROM plant_synonyms WHERE plant_id=$1', [id]),
        client.query('DELETE FROM activities WHERE plant_id=$1', [id]),
        client.query('DELETE FROM compounds WHERE plant_id=$1', [id]),
        client.query('DELETE FROM plant_references WHERE plant_id=$1', [id]),
      ]);
    } else {
      const inserted = await client.query(`INSERT INTO plants (slug, common_name, guarani_name, scientific_name, botanical_family, description, image_url, image_caption, image_credit, image_license) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [slug, commonName, valueOrNull(input.guaraniName), scientificName, valueOrNull(input.family), valueOrNull(input.description), valueOrNull(input.image?.url), valueOrNull(input.image?.caption), valueOrNull(input.image?.credit), valueOrNull(input.image?.license)]);
      plantRow = inserted.rows[0];
    }

    const plantId = plantRow.id;
    for (const [index, name] of list(input.synonyms).map(String).map((item) => item.trim()).filter(Boolean).entries()) await client.query('INSERT INTO plant_synonyms (plant_id, name) VALUES ($1,$2)', [plantId, name]);
    for (const [index, name] of list(input.parts).map(String).map((item) => item.trim()).filter(Boolean).entries()) await client.query('INSERT INTO plant_parts (plant_id, name, sort_order) VALUES ($1,$2,$3)', [plantId, name, index]);
    const preparations = [];
    for (const item of list(input.preparations)) {
      const name = String(item.name || item || '').trim();
      if (!name) continue;
      const method = await client.query('INSERT INTO preparation_methods (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id', [name]);
      await client.query('INSERT INTO plant_preparations (plant_id, preparation_id, notes) VALUES ($1,$2,$3)', [plantId, method.rows[0].id, valueOrNull(item.notes)]);
      preparations.push({ id: method.rows[0].id });
    }
    const references = [];
    for (const item of list(input.references)) {
      const title = String(item.title || '').trim();
      if (!title) continue;
      const result = await client.query(`INSERT INTO plant_references (plant_id, authors, title, publication_year, journal_or_source, doi, url, citation_text, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`, [plantId, valueOrNull(item.authors), title, valueOrNull(item.publicationYear), valueOrNull(item.journalOrSource), valueOrNull(item.doi), valueOrNull(item.url), valueOrNull(item.citationText), valueOrNull(item.notes)]);
      references.push(result.rows[0]);
    }
    const uses = [];
    for (const item of list(input.traditionalUses)) {
      const category = String(item.category || '').trim();
      const description = String(item.description || '').trim();
      if (!category || !description) continue;
      const result = await client.query('INSERT INTO traditional_uses (plant_id, category, description, plant_part, preparation, context_notes, reference_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [plantId, category, description, valueOrNull(item.plantPart), valueOrNull(item.preparation), valueOrNull(item.contextNotes), indexValue(item.referenceIndex, references)]);
      uses.push(result.rows[0]);
    }
    const compounds = [];
    for (const item of list(input.compounds)) {
      const name = String(item.name || '').trim();
      if (!name) continue;
      const result = await client.query('INSERT INTO compounds (plant_id, name, compound_class, notes, qualitatively_identified) VALUES ($1,$2,$3,$4,$5) RETURNING *', [plantId, name, valueOrNull(item.compoundClass), valueOrNull(item.notes), Boolean(item.qualitativelyIdentified)]);
      compounds.push(result.rows[0]);
      for (const quantity of list(item.quantitativeValues)) {
        const hasValue = quantity.value !== '' && quantity.value !== null && quantity.value !== undefined;
        const hasRange = quantity.minimumValue !== '' || quantity.maximumValue !== '';
        if (!hasValue && !hasRange) continue;
        await client.query('INSERT INTO quantitative_values (compound_id, value, minimum_value, maximum_value, unit, basis, plant_part, extraction_method, sample_conditions, notes, reference_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [result.rows[0].id, valueOrNull(quantity.value), valueOrNull(quantity.minimumValue), valueOrNull(quantity.maximumValue), valueOrNull(quantity.unit), valueOrNull(quantity.basis), valueOrNull(quantity.plantPart), valueOrNull(quantity.extractionMethod), valueOrNull(quantity.sampleConditions), valueOrNull(quantity.notes), indexValue(quantity.referenceIndex, references)]);
      }
    }
    const activities = [];
    for (const item of list(input.activities)) {
      const name = String(item.name || '').trim();
      if (!name) continue;
      const result = await client.query('INSERT INTO activities (plant_id, name, description) VALUES ($1,$2,$3) RETURNING *', [plantId, name, valueOrNull(item.description)]);
      activities.push(result.rows[0]);
    }
    for (const item of list(input.evidence)) {
      if (!['traditional', 'phytochemical', 'in-vitro', 'animal', 'human'].includes(item.evidenceType)) continue;
      await client.query('INSERT INTO evidence_records (plant_id, evidence_type, notes, activity_id, compound_id, traditional_use_id, reference_id) VALUES ($1,$2,$3,$4,$5,$6,$7)', [plantId, item.evidenceType, valueOrNull(item.notes), indexValue(item.activityIndex, activities), indexValue(item.compoundIndex, compounds), indexValue(item.traditionalUseIndex, uses), indexValue(item.referenceIndex, references)]);
    }
    await client.query('COMMIT');
    return getPlant(plantId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}

async function deletePlant(id) {
  const result = await pool.query('DELETE FROM plants WHERE id=$1 RETURNING id', [id]);
  return result.rowCount > 0;
}

module.exports = { getPlants, getPlant, savePlant, deletePlant, slugify };
