import { renderToString } from 'react-dom/server';
import App from './App';

/** Used by scripts/prerender.mjs and scripts/ssr-check.mjs. */
export function render(): string {
  return renderToString(<App />);
}
