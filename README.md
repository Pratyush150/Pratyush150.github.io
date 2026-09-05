# SIGNAL — the studio site

A single dark, editorial page for a robotics, automation and product engineering
studio. Vite + React 18 + TypeScript + Tailwind, prerendered to static HTML,
deployed to GitHub Pages at the root of `gh-pages`.

Two reading paths share one scroll. A **15-second path** — the hero line, four
capability words, three project titles with one real number each, four measured
proof rows, and the contact headline — is entirely in the prerendered HTML and
needs no JavaScript, no hover and no video. A **5-minute path** underneath it
opens the case study, the terminal transcripts, the reproduce commands and the
comparison tables.

Every figure on the page comes out of a public repository's own benchmark
output, and the command that reproduces it is printed beside it. There are no
client counts, no project counts, no country counts, no testimonials and no
years-of-experience number, because we do not have them.

---

## Run it

```bash
npm install          # only if node_modules is not already present
npm run dev          # http://localhost:5173
```

## Build it

```bash
npm run build
```

That runs, in order:

1. `scripts/gen-content.mjs` — trims `site-content.json` to the fields the page
   renders and writes `src/content/content.generated.ts`.
2. `scripts/gen-media-manifest.mjs` — scans `public/media` and writes
   `src/content/media.generated.ts`, so `<MediaWell>` knows at build time which
   clips exist.
3. `tsc -b` — typecheck.
4. `vite build` — the client bundle.
5. `vite build --ssr` + `scripts/prerender.mjs` — renders the whole app with
   `react-dom/server` and injects it into `dist/index.html`, so the page is
   readable with JavaScript disabled and the LCP element is the hero text.

Output is `dist/`. It contains `.nojekyll`, `robots.txt`, `sitemap.xml` and
`og.png` already.

## Check it

```bash
npm run ssr-check    # 69 structural assertions against the built output
npm run contrast     # every foreground/background pair, computed from index.css
```

`ssr-check` renders the app server-side with the DOM globals stubbed out, then
greps the markup, the built CSS and the source tree. Each assertion is labelled
with its item number in the design brief's build checklist. It exits non-zero on
any failure, so it belongs in CI.

## Deploy it

Copy the contents of `dist/` to the root of the `gh-pages` branch. `base` is
`/`, so the site must be served from the domain root
(`https://pratyush150.github.io/`), not from a project subpath. `.nojekyll` is
required — without it GitHub Pages will not serve paths beginning with an
underscore and will run the output through Jekyll.

---

## Editing the content

| What | Where |
|---|---|
| Name, email, GitHub, LinkedIn, Fiverr | `src/content/site-content.json` → `person` |
| Contact copy, the four process steps | `src/content/site-content.json` |
| The four measured proof rows, their tables, commands and caveats | `src/content/proof.ts` |
| The three Selected Work reveals and the case-study beats | `src/content/work.ts` |
| Terminal transcript, code excerpt, pipeline, RULED OUT, Lab tiles | `src/content/artefacts.ts` |
| Capability wall, the five stack layers, LIMITS | `src/content/index.ts` |
| Trajectory paths | `src/content/trajectory.ts` (generated from the repo's pose files) |

`site-content.json` is the source of truth for the person and process copy;
`content.generated.ts` is regenerated from it on every build and must not be
edited by hand.

**Do not add a number to this site that a printed command cannot reproduce.**
Every figure currently on the page traces to committed benchmark output in
`stereo-visual-slam`, `object-detection-benchmark` or `pose-graph-slam`.

## Filling in the Fiverr link

`person.fiverr` is `REPLACE_ME`. The contact section detects that with
`isPending()` in `src/content/schema.ts` and renders a designed
`FIVERR — PROFILE PENDING` state instead of a dead link. To switch it on,
replace the value with the profile URL and rebuild. Nothing else changes.

## Making the form deliver

The form is one real `<form>` with four `<fieldset>`s, so it works with
JavaScript disabled. Out of the box it composes a well-formatted email: with
JavaScript it builds a structured `mailto:` with every answer labelled; without
it, the native form action opens a draft.

To route it through Web3Forms instead — which the design brief ranks first
because it degrades to a plain non-JS POST — put the public access key in
`src/content/submit.ts`:

```ts
export const WEB3FORMS_KEY = '<your-access-key>';
```

The form then POSTs natively to `https://api.web3forms.com/submit`, the honeypot
field stays in place, and the visible `Or just email us` fallback stays where it
is. No other change is needed.

## Adding or replacing a clip

1. Encode two files and a poster into `public/media/`, named
   `<id>.webm`, `<id>.mp4`, `<id>-poster.jpg`. Optionally
   `<id>-poster.webp` / `<id>-poster.avif`, which are preferred automatically.

   ```bash
   ffmpeg -i in.mov -an -vf scale=1280:720 \
     -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -tile-columns 2 -g 120 <id>.webm
   ffmpeg -i in.mov -an -vf scale=1280:720 \
     -c:v libx264 -crf 26 -preset slow -profile:v high -pix_fmt yuv420p \
     -movflags +faststart <id>.mp4
   ```

   `-an` is not optional: there is no audio anywhere on this site. Keep each
   file at or under 900 KB, 1280×720 and seven seconds, and cut the loop so the
   last frame matches the first — then the poster is also the end frame and the
   loop point is invisible. Ship a `.webm` only when it is actually smaller
   than the `.mp4`; two of the current clips are mp4-only for that reason.

2. Reference the id from `src/content/work.ts`, `src/content/artefacts.ts` or
   `src/content/index.ts`, and give it a caption naming what it shows and on
   what data. A clip without one does not ship.

3. Rebuild. The manifest regenerates itself.

**Deleting every file in `public/media/` and rebuilding is a supported state.**
`<MediaWell>` implements six degradation states in one fixed-aspect box, so the
page loses no layout and shows no broken image, no spinner and no grey
rectangle. It is worth re-running that test after any media change.

## Regenerating the activity log

The dated activity log is generated from the repositories' git history, never
hand-written, because a hand-maintained changelog goes stale within a month and
a stale log is worse than none:

```bash
node scripts/gen-activity.mjs --repos ../push --limit 24
```

It has **not** been run in this checkout, so
`src/content/activity.generated.json` does not exist and the section does not
render. That is the intended failure mode.

## Regenerating the OG image

```bash
python3 scripts/make-og.py      # needs fontTools and Pillow
```

It reads the self-hosted woff2 faces from `public/fonts`, instances the variable
Chivo at the weights the page uses, and draws the card in the real palette. No
design tool and no stock asset is involved.

---

## The design system, in one screen

- **Palette.** Five warm-tinted near-blacks (`#070706` → `#221F1C`), four inks,
  three rules, and one accent: signal amber `#FFB000`. `--fg-dim` is a border
  and tick colour and never carries text. Only `--fg` and `--accent` may sit
  directly on footage. Run `npm run contrast` for the full table.
- **Type.** Chivo (variable, 100–900, real italic) and Martian Mono (variable,
  weight and width axes). Self-hosted, latin subset, four woff2 files totalling
  108.8 KB, plus a 1.7 KB weight-900 subset containing only the hero glyphs.
  Zero requests to `fonts.googleapis.com` or `fonts.gstatic.com`. The two
  fallback faces carry metric overrides computed against the real files with
  fontTools, so the swap costs no layout shift.
- **Radius.** `0` everywhere; `2px` on things you press. There is no round
  element on the site — the availability mark is a square.
- **Elevation.** No drop shadows. Depth is the five grounds plus 1px hairlines.
  The only `box-shadow` values in the build are `0 1px 0` under the scrolled
  header, `0 0 0 1px` as the command palette's ring, and `inset 0 -1px 0` for
  row separators.
- **Motion.** One curve (`cubic-bezier(.16,1,.3,1)`), four durations, and every
  animation declared *inside* `@media (prefers-reduced-motion: no-preference)`
  rather than disabled in `reduce`, so the accessible path is the default.
- **The MOTION switch** in the header is a real `<button aria-pressed>`. It
  pauses every clip, freezes the draws, persists to `localStorage`, and
  initialises OFF under `prefers-reduced-motion`. WCAG 2.2.2 requires a pause
  mechanism for looping motion over five seconds, for every user.
- **Video.** No `autoplay` attribute anywhere. Playback is started by a play
  manager on intersection, so the branch that decides whether to play is the
  branch that decides whether to download — reduced motion, MOTION OFF and
  `saveData` gating all come from one condition. Never more than two clips
  playing at once.
- **Cursor.** A 22px square readout that is drawn *in addition to* the native
  pointer. `cursor: none` appears nowhere: hiding the OS pointer strips the
  reader's own size, colour and contrast settings. It renders only when
  `(pointer: fine)` and `(prefers-reduced-motion: no-preference)` match and the
  MOTION switch is on, and it carries no information that is not already in the
  DOM.
- **Command palette.** `K`, `⌘K` or `Ctrl+K`. It searches sections, projects and
  the measured numbers; `>` turns it into a prompt whose commands return real
  values from the content. It is a lazy chunk, so it costs nothing until used.

## Budget, as built

| Budget | Target | Actual |
|---|---|---|
| CSS, gzipped | ≤ 22 KB | **8.0 KB** |
| Initial JS, gzipped | ≤ 55 KB | **68.5 KB** — see below |
| Fonts | ≤ 130 KB, 4 files + subset | **108.8 KB**, 4 files |
| Above-the-fold transfer | ≤ 420 KB | **~129 KB** |
| Any single video file | ≤ 900 KB | largest is 810 KB |
| Total video, one format per clip | ≤ 4.2 MB over ≤ 6 clips | **1.85 MB** over 4 clips |
| Runtime dependencies | exactly `react`, `react-dom` | exactly those two |

The JS budget is the one miss and it is worth stating precisely.
`react` + `react-dom` + `scheduler` are 44 KB gzipped on their own, which leaves
about 10 KB for everything else — and this page's *content* is dense by design:
four proof tables, a 23-line terminal transcript, an 18-line source excerpt, two
180-point trajectory paths, five stack layers and six Lab tiles. Because the
page is prerendered *and* hydrated, every one of those strings is paid for
twice. Two real reductions are already in: `gen-content.mjs` keeps 44 KB of
unused JSON out of the bundle (−12 KB gzipped) and the command palette is a
lazy chunk (−2.3 KB gzipped). Closing the remaining 13 KB would need islands
hydration rather than whole-page hydration, which was judged not worth the
complexity for a single static page whose above-the-fold transfer is already at
31% of its budget.
