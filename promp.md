I want to move PohãData from its current static/mock plant data to a real PostgreSQL-backed application and add a complete but simple admin panel for managing the data.

The PostgreSQL connection is already working through the existing backend using the `DATABASE_URL` environment variable in `.env.local`.

The application currently has plant information hard-coded/static in the frontend. I want that information migrated into PostgreSQL so the public application reads plant information from the database instead.

Do not overengineer the system. PohãData will initially contain around 10 plants and eventually approximately 30–40 plants, and the admin panel will normally be used by only two people.

## Main objective

Implement:

- A PostgreSQL schema suitable for PohãData
- Migration/initial import of the current static plant data into PostgreSQL
- Backend API endpoints for reading and managing the data
- A complete admin panel for adding, editing and deleting plant information
- Spanish throughout the entire application and admin interface
- Continued support for Guaraní plant names
- Support for scientific references and evidence classification
- Support for future quantitative phytochemical data
- Public pages reading their information from PostgreSQL instead of static JavaScript data

Before making changes, inspect the current application structure and existing plant data carefully.

Preserve the existing design and functionality where possible.

---

# 1. Database design

Design a clean relational PostgreSQL schema appropriate for this project.

Do not simply put all information into one enormous `plants` table.

The schema should support the relationships between plants, compounds, activities, evidence, preparation methods, references and related information.

The database must support managing everything relevant to a plant, including at minimum:

## Plant identification

- Common name
- Guaraní name
- Scientific name
- Botanical family
- Additional names/synonyms if useful
- Description
- Plant parts used
- Image URL
- Image caption
- Image source/credit
- Image license if known

The image itself will NOT be stored in PostgreSQL.

Only store the image URL and associated metadata.

## Traditional use

Support one plant having multiple traditional uses.

Each use should be able to contain information such as:

- Traditional-use category
- Description of the traditional use
- Plant part involved
- Traditional preparation
- Cultural/contextual notes where appropriate

Traditional use must remain clearly distinguishable from scientifically demonstrated biological activity.

## Preparation methods

Support preparation methods such as:

- Tereré
- Mate
- Infusion
- Decoction
- Other traditional preparations

A plant may have multiple preparation methods.

Allow useful notes about the preparation where necessary.

Do not implement medical dosage recommendations.

## Phytochemistry

Support multiple phytochemical compounds per plant.

For compounds, allow information such as:

- Compound name
- Compound class
- Notes
- Whether it has been identified qualitatively
- Quantitative information when reliable data exist

Prepare the data model now for quantitative values even if most plants initially do not have them.

Quantitative data should be capable of storing information such as:

- Value
- Minimum value
- Maximum value
- Unit
- Basis, for example mg/g dry material, mg/100 mL infusion, etc.
- Plant part
- Extraction or preparation method
- Experimental/sample conditions when relevant
- Notes
- Scientific source/reference

Never invent missing quantitative values.

Unknown values should remain null or explicitly unavailable.

This structure will later be useful for the mixture builder.

## Biological activities / properties

A plant may have multiple reported biological activities or properties.

Examples:

- Antioxidant
- Anti-inflammatory
- Antimicrobial
- Diuretic
- Stimulant
- Other relevant activities

Each reported activity should be capable of being linked to its evidence.

Do not present an activity as clinically demonstrated unless human evidence actually supports that interpretation.

## Evidence

Evidence classification is very important for PohãData.

The data model and interface must clearly distinguish:

- Traditional / ethnobotanical evidence
- Phytochemical evidence
- In vitro evidence
- Animal evidence
- Human evidence

A single plant/property/activity may have multiple evidence records.

For example, a plant could have:

- Traditional digestive use
- In vitro antioxidant activity
- Animal anti-inflammatory evidence
- No human studies

These must remain separate rather than being collapsed into a generic "scientifically proven" field.

Evidence entries should support useful descriptive notes.

## Scientific references

For this version, I want a general references section associated with each plant.

A plant can have multiple references.

Allow fields appropriate for scientific literature, such as:

- Authors
- Title
- Year
- Journal/source
- DOI
- URL
- Citation text
- Notes

The admin panel should allow references to be added, edited and removed easily.

Where practical, evidence or quantitative compound records may also reference a particular scientific source, but do not make the interface excessively complicated.

The plant page should have a visible general References section.

---

# 2. Database implementation

Create the required SQL schema.

Use sensible:

- Primary keys
- Foreign keys
- Unique constraints where appropriate
- Cascading behavior carefully
- Created timestamps
- Updated timestamps

Use PostgreSQL appropriately.

Avoid unnecessary enterprise-level complexity.

I want a schema that is understandable and maintainable by a small academic project.

If the existing `DATABASE_URL` connection is available and the PostgreSQL database can be reached, you may execute the SQL directly against the existing PohãData database.

Before executing destructive operations, inspect the database first.

Do not delete or overwrite unrelated data.

Also keep the SQL/schema or migration files in the project so the database structure is documented and reproducible.

---

# 3. Migrate the existing static plant data

Inspect the plant information that currently exists in the frontend/static JavaScript files.

Import that information into the new PostgreSQL database.

Do not discard the current information.

Convert it into proper database records.

If some current fields do not map perfectly to the new schema, preserve the content in the most sensible corresponding structure.

Once migrated:

- Public plant pages should read from PostgreSQL
- Plant cards/catalog should read from PostgreSQL
- Filters/comparisons should use database-backed data where relevant
- Existing static plant data should no longer be the primary source of truth

All migrated records must remain editable through the admin panel.

Some existing plant entries are incomplete. That is expected.

Do not fabricate missing information.

---

# 4. Admin access

Create an admin login accessible from a discreet link in the application's footer.

For this stage, only one shared admin password is necessary.

Do not create users, roles, permissions or account-management systems.

Use an environment variable for the password rather than hard-coding the password into source code.

For my local development environment, the intended password is:

`matiadmin`

For example, use something such as:

`ADMIN_PASSWORD=matiadmin`

in `.env.local`.

Do not commit this password to Git.

Create a simple secure admin session after successful login so users do not have to re-enter the password on every admin page.

This is a lightweight academic project, so keep authentication simple, but do not expose the password in frontend JavaScript.

---

# 5. Admin dashboard

Create a responsive admin panel that is comfortable to use on desktop and mobile.

The main screen should display the existing plants in a clear list or table.

For each plant, show useful summary information such as:

- Common name
- Scientific name
- Guaraní name if available
- Completeness status
- Last update if useful

Provide clear actions:

- Edit
- Delete
- View/preview
- Add new plant

Include simple search/filtering if useful.

There will be at most around 30–40 plants, so do not build complicated pagination or enterprise table systems unless necessary.

---

# 6. Add/edit plant interface

The admin must be able to manage EVERYTHING associated with a plant.

Use whatever layout provides the cleanest and most responsive experience.

A tabbed interface, grouped sections, accordion sections, or another clear structured editor is acceptable.

Possible sections could include:

- Identification
- Traditional uses
- Preparation
- Phytochemistry
- Biological activities
- Scientific evidence
- Quantitative data
- References
- Image/media
- Preview

The editor must support adding/removing multiple related items.

For example:

- Add another traditional use
- Add another compound
- Add another biological activity
- Add another evidence record
- Add another reference
- Add another preparation method

Do not make the administrator manually enter database IDs.

Use selectors, forms, searchable dropdowns, or appropriate controls.

Make the forms understandable to someone entering scientific information rather than someone thinking about database tables.

---

# 7. Completeness indicator

I do not need a complex publishing workflow.

Plants should normally remain visible even if some information is missing.

However, the admin interface should clearly indicate when a plant is incomplete.

Implement a simple completeness system.

For example:

- Complete
- Missing information
- Possibly show which important sections are incomplete

Do NOT automatically invent or fill missing information.

The completeness indicator is mainly to help us know which plant records still require research.

Use sensible criteria based on important sections.

---

# 8. Delete behavior

Allow plant records and related entries to actually be deleted from the admin panel.

Because deletion is destructive, use a confirmation dialog such as:

"Are you sure you want to delete this plant?"

For deleting a full plant, make the confirmation visually clear.

Ensure related database records are handled correctly through appropriate foreign-key behavior or backend logic.

---

# 9. Admin usability

Keep the admin panel practical.

Useful features include:

- Search plants
- Clear Add Plant button
- Edit
- Delete
- Preview public page
- Add/remove repeatable fields
- Form validation
- Required field indicators
- Detection/prevention of obvious duplicate plants
- Clear save success/error messages
- Unsaved-changes warning where useful
- Responsive design

Autosave is optional. Use it only if implementation remains reliable and simple.

A normal Save button is acceptable.

Do not overbuild this.

---

# 10. Spanish language

The entire public application and admin interface should be in Spanish.

Some existing UI/content currently contains English.

Convert visible interface text to Spanish.

Scientific names remain unchanged.

Guaraní names should remain in Guaraní.

The application does not need full multilingual internationalization at this stage.

Use Spanish as the primary application language.

---

# 11. Public plant pages

Update public plant profiles so they display the database-backed information clearly.

The page should distinguish sections such as:

- Identificación
- Nombre común
- Nombre en guaraní
- Nombre científico
- Familia botánica
- Parte utilizada
- Usos tradicionales
- Formas de preparación
- Fitoquímica
- Compuestos principales
- Actividades biológicas reportadas
- Evidencia científica
- Datos cuantitativos when available
- Referencias
- Imagen and attribution when available

Do not hide records simply because some sections are incomplete.

If information is unavailable, display a neutral message such as:

"Información no disponible actualmente."

Do not invent content.

---

# 12. Scientific evidence presentation

The public UI must make the evidence categories immediately understandable.

Use reusable visual indicators/badges/components for:

- Uso tradicional / evidencia etnobotánica
- Evidencia fitoquímica
- Estudios in vitro
- Estudios en animales
- Estudios en humanos

Avoid generic labels such as "comprobado científicamente".

The distinction between traditional use and experimental/clinical evidence is a core principle of PohãData.

---

# 13. Scientific caution

The application must remain educational and research-oriented.

Do not convert traditional uses into medical claims.

Do not introduce language suggesting that a plant:

- Treats a disease
- Cures a condition
- Is medically recommended
- Has a safe clinical dosage

unless content entered into the database explicitly describes appropriately sourced human evidence, and even then present it as evidence rather than medical advice.

Quantitative phytochemical values must only appear when actual values have been entered into the database.

---

# 14. Backend/API

Create sensible API routes for:

- Listing plants
- Fetching an individual plant
- Creating plants
- Updating plants
- Deleting plants
- Managing related records
- Admin login/session
- Any supporting lookups required by the admin interface

Keep database credentials server-side only.

Never expose `DATABASE_URL` to frontend JavaScript.

Use parameterized SQL queries.

Return useful validation/error messages.

---

# 15. Existing mixture/comparison functionality

Preserve the existing plant comparison and mixture-builder concepts.

Refactor them to consume database-backed information where necessary.

Do not implement medical dosage recommendations.

The future mixture builder should eventually be able to use quantitative compound information stored in the new schema.

For now, focus on having the database structure capable of supporting it.

---

# 16. Final verification

After implementing everything, verify at minimum:

1. The application starts normally.
2. PostgreSQL connection succeeds.
3. Existing static plants have been migrated.
4. Public plant catalog loads from the database.
5. An existing plant can be edited from the admin panel.
6. A new test plant can be created.
7. Related information such as compounds/references/evidence can be added.
8. Changes appear on the public plant page.
9. A plant can be deleted after confirmation.
10. `.env.local` remains excluded from Git.
11. No database password or admin password is included in frontend bundles or committed source files.
12. The interface is in Spanish.
13. Missing information remains visibly missing rather than being fabricated.

At the end, give me a concise summary containing:

- Database tables/schema created
- Files created or modified
- Whether SQL was executed successfully
- Whether existing static plant data was imported
- How to start the app
- How to access the admin panel
- Any environment variables I need to add
- Any remaining manual step I need to perform

Proceed with the implementation rather than only describing what could be done.