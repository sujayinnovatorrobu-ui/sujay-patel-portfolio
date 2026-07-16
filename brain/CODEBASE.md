# CODEBASE.md — AI Handoff Reference

Technical map of this codebase for any AI/developer continuing the work.
Read this **and** `PROJECT_LOG.md` (context, roadmap, facts that must stay
true) before writing code. This file tells you *how* the code works and the
rules future code must follow.

---

## 1. Stack & hard constraints

- **Vite + React 18**, plain JSX, no TypeScript, no router, no state library.
- **RULE: no new runtime dependencies.** Everything (3D galleries, cursor,
  marquees, reveals) is hand-rolled CSS 3D + `requestAnimationFrame`. The only
  runtime deps are React, `@splinetool/react-spline`/`runtime`, and
  `@fontsource-*` packages. Do not add GSAP/three/lenis/etc.
- **RULE: zero external requests at runtime.** All assets live in `public/`.
  New images: optimize with ffmpeg to JPEG ≤ ~300 KB, store in `public/`.
  Never hotlink, never embed third-party iframes/players (YouTube = local
  thumbnail image + outbound `<a>`).
- **RULE: the owner's Windows reports `prefers-reduced-motion: reduce`.**
  Respect the query for entrance/decoration animations, but never gate a
  feature he must *see* behind it (the tape marquees are deliberately exempt).
- Commands: `npm run dev` (port 5173), `npm run build`, `npm run preview`.
  Assistant preview server uses port 5199 via `.claude/launch.json`.

---

## 2. File inventory & responsibilities

```
index.html          Base reset, pre-paint theme script (reads localStorage,
                    sets <html data-theme>), body bg fallback per theme.
                    NO overflow:hidden here (page must scroll).

src/main.jsx        Imports fonts (@fontsource) + index.css, mounts <App/>.

src/App.jsx         Owns ALL top-level state:
                      view: 'home' | 'work' | 'caps'   (conditional render,
                            no router; overlay pages early-return)
                      theme: 'dark' | 'light'          (localStorage 'theme',
                            sets document.documentElement.dataset.theme,
                            calls splineApp.setBackgroundColor(SCENE_BG[theme]))
                      sceneReady: boolean               (Spline onLoad)
                      splineApp: useRef                 (Spline Application)
                    Renders home page: Cursor + Sheet01 hero + Profile +
                    Tape + RingGallery(embedded). Nav links call
                    openWork/openCaps (e.preventDefault() + setView).

src/WorkGallery.jsx SPIRAL overlay gallery ("Ventures").
                    EXPORTS: default WorkGallery({ onBack }), ITEMS (shared).
                    ITEMS schema: { src: '/work/N.jpg', title, meta }[]
                    — single source for BOTH galleries' cards/captions.

src/RingGallery.jsx RING gallery ("Capabilities").
                    default RingGallery({ onBack, embedded = false })
                    overlay mode: fullscreen fixed, hijacks wheel, Esc/Back.
                    embedded mode: 100vh section in page flow; rotation =
                    scrollRot (page scrollY * 0.006) + drag; wheel hijacked
                    ONLY when section seated AND cursor inside ring zone.

src/Profile.jsx     Sheet 02. Static content + IntersectionObserver
                    (threshold .25) toggling `.in-view` for CSS reveal.
                    Copy rules: he is TEAM member of P&I Lab, not founder.

src/Tape.jsx        Two marquee ribbons (LINE array of record strings,
                    doubled in DOM for seamless translateX(-50%) loop).
                    Directions: .tape-a (black) L→R via animation-direction:
                    reverse; .tape-b (orange) R→L normal.

src/Cursor.jsx      CAD crosshair cursor. Mounts in ALL views (home + both
                    overlays). Fine-pointer only (matchMedia guard, returns
                    early on touch). Adds 'has-cursor' class to <html>
                    (hides native cursor). rAF loop lerps position/scale and
                    writes transforms directly to refs (no re-render).
                    Label: coordinates `X 0000 · Y 0000`, or bracket command
                    on hover — 'OPEN' for a/button, else closest
                    [data-cursor] element's value.

src/index.css       ALL styling. One file, ordered sections (see §4).
```

---

## 3. The two gallery engines (the math)

Both engines share a pattern: state in a `useRef` object, one rAF loop, lerp
current→target, write `style.transform` directly to card refs, `setFocus`
(React state) only when the focused index changes (drives the caption chip).

### Spiral (WorkGallery) — cards on a descending helix

```js
d = i - p                       // p = scroll progress in card units
angle  = d * 0.55               // rad
x = sin(angle) * R              // R = min(innerWidth*0.36, 540)
y = -d * YS                     // YS = min(innerHeight*0.24, 200)
z = (cos(angle) - 1) * R
scale   = 1 + max(0, 1-|d|) * 0.08
opacity = 1 - clamp((|d| - 2.6) / 1.4, 0, 1)
zIndex  = 200 - |d|*10 ; filter brightness(1 - min(|d|*0.13, .5))
```
Input: wheel (`target += deltaY*0.0032`, clamped to [-0.4, N-0.6]), vertical
drag, ArrowUp/Down snap, Esc → onBack. Entrance: p starts at -2.6.

### Ring (RingGallery) — cards on a circle, all faces point at center

```js
phi   = ((i - rot) / COUNT) * TAU          // rot = scrollRot + drag
depth = (cos(phi) + 1) / 2                 // 1 front, 0 back
x = sin(phi) * RX                          // RX = min(innerWidth*0.42, 660)
z = (cos(phi) - 1) * RZ                    // RZ = RX * 0.92
y = -LIFT + depth * LIFT * 3               // LIFT = min(innerHeight*0.09, 90)
rotateY(phi)      // CRITICAL: full angle — sides edge-on, far side flipped
                  // (mirrored backface is intentional, owner approved)
scale = 0.42 + depth * 0.58
zIndex = 100 + depth*100 ; brightness(0.35 + depth*0.65)
```
Infinite wrap (no clamp); focus = `((round(rot) % N) + N) % N`.
Embedded wheel-hijack zone: section rect top ≤ 90 && bottom ≥ vh-90 (seated),
pointer within x 8%..92%, y 16%..86% of the section → preventDefault + spin.
Outside that = normal page scroll (escape lanes — DO NOT remove them).

---

## 4. index.css — section order & class inventory

Sections in file order (keep new rules in the right section):

1. `:root` tokens + `[data-theme='light']` overrides
2. base/reset, `.sheet` (hero, 100vh)
3. `.scene`, scene shift media queries (robot position per viewport width:
   ≥1100px `right:-55%`, ≥1600px `right:-46%`), `.scrim`
4. `.frame` (tick-marked sheet border — reused by every section)
5. `.content`, `.topbar`, `.mark`, `.nav`, `.theme-btn`
6. hero: `.hero .eyebrow .name .name .last (wireframe) .lede .actions .btn*`
7. `.callouts .callout .c1-3 .co-label .co-line` (≥1360px only)
8. `.titleblock .tb-* .led .sheetmeta`
9. profile: `.profile .p-inner .p-photo .p-figcap .p-heading .p-outline
   .p-para .p-quote .p-specs .p-spec` + `.in-view` reveal
10. galleries: `.gallery .gallery-embedded .g-stage .g-card .g-top .g-back
    .g-mark .g-hint .g-caption .g-index .g-title .g-meta`,
    ring: `.r-stage .r-card .r-center`
11. `.cursor .cur-v .cur-h .cur-ring .cur-label` + `.has-cursor`
12. tapes: `.tape-wrap .tape .tape-a .tape-b .tape-track .tape-item`
13. `.ghost` (sheet numbers), `.scene-status`
14. `.rise .d1-.d5` entrance, keyframes, reduced-motion block
15. responsive blocks (≤900px, ≤700px, ≤560px)

### Theming contract (MUST follow for any new UI)

- Never hardcode a color. Use tokens: `--bg --bg-rgb --ink --steel --faint
  --line --accent --card --tick --frame-line`.
- Translucent surfaces: `rgba(var(--bg-rgb), 0.7…0.9)` + backdrop-filter.
- Adding a token = add it to BOTH `:root` and `[data-theme='light']`.
- Exception: tape backgrounds (#101010 / accent) are intentionally fixed.

---

## 5. Cross-component APIs

- **`data-cursor="LABEL"`** on any element → cursor shows `[ LABEL ]` while
  hovering inside it. Existing zones: `.scene`→TRACK, `.r-stage`→SPIN,
  spiral `.g-stage`→SCROLL. Links/buttons auto-show `[ OPEN ]`.
- **`ITEMS`** (WorkGallery export): edit once, both galleries update.
- **`.frame`** div: drop `<div className="frame" aria-hidden="true" />` into
  any new full-screen section for the drawing-sheet border.
- **`.ghost`**: `<span className="ghost" aria-hidden="true">04</span>` +
  position rule per section. Content sits above via `z-index: 1` wrapper
  (see `.p-inner`).
- **Sheet numbering**: hero stamp says `Sheet 01 / 03` and section eyebrows
  say `Sheet 0x — Name`. ADDING A SECTION = update the total everywhere
  (hero `.sheetmeta`, section eyebrows, embedded ring `.g-mark`).
- **Pointer-events pattern (hero)**: `.content` is `pointer-events: none` so
  the robot receives mouse; interactive children re-enable with
  `pointer-events: auto` (links/buttons only).

---

## 6. Recipes for likely future tasks

**Add a new sheet section to the home page**
1. New component in `src/`, root = `<section className="yourname">` with
   `.frame` + optional `.ghost`; min-height 100vh; content wrapper with
   `position:relative; z-index:1`.
2. Insert in App.jsx home return in order; bump all sheet numbers (§5).
3. Reveal-on-scroll: copy the IntersectionObserver pattern from Profile.jsx.
4. Styles into index.css in a new section block; both theme palettes.

**Add cards to the galleries** — append `{ src:'/work/9.jpg', title, meta }`
to ITEMS; optimize the image first (`ffmpeg -i in.png -vf scale=1400:-2
-q:v 3 public/work/9.jpg`). Both galleries adapt automatically (COUNT is
derived).

**Scroll-drawn SVG timeline (Phase 2 in PROJECT_LOG)** — planned approach:
inline SVG path (the trunk), `getTotalLength()` + `stroke-dasharray/offset`
driven by scroll progress over the section; milestone nodes = absolutely
positioned cards revealed by IntersectionObserver; branches = extra paths
with staggered dash animation. No libraries.

**New wheel-only capability cards** — give RingGallery its own optional
`items` prop defaulting to ITEMS; pass a capabilities array from App for the
embedded instance when photos exist.

---

## 7. Known quirks (don't "fix" these blindly)

- Ring back cards show mirrored image backfaces — **intentional** (reference
  look, owner approved).
- Tapes ignore reduced-motion — **intentional** (owner requirement).
- `me.jpg` re-crops keep the same filename → browser cache needs Ctrl+F5.
- "Built with Spline" badge: free-plan watermark, do not hide via CSS (ToS).
- Spline scene bg color is set at runtime per theme (`SCENE_BG` in App.jsx);
  if you change theme bg tokens, update `SCENE_BG` to match `--bg`.
- Adani prize: cheque photo reads ₹25,000 (owner once said 24k) — captions
  use 25,000 until owner corrects.
- Preview screenshots at emulated viewports are unreliable — verify layout
  with `getBoundingClientRect()` measurements instead.
