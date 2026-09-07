/**
 * Compute every foreground/background pair this site actually ships.
 *
 *   node scripts/contrast.mjs
 *
 * WCAG 2.x relative luminance, exact sRGB formula. Nothing here is quoted from
 * the brief: the hex values are read out of src/index.css, so if a token moves
 * the table moves with it.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(fileURLToPath(new URL('../src/index.css', import.meta.url)), 'utf8');
const tok = (name) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --${name} not found`);
  return m[1];
};

const chan = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => chan(c / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
/** Flatten an alpha white rule over a ground, so the hairlines are real too. */
const over = (alpha, bgHex) => {
  const n = parseInt(bgHex.slice(1), 16);
  const mix = (c) => Math.round(255 * alpha + c * (1 - alpha));
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(mix);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};

const grounds = ['bg-void', 'bg-base', 'bg-raise', 'bg-elev', 'bg-inset'].map((n) => [n, tok(n)]);
const inks = ['fg', 'fg-2', 'fg-3', 'fg-dim', 'accent', 'accent-hi', 'accent-dim', 'sig-ok', 'sig-err', 'rule-ui'];

const pad = (s, n) => String(s).padEnd(n);
console.log(pad('token', 12) + pad('hex', 10) + grounds.map(([n]) => pad(n, 10)).join(''));
let fails = 0;
for (const ink of inks) {
  const hex = tok(ink);
  const cells = grounds.map(([, bg]) => ratio(hex, bg));
  console.log(pad(ink, 12) + pad(hex, 10) + cells.map((c) => pad(c.toFixed(2), 10)).join(''));
  // --fg-dim and --rule-ui are non-text; everything else must clear 4.5:1.
  if (!['fg-dim', 'rule-ui'].includes(ink) && Math.min(...cells) < 4.5) fails++;
}
for (const [name, alpha] of [['rule (10% white)', 0.1], ['rule-2 (16% white)', 0.16]]) {
  const cells = grounds.map(([, bg]) => ratio(over(alpha, bg), bg));
  console.log(pad(name, 22) + cells.map((c) => pad(c.toFixed(2), 10)).join(''));
}
console.log('');
console.log(`on-accent on accent      ${ratio(tok('on-accent'), tok('accent')).toFixed(2)}`);
console.log(`accent on bg-elev (ring) ${ratio(tok('accent'), tok('bg-elev')).toFixed(2)}`);
console.log(`fg on sel-bg             ${ratio(tok('fg'), tok('sel-bg')).toFixed(2)}`);
console.log(`fg over a scrimmed frame ${ratio(tok('fg'), '#3a3a36').toFixed(2)}`);
console.log(`fg-3 over the same frame ${ratio(tok('fg-3'), '#3a3a36').toFixed(2)}  <- why only --fg and --accent sit on footage`);
console.log('');
console.log(fails === 0 ? 'PASS — every text token clears 4.5:1 on every ground it can meet.' : `FAIL — ${fails} text token(s) below 4.5:1`);
process.exit(fails === 0 ? 0 : 1);
