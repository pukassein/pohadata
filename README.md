# PohãData

PohãData is a static-first prototype for exploring medicinal plants traditionally used in Paraguay and the different kinds of evidence documented about them.

## Run locally

This prototype has no database, authentication, API, or build dependency. With Python 3 available:

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Included in this prototype

- Overview dashboard with the PohãData purpose and evidence framework
- 10 local mock plant profiles
- Search, filtering, and sorting in the plant catalog
- Detailed plant profiles with identification, traditional use, phytochemistry, evidence layers, and reference placeholders
- Category/property exploration
- 2–4 plant comparison table
- Mixture builder with clearly labelled demonstration amounts
- About / methodology page with scientific transparency language

The interface uses hash-based navigation, so it can be served as a static site without a special server fallback. Plant data is kept in `src/data.js` so a future database or API adapter can replace it without changing the page structure.
