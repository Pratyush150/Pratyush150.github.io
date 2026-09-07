import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (root) {
  // The page is prerendered, so the normal path is a hydrate. A dev server or a
  // stripped build falls back to a fresh render rather than failing.
  if (root.firstElementChild) {
    hydrateRoot(
      root,
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } else {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}
