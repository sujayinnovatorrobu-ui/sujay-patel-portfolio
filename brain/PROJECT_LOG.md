# Sujay Patel — Portfolio: Project Log & Future Plan

The single source of truth for this project: what exists, how it's built, every
decision made in our sessions, and the roadmap ahead.

- **Owner:** Sujay Patel — Diploma, Robotics & Automation, Government Polytechnic Ahmedabad
- **Positioning:** Engineer by training, entrepreneur by intent (never "founder of the lab" — see §7)
- **Contact:** innovation@gpahmedabad.ac.in
- **Run:** `npm run dev` → http://localhost:5173 · **Build:** `npm run build` → `dist/`
- **Last updated:** 5 July 2026

---

## 1. Core principle — zero external dependencies

Nothing loads from any CDN or third-party server at runtime. Verified: **zero
external network requests.**

| Asset | Normally from | Self-hosted at |
|---|---|---|
| 3D robot scene | prod.spline.design | `public/spline/scene.splinecode` |
| Runtime wasm (6 files) | unpkg.com, gstatic.com | `public/spline/wasm/` |
| Fonts (3 families) | Google Fonts | npm `@fontsource-*`, bundled |
| Milestone photos ×8 | — | `public/work/*.jpg` (15 MB PNG → 1.8 MB JPG) |
| Profile photo | — | `public/me.jpg` (4:5 center crop) |

The `@splinetool/react-spline` npm package renders the scene but is bundled —
Spline's servers can be down forever and the site still works. The "Built with
Spline" badge is baked into free-plan scenes (paid plan removes it).

---

## 2. The full sketch — what the site is right now

**Stack:** Vite + React 18. **No animation/3D libraries** — galleries, cursor,
marquees are all hand-rolled CSS 3D + small rAF engines.

```
HOME (scrollable page)                            OVERLAY PAGES (via nav)
┌─────────────────────────────────────┐
│ SHEET 01 — HERO             (100vh) │           "Ventures" / "See what
│  topbar: SP.PORTFOLIO · nav ·       │  ───────▶  I'm building"
│         ◐ theme toggle              │           ┌──────────────────────┐
│  SUJAY PATEL (one line,             │           │ SPIRAL GALLERY       │
│   PATEL = wireframe outline)        │           │ 8 cards on a 3D helix│
│  lede · CTAs · callouts 01/02/03 →  │           │ wheel-scroll descends│
│  3D robot right (tracks cursor)     │           │ corkscrew, captions, │
│  CAD title block + sheet meta       │           │ Esc/Back returns     │
├─────────────────────────────────────┤           └──────────────────────┘
│ SHEET 02 — THE BUILDER      (100vh) │           "Capabilities"
│  ghost "02" watermark               │  ───────▶ ┌──────────────────────┐
│  photo left (offset orange frame,   │           │ RING GALLERY         │
│   FIG. 01 caption)                  │           │ same cards on a      │
│  right: MACHINES FIRST,             │           │ concave circle, all  │
│   VENTURES NEXT. + 3 paras          │           │ faces point at ring  │
│  Sanskrit pull-quote from lab wall  │           │ center, back cards   │
│  specs: Team · Base · Focus         │           │ fully flipped,       │
├─────────────────────────────────────┤           │ infinite wrap spin   │
│ TAPE SEAM — two clean ribbons       │           └──────────────────────┘
│  black L→R, orange R→L, crossing,   │
│  scrolling the trophy list          │           GLOBAL
├─────────────────────────────────────┤           · CAD crosshair cursor
│ SHEET 03 — BUILD WHEEL      (100vh) │             X/Y readout, [ OPEN ]
│  ghost "03" watermark               │             [ TRACK ] [ SPIN ]
│  ring gallery embedded:             │             [ SCROLL ] on hover
│   · spins with page scroll          │           · dark / light theme
│   · spins on wheel when cursor      │             (light = white drawing
│     inside the circle (edges =      │             paper; robot backdrop
│     escape lanes, never traps)      │             follows via Spline
│   · drag to spin                    │             setBackgroundColor)
│  center msg pinned top              │           · localStorage persist,
└─────────────────────────────────────┘             no flash on load
```

### Design system — "the engineer's drawing sheet"

- Dark `#161616` (matches scene) / light `#eceae5` (white drawing paper); all
  colors are CSS variables, theme via `[data-theme]` on `<html>`
- Safety orange accent: `#ff5a1f` dark · `#e04a10` light
- Type: **Big Shoulders Display** (condensed industrial display), **Archivo**
  (body), **IBM Plex Mono** (labels, coordinates, captions)
- Drawing furniture everywhere: tick-marked border frame, CAD title block,
  `SHEET 0x / 03 · SCALE 1:1 · REV A` stamps, FIG. captions, callout leader
  lines, ghost sheet numbers
- Wireframe-outline text = "in fabrication" (PATEL, "ventures next", ghosts)
- `prefers-reduced-motion` respected everywhere **except** the tapes (owner
  wants them always moving; his Windows reports reduced motion)

### File map

```
portfolio/
├── PROJECT_LOG.md              ← this file
├── index.html                  early theme script (no flash), base reset
├── .claude/launch.json         preview server (port 5199; owner runs 5173)
├── public/
│   ├── spline/                 scene.splinecode + wasm/ (6 files)
│   ├── work/1..8.jpg           milestone photos (optimized)
│   └── me.jpg                  profile photo, 4:5, centered crop
├── src/
│   ├── main.jsx                font imports + mount
│   ├── index.css               ALL styling; tokens at :root
│   ├── App.jsx                 theme state, view routing, hero (Sheet 01)
│   ├── Profile.jsx             Sheet 02 — photo + builder story
│   ├── Tape.jsx                crossing marquee ribbons
│   ├── RingGallery.jsx         circle gallery (overlay + embedded modes)
│   ├── WorkGallery.jsx         spiral gallery + exported ITEMS array
│   └── Cursor.jsx              CAD crosshair cursor
└── ME/ · Untitled design/      original photos (untouched)
```

### The shared cards (`ITEMS` in WorkGallery.jsx — one edit updates both galleries)

| # | Image | Caption |
|---|---|---|
| 01 | work/2.jpg | Robofest Gujarat 3.0 — First Prize · Maze Solving Robot · ₹10,00,000 |
| 02 | work/3.jpg | Robofest Gujarat 4.0 — Proof of Concept · Level II |
| 03 | work/5.jpg | Drobotics Conclave 2026 — First Place · RC Robo Race · ₹25,000 (cheque says 25k, not 24k) |
| 04 | work/4.jpg | Felicitated on the state stage · Govt of Gujarat ceremony |
| 05 | work/1.jpg | Robofest Gujarat 5.0 — All categories |
| 06 | work/6.jpg | Robofest Gujarat 5.0 — The squad |
| 07 | work/7.jpg | Grand Finale 2026 · Team + robot fleet |
| 08 | work/8.jpg | The fleet · Six robots built in-house |

---

## 3. Session history — everything we did, in order

**Session A — independence from Spline**
1. Downloaded `scene.splinecode` + all 6 runtime wasm files; scaffolded
   Vite + React; verified zero external requests. Explained file:// won't work
   (needs a served page).

**Session B — the hero (Sheet 01)**
2. Designed the drawing-sheet concept; self-hosted fonts.
3. Iterations from owner feedback: content too edge-pinned → centered frame →
   "too much empty space" → edge-to-edge + bigger name + sheet border frame →
   "name on one line + fill the center" → single-line name (solid + outline)
   and capability callouts with leader lines pointing at the robot.

**Session C — galleries**
4. Watched owner's reference video (helix card gallery); built the spiral
   (Ventures) with a hand-rolled scroll engine; optimized the 8 photos.
5. Second reference frame → ring gallery (Capabilities): concave curvature,
   center message moved to top, then full face-the-center geometry (sides
   edge-on, far side flipped/mirrored) after two rounds of owner feedback.

**Session D — page becomes multi-sheet**
6. Copied (not cut) the ring below the hero as an embedded section; page made
   scrollable (killed a leftover inline `overflow:hidden` in index.html);
   embedded ring spins with page scroll + drag.
7. Owner: "I have to click to spin" → wheel-hijack when cursor is inside the
   circle and section is seated; top/bottom edges remain scroll escape lanes.

**Session E — profile, theme, corrections**
8. Sheet 02 built from owner's photo at the lab; "About me" avoided — written
   as a builder's record; Sanskrit line from the wall used as pull-quote.
9. Photo swapped to a better shot, then re-cropped dead-center on request.
10. **Correction from owner: he did NOT found Project & Innovation Lab** —
    all copy changed to "the startup our team runs" / spec "Team — P&I Lab".
11. Dark/light theme: full CSS-variable refactor, paper-white light palette,
    toggle in nav, localStorage + pre-paint script, robot backdrop follows
    theme via Spline's `setBackgroundColor`.

**Session F — designkettle.in inspired features ("play hard")**
12. Analyzed friend's site (site blocks fetching; worked from screenshot):
    marquee ribbons, custom cursor, smooth scroll, ghost type.
13. Built: CAD crosshair cursor (coordinates + context brackets), crossing
    tape marquees with the trophy list, ghost sheet numbers 02/03, scene
    loading readout. Skipped smooth-scrolling (conflicts with wheel hijack).
14. Tape fixes from owner: directions swapped (black L→R, orange R→L);
    hazard stripes removed → clean designer ribbons; tapes exempted from
    reduced-motion (owner's Windows reports it; tapes froze).

---

## 4. FUTURE PLAN — the roadmap

### Phase 1 — remaining sheets (agreed structure, not yet built)

```
current:  01 HERO → 02 BUILDER → tape → 03 WHEEL
target:   01 HERO → 02 BUILDER → tape → 03 WHEEL
          → 04 PROOF STRIP   hard numbers in one slim row:
                             ₹10,00,000 · 1st Adani · 5+ products · 1 lab
          → 05 THE LAB       P&I Lab story: prize money → in-house
                             fabrication (Snapmaker 3-in-1, PCB mill)
          → 06 PRODUCTS      problem → solution cards:
                             hemoglobin analyser (non-invasive, via ear)
                             Vayu Rakshak (air steriliser, COVID 2021)
                             warehouse robot · Rapid Element Tester
          → 07 THE RECORD    the big timeline (see Phase 2)
          → 08 FIELD NOTES   YouTube build logs (local thumbnails linking
             + CONTACT       out — no embedded player) + closing CTA
```

### Phase 2 — the timeline (owner's flagship idea, waiting on his list)

A **tree / git-branch timeline that draws itself as you scroll**: one orange
trunk line (SVG `stroke-dashoffset` scroll technique), branches forking to
milestone cards with photos, prize tags as node labels, the Lab as a branch
that keeps producing product nodes. Styled as a drawing **revision history
table** (REV A → REV B → …). References researched: CodePen travel timeline,
GSAP draw-on-scroll, Codrops blueprints — links in chat history / §6.

**Blocked on owner:** ordered list of events with *date · event · what was
built · result*, plus photos (Robofest 5.0 drive material).

### Phase 3 — content upgrades

- [ ] Real capability list → replace hero callouts + give the build wheel its
      own capability cards (CAD, PCB fab, embedded, vision — one photo each)
      instead of reusing milestone photos
- [ ] Product photos (hemoglobin machine, Vayu Rakshak, warehouse robot)
- [ ] YouTube channel link + locally-stored thumbnails
- [ ] MSU Vadodara startup fest material
- [ ] Confirm Adani prize amount (owner said 24k; cheque photo reads ₹25,000)

### Phase 4 — polish & ship

- [ ] Mobile pass: theme toggle is inside the nav which hides <560px; expose it
- [ ] Preloader counter idea: `SHEET 01 — REV A · LOADING 47%`
- [ ] Optional: smooth inertia scrolling — only with careful integration
      against the wheel hijack + scroll-driven ring (deferred deliberately)
- [ ] SEO/meta: title, description, og:image (use a hero screenshot)
- [ ] Deploy `dist/` to a static host (GitHub Pages / Netlify — needs http://,
      not file://) — then a custom domain

### Ideas parked (nice-to-have)

- Spiral gallery "list view" toggle (reference site had spiral ⇄ list)
- Per-card detail pages ("Work" view in reference video)
- Real photos per capability on the wheel; product spec-sheet popovers
- A "revision history" footer logging site versions (REV A 2026-07…)

---

## 5. Gotchas & environment notes (read before editing)

- **Owner's Windows reports `prefers-reduced-motion: reduce`** — never gate
  a feature he must see behind that query (tapes learned this the hard way).
- The preview tool's screenshots lag/garble at emulated viewport sizes —
  verify with DOM measurements; owner's real browser is ~1920×910.
- Two dev servers may run: owner's on 5173, assistant preview on 5199
  (`.claude/launch.json` pins it).
- `me.jpg` keeps its filename on re-crops — hard refresh (Ctrl+F5) to see it.
- Wheel-hijack zones: `.r-stage`/`.g-stage` own `data-cursor` labels; keep
  edges of embedded sections as scroll escape lanes.
- All gallery captions/order live in one `ITEMS` array (WorkGallery.jsx).

## 6. Key references

- Reference videos: helix gallery + ring gallery (owner's recordings)
- Friend's site: https://designkettle.in (marquee + cursor inspiration)
- Timeline research: CodePen `vincebrown/BNazqL` (travel timeline),
  GreenSock `QWWPOJJ` (draw-on-scroll), Codrops GSAP timeline tutorial +
  Vertical Timeline blueprint, Bryan Braun git-branch diagrams

## 7. Facts that must stay true in copy

- Sujay is **part of the team** at Project & Innovation Lab — not its founder.
- Robofest 3.0: **First Prize ₹10,00,000**, maze solving robot, Science City.
- Robofest 4.0 team: Pragati Sharma, Drashti Parmar, Sumit Patel, Sujay Patel,
  Manasvi Gajjar; mentor Prof. Urvish Soni.
- Adani/Drobotics Conclave 2026: 1st, RC Robo Race (cheque: ₹25,000).
- Started the diploma path **after 10th** — framed as a deliberate choice.
- Products: hemoglobin analyser (ear, non-invasive), Vayu Rakshak (2021),
  warehouse management robot, Rapid Element Tester.
