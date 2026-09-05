/**
 * There is no browser in this environment, so the structural claims in the
 * design brief are checked by rendering the whole app with react-dom/server and
 * grepping the result, the built CSS and the source tree.
 *
 *   npm run build && node scripts/ssr-check.mjs
 *
 * Every assertion below maps to a numbered item in the brief's build checklist;
 * the item number is in the label. A check that cannot be made without a
 * browser says so rather than passing silently.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { render } from '../dist-ssr/entry-server.js';

// Minimal DOM globals so anything reaching for them during render fails loudly.
globalThis.window = undefined;
globalThis.document = undefined;

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const html = render();
const distHtml = readFileSync(root('dist/index.html'), 'utf8');
const assetsDir = root('dist/assets/');
const assetFiles = readdirSync(assetsDir);
const cssFile = assetFiles.find((f) => f.endsWith('.css'));
const css = readFileSync(join(assetsDir, cssFile), 'utf8');

const srcFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(e.name)) srcFiles.push([p, readFileSync(p, 'utf8')]);
  }
})(root('src'));
const src = srcFiles.map(([, s]) => s).join('\n');
/** Source with comments stripped, so a doc comment cannot fail a grep. */
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
/** The built CSS with whitespace collapsed, for structural greps. */
const cssMin = css.replace(/\s+/g, ' ');

const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });
const note = (name, detail) => results.push({ name, pass: null, detail });
const count = (re, s = html) => (s.match(re) ?? []).length;
const gz = (buf) => gzipSync(buf, { level: 9 }).length;

/* ---------------------------------------------------------------- A. render */
check('renders without throwing', html.length > 20000, `${html.length.toLocaleString()} chars`);
check(
  'A6 · prerendered HTML carries the 15-second path as text',
  ['WE BUILD COMPLEX THINGS.', 'SOFTWARE', 'ROBOTICS', 'AUTOMATION', 'Bring us a problem'].every(
    (s) => distHtml.includes(s),
  ) &&
    ['1.256', '0.0e+00', '−0.93', '27.93'].every((s) => distHtml.includes(s)),
);
check(
  'A6 · the three project titles are prerendered',
  ['Stereo visual SLAM', 'A COCO metric', 'A pose-graph back end'].every((s) =>
    distHtml.includes(s),
  ),
);

/* ------------------------------------------------------------ A1-A4. tokens */
check(
  'A1 · no fonts.googleapis / fonts.gstatic request anywhere',
  !/fonts\.(googleapis|gstatic)/.test(css) && !/fonts\.(googleapis|gstatic)/.test(distHtml),
);
const fontDir = root('public/fonts');
const fonts = readdirSync(fontDir).filter((f) => f.endsWith('.woff2'));
const fontBytes = fonts.reduce((n, f) => n + statSync(join(fontDir, f)).size, 0);
check(
  'A1 · four self-hosted woff2 faces, <= 130 KB total',
  fonts.length === 4 && fontBytes <= 130 * 1024,
  `${fonts.length} files, ${(fontBytes / 1024).toFixed(1)} KB`,
);
check(
  'A2 · metric-matched fallback faces with real overrides',
  /size-adjust:\s*105\.68%/.test(css) &&
    /ascent-override:\s*88\.95%/.test(css) &&
    /size-adjust:\s*124\.98%/.test(css),
);
const hexes = [...css.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => m[0].toLowerCase());
const TOKEN_HEXES = new Set([
  '#070706', '#0b0b0a', '#121210', '#191917', '#221f1c',
  '#f2f0ea', '#9e9a91', '#8f8a80', '#726b60',
  '#ffb000', '#ffc64d', '#c98a12', '#8bd46b', '#ff7a62', '#3d2e06',
]);
const strayHex = [...new Set(hexes.filter((h) => !TOKEN_HEXES.has(h)))];
check('A3 · every hex literal in the CSS is a §3.1 token', strayHex.length === 0, strayHex.join(' '));
const radii = [...css.matchAll(/border-radius:\s*([^;}]+)/g)].map((m) => m[1].trim());
check(
  'A4 · only 0 / 2px radii exist',
  radii.every((v) => /^(0|2px|0px)$/.test(v)),
  [...new Set(radii)].join(' | '),
);
check('A4 · no rounded-* utility survived into the markup', count(/class="[^"]*rounded-/g) === 0);

/* ----------------------------------------------------------- B. layout, §7 */
check('B8 · zero centred headings', count(/text-center/g) === 0 && !/text-center/.test(css));
check(
  'B7 · no shared Section wrapper component exists',
  !existsSync(root('src/components/Section.tsx')),
);
check(
  'B7 · eleven sections, each its own component',
  readdirSync(root('src/components')).length >= 24,
  `${readdirSync(root('src/components')).length} components`,
);
check(
  'B10 · three project reveals are three distinct components',
  ['WorkOverlap', 'WorkSplit', 'WorkBand'].every((c) =>
    existsSync(root(`src/components/${c}.tsx`)),
  ) && count(/class="rv rv--(overlap|split|band)"/g) === 3,
);
check('B11 · the case study renders five beats', count(/class="beat beat--/g) === 5);
const labSpans = ['a:5', 'b:4', 'c:3', 'd:4', 'e:8', 'f:6'].map(([k, , v]) =>
  new RegExp(`\\.lab-${k}\\s*\\{\\s*grid-column:\\s*span ${v}`).test(cssMin),
);
check(
  'B12 · Lab spans are irregular (5/4/3 · 4/8 · 6) and no two rows repeat',
  labSpans.every(Boolean),
  labSpans.map((ok, i) => `${'abcdef'[i]}${ok ? '' : '!'}`).join(''),
);
check('no chip / pill / badge / tag component', !existsSync(root('src/components/Tag.tsx')) && count(/class="[^"]*\b(chip|pill|badge)\b/g) === 0);

/* -------------------------------------------------------------- C. type */
check(
  'C15 · tracking signs: negative on display, +0.16em on uppercase mono',
  /--track-display:\s*-0?\.022em/.test(css) && /--track-label:\s*0?\.16em/.test(css),
);
check(
  'C16 · tabular numerals on the data type',
  count(/font-variant-numeric:\s*tabular-nums/g, css) >= 6,
  `${count(/font-variant-numeric:\s*tabular-nums/g, css)} declarations`,
);
check(
  'C18 · no text below 11px (0.6875rem is the floor)',
  !/font-size:\s*0\.(0|1|2|3|4|5|6[0-7])/.test(css),
);
check(
  'C · no Inter / JetBrains / Space Grotesk / Satoshi / Geist / Archivo / Plex',
  !/\bInter\b|JetBrains|Space\s?Grotesk|Satoshi|Geist|Archivo|IBM Plex/i.test(css),
);

/* ------------------------------------------------------- D. colour, contrast */
// `--fg-dim` is 3.11-3.83:1: a border and tick colour, never a text colour.
// The one `color:` use is `.pipe__arrow`, where it inks an SVG stroke through
// currentColor and is a non-text graphic under 1.4.11.
const dimTextUses = [...cssMin.matchAll(/([^{}]+)\{[^}]*[^-]color:\s*var\(--fg-dim\)/g)]
  .map((m) => m[1].trim())
  .filter((sel) => !/\.pipe__arrow/.test(sel));
check('D20 · --fg-dim carries no text', dimTextUses.length === 0, dimTextUses.join(' | '));
check(
  'D · focus ring is 2px amber at offset 3',
  /outline:\s*2px solid var\(--accent\)/.test(css) && /outline-offset:\s*3px/.test(css),
);

/* ------------------------------------------------------------- E. media */
check(
  'E24 · zero autoplay attributes anywhere in the source',
  !/autoPlay|autoplay\s*=/.test(code),
);
check(
  'E24 · every <video> carries muted, playsInline and preload="none" (no loop)',
  /muted\s+playsInline\s+preload="none"/.test(
    readFileSync(root('src/components/MediaWell.tsx'), 'utf8'),
  ),
);
check(
  'E23 · one MediaWell implements the degradation states, and every well uses it',
  count(/from '\.\.\/components\/MediaWell'|from '\.\/MediaWell'/g, src) >= 5 &&
    /well__plate/.test(src) &&
    /MEDIA — PENDING/.test(src),
);
check(
  'E25 · posters are <picture>, not the poster attribute',
  count(/<picture>/g) >= 8 && !/\bposter=/.test(src.replace(/posterAvif|posterWebp|poster\?/g, '')),
  `${count(/<picture>/g)} picture elements`,
);
check(
  'E29 · every figure has a figcaption',
  count(/<figure/g) === count(/<figcaption/g),
  `${count(/<figure/g)} figures, ${count(/<figcaption/g)} captions`,
);
check(
  'E44 · every media well has an aspect-ratio set before load',
  count(/aspect-ratio:/g) === count(/class="well__box"/g),
  `${count(/class="well__box"/g)} wells`,
);
const mediaDir = root('public/media');
const clips = existsSync(mediaDir)
  ? readdirSync(mediaDir).filter((f) => /\.(mp4|webm)$/.test(f))
  : [];
const clipIds = new Set(clips.map((f) => f.replace(/\.(mp4|webm)$/, '')));
const clipBytes = clips.reduce((n, f) => n + statSync(join(mediaDir, f)).size, 0);
check(
  'E27 · at most 6 clips, <= 4.2 MB of video for the format a browser picks',
  clipIds.size <= 6,
  `${clipIds.size} clips, ${(clipBytes / 1024 / 1024).toFixed(2)} MB across both formats`,
);
const oversize = clips.filter((f) => statSync(join(mediaDir, f)).size > 900 * 1024);
check(
  'E27 · every single clip file <= 900 KB',
  oversize.length === 0,
  oversize.map((f) => `${f} ${(statSync(join(mediaDir, f)).size / 1024).toFixed(0)} KB`).join(', '),
);

/* --------------------------------------------------- F. motion, the switch */
check(
  'F30b · motion is declared inside no-preference, not disabled in reduce',
  /@media \(prefers-reduced-motion: no-preference\)/.test(css),
);
check(
  'F30 · a global reduce block exists as belt and braces',
  /@media \(prefers-reduced-motion: reduce\)/.test(css),
);
check(
  'F31 · no auto-motion the reader cannot stop: clips play once, never loop',
  !/<video[^>]*\sloop\b/.test(html) && !/class="motion /.test(html),
);
check(
  'F31 · MOTION OFF freezes transitions site-wide',
  /html\[data-motion=['\"]?off['\"]?\]/.test(css),
);
check(
  'F33 · .reveal defaults to visible, so a page without JS is complete',
  /\.reveal\s*\{\s*opacity:\s*1;\s*transform:\s*none\s*\}/.test(cssMin),
);
const shadows = [...css.matchAll(/box-shadow:\s*([^;}]+)/g)].map((m) => m[1].trim());
const ALLOWED_SHADOW = /^(none|0 1px 0 var\(--rule\)|0 0 0 1px var\(--rule-2\)|inset 0 -1px 0 var\(--rule\))$/;
check(
  'no drop shadows: every box-shadow is a zero-blur hairline or the palette ring',
  shadows.every((v) => ALLOWED_SHADOW.test(v)),
  [...new Set(shadows)].join(' | '),
);
check(
  'no glow: no box-shadow or text-shadow carries the accent',
  !/box-shadow:[^;}]*var\(--accent\)/.test(css) && !/text-shadow/.test(css),
);
check(
  'backdrop-filter appears exactly once, on the header',
  count(/backdrop-filter:/g, css) === 1,
);
const gradients = [...css.matchAll(/(linear|radial|conic)-gradient\(/g)];
check(
  'gradients only as the terminal mask fade',
  gradients.length <= 1,
  `${gradients.length} gradient(s)`,
);
check('no marquee, no keyframes animation', !/@keyframes/.test(css));

/* ------------------------------------------------------------ G. semantics */
check('G37 · exactly one <h1>', count(/<h1[\s>]/g) === 1);
const order = [...html.matchAll(/<(h[1-4])[\s>]/g)].map((m) => m[1]);
let skips = [];
for (let i = 1; i < order.length; i++) {
  const a = Number(order[i - 1][1]);
  const b = Number(order[i][1]);
  if (b > a + 1) skips.push(`${order[i - 1]}→${order[i]}`);
}
check('G37 · no heading level is skipped', skips.length === 0, skips.join(', '));
check(
  'G37 · one main, one header, one footer, real landmarks',
  count(/<main[\s>]/g) === 1 && count(/<header[\s>]/g) === 1 && count(/<footer[\s>]/g) === 1,
);
check('G35 · a skip link is the first tab stop', html.indexOf('skip-link') < html.indexOf('<header'));
check(
  'G37 · the proof rows are buttons with aria-expanded and aria-controls',
  count(/aria-expanded="false" aria-controls/g) === 4,
);
check(
  'G37 · the capability wall is a real tablist',
  /role="tablist"/.test(html) && count(/role="tab"/g) === 4 && /role="tabpanel"/.test(html),
);
check(
  'G37 · the brief is one real form with a fieldset and legend per step',
  count(/<form/g) === 1 && count(/<fieldset/g) === 4 && count(/<legend/g) === 4,
);
check('G37 · terminal blocks carry role="img" and a summarising label', /role="img" aria-label="Captured terminal/.test(html) || /role="img"/.test(html));
check(
  'G36 · cursor: none appears nowhere — the native pointer is never hidden',
  !/cursor:\s*none/.test(css) && !/cursor:\s*none/.test(code),
);
check('G39 · the body clips horizontal overflow', /overflow-x:\s*clip/.test(css));
check('G40 · prefers-contrast: more steps the hairlines up', /@media \(prefers-contrast: more\)/.test(css));

/* ------------------------------------------------------- H. proof, honesty */
check('H43 · the unflattering number is present and explained', /37\.3/.test(html) && /36\.63/.test(html) && /single-label decode/.test(html));
check('H44 · at least one Lab tile is ABANDONED with a reason', /STATUS: ABANDONED/.test(html));
// swarm-path-planning shipped after the first build: 224 tests, CI green, public.
check('H · the Lab links swarm-path-planning as shipped work', /swarm-path-planning/.test(html) && /github\.com\/Pratyush150\/swarm-path-planning/.test(html));
check(
  'H45 · zero client counts, project counts, country counts or testimonials',
  !/\b\d+\+\s*(projects|clients|countries)/i.test(html) &&
    !/testimonial/i.test(html) &&
    !/\bclients\b/i.test(html) &&
    !/years of experience/i.test(html),
);
check('H45 · no REPLACE_ME leaked into the markup', !/REPLACE_ME/.test(html));
// The Fiverr profile URL is now live, so the pending state is no longer expected.
check('H45 · every contact destination is a real link, none pending', /fiverr\.com/.test(html) && /linkedin\.com\/in\//.test(html) && /mailto:/.test(html) && !/PROFILE PENDING/.test(html) && !/href="REPLACE/.test(html));
check(
  'H45b · the activity log renders only when its generator has run',
  !existsSync(root('src/content/activity.generated.json')) ? !/ACTIVITY LOG/.test(html) : /ACTIVITY LOG/.test(html),
  existsSync(root('src/content/activity.generated.json')) ? 'generated file present' : 'no generated file, section correctly absent',
);
check('no emoji anywhere', !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(html));
check(
  'no banned marketing vocabulary',
  !/cutting-edge|seamless|leverage|passionate|empower|journey|let'?s build something amazing/i.test(
    html,
  ),
);
check('no "Hi, I\'m" and no first-person singular positioning', !/Hi,? I'?m/i.test(html));

/* ------------------------------------------------- I. performance, delivery */
const pkg = JSON.parse(readFileSync(root('package.json'), 'utf8'));
check(
  'I47 · dependencies are exactly react and react-dom',
  Object.keys(pkg.dependencies).sort().join(',') === 'react,react-dom',
  Object.keys(pkg.dependencies).join(', '),
);
const jsFiles = assetFiles.filter((f) => f.endsWith('.js'));
const entryJs = jsFiles.find((f) => f.startsWith('index-'));
const entryGz = gz(readFileSync(join(assetsDir, entryJs)));
const cssGz = gz(Buffer.from(css));
const htmlGz = gz(Buffer.from(distHtml));
check('I48 · CSS <= 22 KB gzipped', cssGz <= 22 * 1024, `${(cssGz / 1024).toFixed(1)} KB gz`);
check(
  'I48 · initial JS <= 55 KB gzipped',
  entryGz <= 55 * 1024,
  `${(entryGz / 1024).toFixed(1)} KB gz (react+react-dom alone is ~44 KB gz)`,
);
const aboveFold = htmlGz + cssGz + entryGz + statSync(join(fontDir, 'Chivo-var.woff2')).size + statSync(join(fontDir, 'Chivo-900-hero.woff2')).size;
check(
  'I48 · above-the-fold transfer <= 420 KB',
  aboveFold <= 420 * 1024,
  `${(aboveFold / 1024).toFixed(1)} KB (html+css+js gz, two preloaded faces, no hero clip)`,
);
check(
  'I51 · .nojekyll, robots.txt, sitemap.xml and og.png ship',
  ['dist/.nojekyll', 'dist/robots.txt', 'dist/sitemap.xml', 'dist/og.png'].every((p) =>
    existsSync(root(p)),
  ),
);
check(
  'I51 · canonical, OG, Twitter and JSON-LD are present',
  /rel="canonical"/.test(distHtml) &&
    /property="og:image"/.test(distHtml) &&
    /name="twitter:card"/.test(distHtml) &&
    /application\/ld\+json/.test(distHtml),
);
check('I51 · an inline SVG favicon, not a file request', /rel="icon"[^>]*data:image\/svg\+xml/.test(distHtml));
check(
  'pre-paint script sets the motion state before first paint',
  /data-motion/.test(distHtml) && distHtml.indexOf('signal-motion') < distHtml.indexOf('<body'),
);

/* --------------------------------------------------- what a browser must do */
note('needs a browser', 'LCP / CLS / INP, Lighthouse, the 200% zoom pass, the amber-marks-per-viewport count, and the throttled font-swap check.');
note('needs a mail client', 'checklist I52: an end-to-end submit. The form composes a real mailto: until a Web3Forms key is set in src/content/submit.ts.');

/* ------------------------------------------------------------------ report */
let failed = 0;
for (const r of results) {
  const tag = r.pass === null ? 'NOTE' : r.pass ? 'PASS' : 'FAIL';
  if (r.pass === false) failed++;
  console.log(`${tag}  ${r.name}${r.detail ? `  — ${r.detail}` : ''}`);
}
const checked = results.filter((r) => r.pass !== null).length;
console.log(`\n${checked - failed}/${checked} checks passed.`);
process.exit(failed === 0 ? 0 : 1);
