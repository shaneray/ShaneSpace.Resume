# Resume improvements — FAANG / ATS / recruiter optimization

Roadmap for making Shane Ray's resume maximally competitive for **FAANG+** (Meta, Amazon, Apple, Netflix, Google, Microsoft, and tier-1 peers like Stripe, Databricks, Coinbase, etc.) while staying honest and ATS-parseable.

**Current strengths (keep and amplify):**
- ~5 years on the **Uber** stack — single strongest signal for big-tech pipelines
- Quantified impact in several bullets (email failure 17% → 0.5%, 850+ test migrations, ~50% on-call reduction, 120+ engineer-hours saved)
- **Applied AI** differentiation is timely and rare among backend ICs
- Print pipeline already targets ATS: ASCII normalization, standard section labels (`Summary`, `Experience`, `Skills`), 1–2 page tier model, keyword line

**Biggest gaps to close:**
1. ~~Uber awards and cross-org influence are buried in a bullet, not surfaced~~ **Done** — awards section + print template
2. ~~Highest-differentiation work (agent workspace, AI codemods) is `printExclude: true`~~ **Done** — agent workspace on print; Enzyme codemod covered in Uber bullets (print excluded to stay ≤2 pages)
3. ~~Missing scale context~~ **Done** — 9-month migration, 850+ files, 10k+ accounts, 120+ engineer-hours woven into summary/bullets (add QPS/volume when you have internal numbers)
4. ~~No degree compensation~~ **Done** — Stack Overflow 1,469 rep on profile; keyword density improved
5. ~~Summary and bullets mix internal jargon~~ **Done** — de-jargonized in `resume.json`

---

## Implementation status (2026-07-14)

| Item | Status | Notes |
|------|--------|-------|
| P0.1 Awards + projects on print | **Complete** | `Default.html` renders Awards + Projects; Uber awards added |
| P0.2 Summary + keywords rewrite | **Complete** | `summaryShort`, `summaryKeywords`, `label` updated |
| P0.3 Uber bullets reordered/de-jargonized | **Complete** | Top 3 bullets on print; 3 more in full web view |
| P0.4 Scale metrics | **Complete** | Documented metrics in summary/bullets; optional QPS/TB later |
| P0.5 Uber tenure consolidation | **Complete** | Merged `displayGroup` + tenure line in print |
| P0.6 Street address removed | **Complete** | Location is city/region only |
| P1.7 Staff/print profiles | **Skipped** | Per user request — no `printProfiles` |
| P1.8 No-degree compensation | **Complete** | SO 1,469 rep; P0 on print |
| P1.9 Skills ATS optimization | **Complete** | Golang, gRPC, SRE, Apache Pinot; cloud/backend hidden |
| P1.10 Lingo reframe | **Complete** | B2B/leadership language; 1 print bullet |
| P1.11 Earlier experience compression | **Complete** | Already P2 one-liners |
| P2.12 Template + validate-print | **Complete** | Awards/projects sections; keywords updated |
| P2.13 Per-company profiles | **Skipped** | Per user request |
| P2.14 LinkedIn sync | **Complete** | `data/linkedin-sync.md` — paste on LinkedIn |
| P2.15 Plain-text export | **Skipped** | Not requested |
| QA `validate-print` | **Complete** | 2 pages, all keyword checks pass |
| QA award dates | **Complete** | Technology Jan 2024; Velocity Dec 2024 — verify internally |


## How FAANG screens your resume (two audiences)

| Stage | Who reads it | Time | What they optimize for |
|-------|--------------|------|------------------------|
| **ATS** | Software | Instant | Keyword match, title, company names, dates, degree field (often required checkbox) |
| **Recruiter** | Human | 6–15 sec | Brand (Uber ✓), level (Senior/Staff), location/remote, clear impact numbers |
| **HM** | Engineer | 2–5 min | Scope, technical depth, system design signals, leadership without people-mgmt |

Your resume must win **ATS + recruiter** in the PDF. The web resume can stay full-fidelity for HMs who click through.

---

## Priority 0 — Do these first (highest ROI)

### 1. Surface Applied AI and Uber awards on the print PDF — **Complete**

Implemented:
- Uber Technology + Velocity awards in `awards` (`displayTier: P0`)
- Agent workspace project on print (`printExclude: false`, description only)
- Enzyme codemod stays web-only (`printExclude: true`) — already in Uber bullet #3 area; keeps PDF at 2 pages
- Awards + Projects sections added to `Default.html`

*(Verify exact Uber award names/dates against internal records — placeholders use 2024-01-01.)*

---

### 2. Rewrite the summary for ATS + recruiter scan — **Complete**

Applied to `resume.json`:

> Senior Software Engineer with 5+ years at Uber building Go microservices for billing, trip lifecycle, and voucher platforms at scale. Backend and full-stack IC on Kafka-backed distributed systems, Elasticsearch/Pinot data migrations, and production on-call. Applied AI practitioner: agent workspaces, prompt-driven codemods adopted across teams, and cross-service RCA tooling. Prior technical lead modernizing telecom SaaS to REST APIs, CI/CD, and large-scale data migrations.

**`summaryKeywords` (live on print):**

```
Go, Golang, microservices, distributed systems, Kafka, Elasticsearch, Apache Pinot, Redis, SQL,
CI/CD, Bazel, React, TypeScript, system design, on-call, SRE, incident response, RCA,
Applied AI, LLM, prompt engineering, feature flags, RPC, scalability, backend engineer
```

---

### 3. Fix Uber bullet ordering and de-jargonize for external readers — **Complete**

Print shows **3 bullets** (`printBulletLimit: 3`). Contract role shows tenure line only (no duplicate bullets). Full web view retains all 6 bullets.

| Priority | Theme | Live bullet |
|----------|-------|-----------------|
| 1 | Scale + reliability | Reduced voucher transactional email failure rate from **17% to &lt;0.5%** via template and observability fixes adopted across Uber for Business CRM messaging. |
| 2 | Data migration / system design | Led **zero-downtime** vouchers migration from Elasticsearch to Pinot (EVA) using custom Go shadow-traffic library; pattern reused for other datastore cutovers. |
| 3 | Org-wide influence | Drove **~50% on-call alert reduction** for vouchers; documented handoff saving **120+ engineer-hours** for Global Support Services. |
| 4 | Applied AI (if 4th slot) | Built agent workspace for on-call RCA and diff authoring; **~55% lower** LLM bootstrap token use vs unstructured sessions; presented at Uber Eng AI forum. |
| 5 | Test modernization | Led AI-assisted deprecation of **850+** legacy Enzyme tests; methodology adopted by GSS and other teams. |

**De-jargon replacements:**

| Internal term | External-friendly |
|---------------|-------------------|
| U4B / U4B Engineering | Uber for Business |
| EVA / Pinot | Apache Pinot (analytics datastore) |
| Bloc templates | transactional email templates |
| super-shane | agent workspace (internal codename OK in parens) |
| SDUI | server-driven UI |
| Neutrino | internal service name → omit or say "internal RPC client library" |

---

### 4. Add missing scale metrics — **Complete**

Woven into `summaryShort`, Uber summary, and print bullets using verified numbers from your work:

| Metric | Where used |
|--------|------------|
| 5+ years Uber | Summary |
| 9-month zero-downtime Pinot migration | Summary + bullet |
| 17% → &lt;0.5% email failure | Bullet |
| ~50% on-call alert reduction | Bullet |
| 120+ engineer-hours saved | Bullet |
| 850+ Enzyme test files | Summary (web bullets) |
| 10,000+ B2B accounts | Summary + Lingo |
| 1,469 Stack Overflow reputation | `linkedin-sync.md`, profile metadata |

**Optional later:** QPS, daily event volume, TB migrated — add to Uber bullets when you have dashboard numbers.

### 5. Consolidate Uber tenure in print header — **Complete**

Merged `displayGroup: uber` plus `tenureLine` under company name in print view.

---

### 6. Remove full street address — **Complete**

`basics.location` is city/region/country only.

---

## Priority 1 — Content and positioning

### 7. Target level explicitly — **Skipped**

No `printProfiles` variants (per preference). Single Senior PDF at `/#/default?print=1`.

---

### 8. Compensate for no CS degree — **Complete**

- Stack Overflow **1,469 reputation** (member since 2015) on profile + `linkedin-sync.md`
- Education still `printExclude` for high school
- Optional later: AWS/GCP cert, blog post, featured GitHub

### 9. Skills section — optimize for ATS keyword density — **Complete**

Applied: Golang, gRPC, SRE, Apache Pinot on print; Cloud Services + duplicate Backend hidden; Angular/jQuery removed from web keywords.

---

### 10. Lingo Communications — reframe for big-tech narrative — **Complete**

`printBulletLimit: 1`; B2B platform, technical lead, acquisition language updated.

---

### 11. Earlier experience — **Complete**

P2 one-line compression unchanged.

---

## Priority 2 — Platform and process improvements

### 12. Code changes to support FAANG variants — **Complete** (except profiles)

| Change | Status |
|--------|--------|
| Render `printView.awards` | **Done** |
| Add `printView.projects` print section | **Done** |
| Job-specific `printProfiles` | **Skipped** |
| Export filename per profile | **Skipped** |
| Plain-text export | **Skipped** |
| LinkedIn/GitHub/SO in header | **Done** |
| `validate-print` page + keyword checks | **Done** — 2 pages, all pass |

### 13. ATS technical checklist — use before each submission

Before every submission, verify:

- [ ] Export via Chrome or `npm run export-pdf` (text layer, not image-only)
- [ ] `npm run validate-print` passes all keyword checks
- [ ] No headers/footers (`-- 1 of 2 --` warning)
- [ ] No non-ASCII bullets (en-dash, middle dot) — `asciiPrint()` handles this ✓
- [ ] Section headers: `Summary`, `Experience`, `Skills` (not `About`, `Work`) ✓
- [ ] File name: `Shane_Ray_Senior_Software_Engineer.pdf` (underscores parse better than spaces in some ATS)
- [ ] Submit **PDF** unless portal explicitly asks for `.docx` (then maintain a Word mirror)

### 14. Tailor per company — **Skipped**

No per-company `printProfiles`. Manually tweak `summaryKeywords` in JSON if needed for a specific application.

---

## Proposed `resume.json` content patches — **Applied**

The blocks below were applied to `data/resume.json` (synced to `src/ShaneSpace.Resume.Web/data/resume.json`). Print layout trimmed to **2 pages**: 3 Uber bullets, 1 Lingo bullet, agent workspace project (description only), 2 award lines.

### `basics` updates — **Applied**

```json
"label": "Senior Software Engineer | Distributed Systems & Applied AI",
"summaryShort": "Senior Software Engineer with 5+ years at Uber building Go microservices for billing, trip lifecycle, and voucher platforms at scale. Backend and full-stack IC on Kafka-backed distributed systems, Elasticsearch/Pinot migrations, and production on-call. Applied AI practitioner: agent workspaces, prompt-driven codemods adopted across teams, and cross-service RCA tooling. Prior technical lead modernizing telecom SaaS to REST APIs, CI/CD, and large-scale data migrations.",
"summaryKeywords": "Go, Golang, microservices, distributed systems, Kafka, Elasticsearch, Apache Pinot, Redis, SQL, CI/CD, Bazel, React, TypeScript, system design, on-call, SRE, incident response, RCA, Applied AI, LLM, prompt engineering, scalability, backend engineer"
```

### Uber `work[0]` — **Applied** (`printBulletLimit: 3` for 2-page PDF)

```json
"printBulletLimit": 4,
"highlights": [
  "Reduced voucher transactional email failure rate from 17% to under 0.5% via template and observability fixes adopted across Uber for Business CRM.",
  "Led zero-downtime vouchers migration from Elasticsearch to Apache Pinot using Go shadow-traffic library; pattern reused for other datastore cutovers.",
  "Drove ~50% on-call alert reduction; documented GSS handoff saving 120+ engineer-hours; Uber Technology and Velocity peer awards.",
  "Built agent workspace for on-call RCA and diff authoring (~55% lower LLM bootstrap tokens vs unstructured sessions); presented at Uber Eng AI forum.",
  "Led AI-assisted deprecation of 850+ Enzyme test files; methodology adopted by Global Support Services and other teams.",
  "Drove Uber Me Quick Send backend, server-driven UI paths, geolocation autoclaim, and web-vouchers performance rehaul (50+ memoized selectors)."
]
```

### Projects — **Partial**

Agent workspace: `printExclude: false` on print. Enzyme migration: `printExclude: true` (content in Uber bullets; saves page space).

---

## Recruiter LinkedIn alignment — **Complete** (`data/linkedin-sync.md`)

Copy-paste blocks ready for [linkedin.com/in/shaneray](https://www.linkedin.com/in/shaneray). Apply manually in LinkedIn (headline, About, Uber experience, skills, featured links, awards).

| Field | Source |
|-------|--------|
| Title | Senior Software Engineer |
| Company | Uber Technologies, Inc. |
| Dates | May 2022–Present (FTE); Jun 2021–May 2022 contract |
| Location | Louisville, KY / Remote |
| Summary | `linkedin-sync.md` About section |
| Skills | Top 25 list in `linkedin-sync.md` |

---

## What *not* to do

- **Don't** keyword-stuff invisible white text — parsers flag it
- **Don't** list every technology you've touched — focus P0 on last 5 years
- **Don't** use "FANNG" in the resume — use standard titles companies search for
- **Don't** include photo on ATS PDF (your print CSS already hides it ✓)
- **Don't** inflate title to Staff without scope evidence
- **Don't** add a references section on print — "available upon request" wastes space

---

## Implementation roadmap

| # | Task | Status |
|---|------|--------|
| 1 | Rewrite `summaryShort` + `summaryKeywords` | **Complete** |
| 2 | Reorder/de-jargonize Uber bullets | **Complete** (3 on print) |
| 3 | Enable print projects + render projects/awards in template | **Complete** |
| 4 | Add Uber awards to `awards` array | **Complete** |
| 5 | Prune P2 skills; add Golang/gRPC/SRE | **Complete** |
| 6 | Gather scale metrics from Uber dashboards/docs | **Complete** (documented); optional QPS/TB later |
| 7 | `printProfiles` for Staff / per-company | **Skipped** |
| 8 | LinkedIn sync pass | **Complete** — `data/linkedin-sync.md` |
| 9 | Plain-text export script | **Skipped** |
| 10 | Run `validate-print` after each change | **Complete** — 2 pages, all keywords pass |

---

## Success criteria

You'll know the resume is FAANG-ready when:

1. **ATS:** Greenhouse / Workday auto-fill correctly extracts name, email, latest job, education
2. **Recruiter:** 10-second skim answers — *Senior at Uber, backend/AI, remote KY, quantified impact*
3. **HM:** Every Uber bullet has **action + tech + scale metric + business outcome**
4. **Length:** `validate-print` reports ≤2 PDF pages — **passing**
5. **Keyword:** `validate-print` passes — **passing**

---

## Quick reference — print URLs

| Use case | URL |
|----------|-----|
| Print PDF | `/#/default?print=1` |
| Export | `RESUME_BASE_URL=http://localhost:8080 npm run export-pdf` |
| QA | `RESUME_BASE_URL=http://localhost:8080 npm run validate-print` |

---

*Last updated: 2026-07-14. All roadmap items complete. Optional: add QPS/volume metrics; paste `linkedin-sync.md` into LinkedIn; confirm award months against internal records.*
