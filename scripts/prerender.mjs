/**
 * Inject the server-rendered markup into dist/index.html.
 *
 * The site is one static page. Prerendering means the copy is readable with
 * JavaScript disabled, the LCP element is the hero heading rather than an empty
 * root div, and a crawler sees the real words without executing anything. It is
 * also what makes the fifteen-second path work on a cold connection.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { render } from '../dist-ssr/entry-server.js';

const indexPath = fileURLToPath(new URL('../dist/index.html', import.meta.url));
const html = readFileSync(indexPath, 'utf8');
const marker = '<div id="root"></div>';

if (!html.includes(marker)) {
  throw new Error('prerender: could not find the root container in dist/index.html');
}

const body = render();
writeFileSync(indexPath, html.replace(marker, `<div id="root">${body}</div>`));
console.log(`prerendered ${body.length.toLocaleString()} chars into dist/index.html`);
