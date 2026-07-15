# Shane Ray's resume

Inspired by https://github.com/enkafan/resume which was Generated via resume.json using the techniques documented by Steven Edouard at https://github.com/sedouard/resume/

## Display tier model

`resume.json` is the single source of truth — all jobs, bullets, skills, and profiles are kept in full. Display tiers control what appears in print vs. web views.

| Tier | Print PDF | Web (`/#/default`) | Interactive |
|------|-----------|---------------------|-------------|
| **P0 — Primary** | Full | Full | Full |
| **P1 — Secondary** | Condensed (dates + top N bullets) | Full | Full |
| **P2 — Tertiary** | One structured line per role | Full | Full |
| **Hidden** | Never | Never | N/A |

### Optional JSON fields

```json
{
  "basics": { "summaryShort": "Curated 3-sentence summary for print" },
  "work": [{
    "displayTier": "P0",
    "displayGroup": "uber",
    "printBulletLimit": 5,
    "location": "Remote · Louisville, KY"
  }],
  "skills": [{ "displayTier": "P0" }],
  "references": [{ "displayTier": "P0" }],
  "profiles": [{ "displayTier": "P0" }]
}
```

Tiers can be set explicitly in JSON or inferred at runtime by `displayService.js`.

### Print view

- Navigate to `/#/default?print=1` to open print preview with tier filters applied.
- Print CSS omits screen-only sections, uses ATS-friendly section labels (Summary, Experience), and limits bullets per tier via `buildPrintView()`.
- Target output: 1–2 page enterprise PDF while web shows full fidelity.

### Export recipe (canonical)

Use **Google Chrome** for consistent PDF text-layer quality:

1. Open `/#/default?print=1` (or serve locally and navigate there).
2. Print dialog → **Destination:** Save as PDF.
3. **Paper size:** Letter.
4. **Margins:** Default.
5. **Background graphics:** Off.
6. **Headers and footers:** Off.

Optional headless export (requires a local server on port 8080):

```bash
npm install
RESUME_BASE_URL=http://localhost:8080 npm run export-pdf
```

Output: `Shane-Ray-Resume.pdf` in the repo root.

### Files

| File | Purpose |
|------|---------|
| `data/resume.json` | Complete career dataset |
| `data/linkedin-sync.md` | Copy-paste blocks to align LinkedIn with resume |
| `js/services/displayService.js` | Tier inference, enrichment, and `buildPrintView()` |
| `views/Default/Default.html` | Print/screen template |
| `views/Default/print-resume.css` | Print-only CSS (`media="print"`) |
| `views/Default/Theme.css` | Screen theme |
| `scripts/export-pdf.js` | Optional Puppeteer PDF export |

See `improvements.md` for the full analysis and roadmap. Use `data/linkedin-sync.md` to align LinkedIn with the print PDF.
