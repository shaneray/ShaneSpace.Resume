# Print PDF improvements roadmap

Goal: bring the print PDF (`/#/default?print=1` → Save as PDF) to **10/10 for recruiters** and **10/10 for ATS parsers**, without adding a `.docx` export path.

**Current baseline (Jul 2026):** ~8/10 recruiters · ~5–6/10 ATS.

**Source of truth:** `data/resume.json` + `displayService.js` tier model + `Default.html` / `Theme.css` print rules.

---

## Definition of done

### Recruiter 10/10

A hiring manager or recruiter can scan the PDF in **under 30 seconds**, understand seniority + target role + top companies, and trust the depth without leaving the document. Fits **1–2 pages** on Letter with default browser print settings.

### ATS 10/10 (PDF-only)

A typical enterprise ATS (Workday, Greenhouse, Lever, iCIMS, Taleo) can extract **name, email, phone, location, summary, each job (title · company · dates), education, and skills keywords** with high fidelity from the saved PDF text layer. No critical content exists only as a link or CSS-hidden DOM node.

---

## Priority legend

| Priority | Meaning |
|----------|---------|
| **P0** | High impact; do first |
| **P1** | Important polish |
| **P2** | Nice-to-have / validation |

---

## P0 — Shared (recruiter + ATS)

These fixes help both audiences.

### Content & structure

- [ ] **Remove print promo clutter** — Delete the `resume-notice` line (“Full interactive resume: …”) from the About section in print. Move the URL to a single subtle footer line if you still want it discoverable.
- [ ] **Use ATS-standard section labels in print** — Rename sidebar headings for print only: `Work` → `Experience`, `About` → `Summary` (or `Professional Summary`). Keep web labels unchanged.
- [ ] **Always repeat company name on grouped roles** — Remove `print-grouped-hide` for company `<h4>` in print (or show a compact “Uber Technologies, Inc. — continued” line). ATS and recruiters both need unambiguous employer per role.
- [ ] **Structured P2 “Earlier Experience”** — Replace the single inline run-on sentence with minimal structured entries, one per role:

  ```
  Title · Company · Start – End
  ```

  Keep each entry one line; no bullets. Preserves parseability without adding page bulk.

- [ ] **Stop using CSS to hide print bullets** — Replace `print-hidden-bullet` (`display: none`) with `ng-if` / `limitTo` so truncated bullets are **omitted from the DOM**, not merely hidden. Ensures the PDF text layer matches what humans see and avoids parser confusion.
- [ ] **Eliminate “see website for more” gaps** — Remove or rewrite `more-highlights` (“Additional accomplishments available at …”). Either include the top N bullets only (current tier limits) or add a single inline clause with the highest-value omitted keyword (e.g. “Also: on-call reduction, peer awards”). Critical keywords must live in the PDF text.

### Contact & links (PDF text layer)

- [ ] **Print full URLs for profiles** — Header contact row should show `linkedin.com/in/shaneray` and `github.com/shaneray` (full URL or canonical path), not just “LinkedIn” / “Github” anchor text.
- [ ] **Print website as plain text** — Include `resume.basics.website` in the print header contact row.
- [ ] **Ensure mailto/tel survive as readable text** — Email and phone must appear as literal characters in the PDF (already mostly true; verify after changes).

### Layout & typography

- [ ] **Lock single-column reading order** — Audit print CSS so DOM order matches visual order: Header → Summary → Skills → Experience → Projects → Education → Awards → References. No floated sidebars that reorder content in the text layer.
- [ ] **Consistent date format** — Standardize on `MM/YYYY – MM/YYYY` (or `MM/YYYY – Present`) everywhere in print. Fix P2 block which currently uses `yyyy` only.
- [ ] **Enforce 1–2 page budget** — Add a print QA step (see Validation). Tune `printBulletLimit` per role in `resume.json` until Chrome “Save as PDF” reliably lands at ≤ 2 pages.

### PDF generation reliability

- [ ] **Document the canonical export recipe** — Add to README: browser (Chrome), paper size Letter, margins Default, **Background graphics off**, headers/footers off. One command path if you add headless export later.
- [ ] **Optional: headless PDF script** — Add a small script (e.g. Puppeteer/Playwright) that loads `?print=1`, waits for Angular render, and writes `Shane-Ray-Resume.pdf`. Removes human variance in margins/scale across machines. *(Still PDF-only.)*
- [ ] **Embed PDF document metadata** — Title: `Shane Ray – Senior Software Engineer Resume`; Author: `Shane Ray`; Subject: role keywords. Set via print CSS `@page` where supported or in the headless export step.

---

## P0 — Recruiter-specific

### Scan path & hierarchy

- [ ] **Lead with target role in header** — Keep `label` prominent (`Senior Software Engineer · Applied AI`). Consider adding a one-line subtitle under name only if `label` ever moves.
- [ ] **Tighten summaryShort to 3 sentences max** — First sentence: level + company + domain. Second: technical scope. Third: differentiator (Applied AI). Review quarterly against target job descriptions.
- [ ] **Merge adjacent Uber roles in print (optional)** — If page budget is tight, render Uber contract + FTE as one block with two date ranges under one company header. Recruiters see one employer streak; reduces repetition.
- [ ] **Hide job summaries for P1 in print** — Show position · company · dates + bullets only. Saves ~2–4 lines per P1 role; summaries remain on web.
- [ ] **Demote or drop “Highlights” subheading in print** — Bullets under each role need no extra `<h4>Highlights</h4>`; it wastes vertical space and adds noise.
- [ ] **Skills: lead with a keyword line** — Add optional `basics.summaryKeywords` or derive top 12–15 skills into one comma-separated line under the summary for instant keyword scan (recruiters ctrl-F; ATS loves it).
- [ ] **Education: one line for non-degree paths** — For high-school/general-studies entries, print as `General Studies · Institution · Years` without course lists (courses already screen-only). Consider hiding P1 education entirely if page count exceeds 2.

### Visual polish

- [ ] **Stronger role header line** — Single line: **Senior Software Engineer** · Uber Technologies, Inc. · May 2022 – Present. Reduces vertical stack of `<h3>` + `<h4>` + date span.
- [ ] **Page-break rules** — Keep `page-break-inside: avoid` on work entries; add `page-break-after: avoid` on section headings so “Experience” never orphans at page bottom.
- [ ] **Footer: name + page only** — Replace or simplify footer to `Shane Ray · Page N` (if using headless PDF with page numbers). Drop redundant label if header already states it.

---

## P0 — ATS-specific (PDF-only)

### Parse-friendly HTML → PDF pipeline

- [ ] **Semantic job blocks** — Each role should expose a predictable text pattern in DOM order:

  ```
  [Job Title]
  [Company Name]
  [Start Date] – [End Date]
  • bullet
  • bullet
  ```

  Avoid nesting title/company inside styled containers that PDF generators flatten oddly.

- [ ] **No `display: none` content in print DOM** — Audit all print paths: P2 work entries, hidden bullets, hidden education, screen-only sections. Anything not meant for PDF should be `screen-only` / `ng-if="!printMode"`, not CSS-hidden.
- [ ] **Skills as explicit keyword lists** — Prefer `Go, Python, Elasticsearch, …` comma-separated per category over middot separators if ATS tests show middots merge words. Validate with a parser (see Validation).
- [ ] **Include location on roles where relevant** — Add optional `work.location` (e.g. “Remote · Louisville, KY”) for current role; many ATS map location fields.
- [ ] **Award summaries in print** — `award.summary` is screen-only today. Include a short clause in print for keyword coverage (e.g. “cloud automation, network provisioning”).
- [ ] **Avoid icon fonts in print** — Confirm Semantic UI / icon fonts do not appear in PDF (profiles section already hidden; verify no stray icons elsewhere).
- [ ] **Use ASCII-safe punctuation where possible** — Replace em-dash `—` with ` – ` (en dash + spaces) or ` | ` if parser tests show mojibake. Test after save.

### Keyword coverage without bloat

- [ ] **Curate `printBulletLimit` bullets in JSON** — Ensure the *kept* bullets per role contain the highest-value keywords from the full set (technologies, metrics, scope). Re-order `highlights[]` so print limits always take the top N by importance, not insertion order.
- [ ] **P2 skills keyword spillover** — Fold critical P2-only tech (e.g. RabbitMQ, MassTransit) into P0/P1 skill lines or summaryShort if they match target JDs.
- [ ] **Projects: one line each in print** — Already compact; ensure `description` includes stack nouns (Go, React, etc.) for parser keyword density.

---

## P1 — Content curation (`resume.json`)

- [ ] **Audit every bullet for metric or outcome** — Pattern: action + scope + result. Fix weak P1 bullets (“Improved unit/integration tests performance”) before print limits hide the strong ones.
- [ ] **Align title with target JDs** — `basics.label` should mirror LinkedIn headline and typical posting (“Senior Software Engineer · Applied AI” vs “Staff” when applying staff roles).
- [ ] **Per-application `printProfile`** — Optional JSON override block (or separate `resume-print.json`) to swap summaryShort, reorder bullets, or bump `printBulletLimit` for a specific company. Single source still merges from master `resume.json`.
- [ ] **References** — Keep “Available upon request” only (current P0 filter). Do not print full quotes unless requested; saves space.

---

## P1 — Engineering

- [ ] **`printMode` flag in controller** — Set `$scope.printMode = true` when `?print=1`; use in template for `ng-if` instead of CSS-only show/hide. Cleaner DOM for PDF.
- [ ] **`displayService` print view model** — Add `display.buildPrintView(resume)` that returns pre-filtered work/skills/projects with truncated highlights already applied. Template stays dumb; logic centralized.
- [ ] **Remove dead print markup** — Delete unused print-only info message inside `#resume` (section is screen-only anyway).
- [ ] **Print-specific CSS file split** — Move all `@media print` rules from `Theme.css` into `print-resume.css` loaded with `media="print"` to reduce accidental screen bleed and simplify review.

---

## P2 — Validation checklist

Run after each batch of changes.

### Recruiter QA

- [ ] PDF is **≤ 2 pages** (Chrome, Letter, default margins, background graphics off).
- [ ] First page shows: name, contact, summary, skills, and **current role** without scrolling.
- [ ] Every role answerable in 5 seconds: where, when, what level, what impact.
- [ ] No “go to website for details” for core career facts.
- [ ] Print preview matches saved PDF ( WYSIWYG ).

### ATS QA (PDF-only tools)

- [ ] Run saved PDF through at least two parsers, e.g. [Jobscan PDF](https://www.jobscan.co/), [Resume Worded](https://resumeworded.com/), or open PDF in Adobe → Export to text and inspect structure.
- [ ] Verify extracted fields:

  | Field | Pass? |
  |-------|-------|
  | Full name | |
  | Email | |
  | Phone | |
  | City, State | |
  | Summary paragraph | |
  | Each job title | |
  | Each company (including grouped roles) | |
  | Each date range | |
  | Skills keywords (spot-check 10 target terms) | |
  | Education institution | |

- [ ] Copy-all text from PDF (Ctrl+A in viewer) → paste into Notepad. Reading order should be logical with no duplicated blocks or `[object Object]` artifacts.
- [ ] Search PDF text for 5 target keywords from a sample JD (e.g. “Go”, “microservices”, “on-call”, “Elasticsearch”, “CI/CD”). All should hit.

### Regression

- [ ] Web view `/#/default` unchanged (screen-only paths still show full fidelity).
- [ ] Interactive resume unaffected.
- [ ] `displayService.enrich()` still infers tiers when JSON omits them.

---

## Suggested implementation order

1. **DOM cleanup** — `printMode`, remove CSS-hidden bullets, remove promo lines, repeat company names.
2. **Contact URLs** — Full profile/website paths in print header.
3. **Structure** — P2 structured lines, section renames, date format, drop Highlights heading.
4. **Page budget** — Tune bullet limits + P1 summary hiding until ≤ 2 pages.
5. **Content pass** — Re-order highlights, tighten summaryShort, skills keyword line.
6. **Automation** — Headless PDF script + metadata.
7. **Validation** — ATS parser + recruiter scan QA; iterate.

---

## Files likely touched

| File | Changes |
|------|---------|
| `data/resume.json` | Bullet order, limits, summaryShort, optional location |
| `js/services/displayService.js` | `buildPrintView()`, print filters |
| `js/controllers/defaultController.js` | `printMode` flag |
| `views/Default/Default.html` | Print template structure, `ng-if` filters |
| `views/Default/Theme.css` | Typography, page breaks, remove hide-based hacks |
| `README.md` | Export recipe, tier docs (link here) |
| `scripts/export-pdf.js` *(new, optional)* | Headless PDF generation |

---

## Out of scope (by design)

- `.docx` / Word export
- Interactive or web-only sections in print (profiles grid, languages, interests, publications, volunteer)
- Profile photo in print (correct for US ATS norms)
- Custom fonts that may not embed cleanly in PDF — stick to system/Arial/Helvetica stack for maximum text-layer fidelity
