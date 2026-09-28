-- PohãData relational schema. Run with: npm run db:setup

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  common_name text NOT NULL,
  guarani_name text,
  scientific_name text NOT NULL,
  botanical_family text,
  description text,
  image_url text,
  image_caption text,
  image_credit text,
  image_license text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plant_synonyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  name text NOT NULL,
  UNIQUE (plant_id, name)
);

CREATE TABLE IF NOT EXISTS plant_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE (plant_id, name)
);

CREATE TABLE IF NOT EXISTS preparation_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS plant_preparations (
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  preparation_id uuid NOT NULL REFERENCES preparation_methods(id) ON DELETE RESTRICT,
  notes text,
  PRIMARY KEY (plant_id, preparation_id)
);

CREATE TABLE IF NOT EXISTS plant_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  authors text,
  title text NOT NULL,
  publication_year integer,
  journal_or_source text,
  doi text,
  url text,
  citation_text text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS traditional_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  category text NOT NULL,
  description text NOT NULL,
  plant_part text,
  preparation text,
  context_notes text,
  reference_id uuid REFERENCES plant_references(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS compounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  name text NOT NULL,
  compound_class text,
  notes text,
  qualitatively_identified boolean NOT NULL DEFAULT false,
  UNIQUE (plant_id, name)
);

CREATE TABLE IF NOT EXISTS quantitative_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compound_id uuid NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
  value numeric,
  minimum_value numeric,
  maximum_value numeric,
  unit text,
  basis text,
  plant_part text,
  extraction_method text,
  sample_conditions text,
  notes text,
  reference_id uuid REFERENCES plant_references(id) ON DELETE SET NULL,
  CHECK (value IS NOT NULL OR minimum_value IS NOT NULL OR maximum_value IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  UNIQUE (plant_id, name)
);

CREATE TABLE IF NOT EXISTS evidence_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  evidence_type text NOT NULL CHECK (evidence_type IN ('traditional', 'phytochemical', 'in-vitro', 'animal', 'human')),
  notes text,
  activity_id uuid REFERENCES activities(id) ON DELETE SET NULL,
  compound_id uuid REFERENCES compounds(id) ON DELETE SET NULL,
  traditional_use_id uuid REFERENCES traditional_uses(id) ON DELETE SET NULL,
  reference_id uuid REFERENCES plant_references(id) ON DELETE SET NULL,
  CHECK (activity_id IS NOT NULL OR compound_id IS NOT NULL OR traditional_use_id IS NOT NULL OR notes IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_plants_common_name ON plants (lower(common_name));
CREATE INDEX IF NOT EXISTS idx_evidence_plant ON evidence_records (plant_id, evidence_type);
CREATE INDEX IF NOT EXISTS idx_references_plant ON plant_references (plant_id);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS plants_set_updated_at ON plants;
CREATE TRIGGER plants_set_updated_at BEFORE UPDATE ON plants
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
