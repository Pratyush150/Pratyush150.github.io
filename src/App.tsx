import { lazy, Suspense, useEffect, useState } from 'react';
import SkipLink from './components/SkipLink';
import Header from './components/Header';
import Hero from './components/Hero';
import CapabilityWall from './components/CapabilityWall';
import SelectedWork from './components/SelectedWork';
import CaseStudy from './components/CaseStudy';
import Measured from './components/Measured';
import UnderTheHood from './components/UnderTheHood';
import Lab from './components/Lab';
import Process from './components/Process';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cursor from './components/Cursor';

/**
 * The palette and its ~60-entry index are only needed once somebody presses K,
 * so they are a separate chunk. It is never rendered during the prerender, so
 * there is no Suspense boundary to resolve on the server.
 */
const CommandPalette = lazy(() => import('./components/CommandPalette'));

/** Stamped at build time by Vite's `define`; a readable fallback in dev. */
declare const __BUILD_STAMP__: string;
const BUILD = typeof __BUILD_STAMP__ === 'string' ? __BUILD_STAMP__ : 'dev';

/**
 * Eleven sections, eleven components, eleven padding values. There is
 * deliberately no shared `<Section>` shell: the rhythm in the brief depends on
 * no two adjacent sections sharing both a density and a vertical space value,
 * and a wrapper is how that discipline gets quietly lost.
 */
export default function App() {
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t &&
        (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable === true);
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPalette(true);
      } else if ((e.key === 'k' || e.key === 'K') && !typing && !e.altKey) {
        e.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <SkipLink />
      <Header onOpenPalette={() => setPalette(true)} />
      <main id="main">
        <Hero />
        <CapabilityWall />
        <SelectedWork />
        <CaseStudy />
        <Measured />
        <UnderTheHood />
        <Lab />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer build={BUILD} />
      {palette ? (
        <Suspense fallback={null}>
          <CommandPalette open onClose={() => setPalette(false)} />
        </Suspense>
      ) : null}
      <Cursor />
    </>
  );
}
