import { useEffect, useState } from 'react';

/**
 * `00` The persistent header. Transparent over the hero, then a ground and a
 * hairline after 8px of scroll. Over full-bleed media it inverts itself with
 * one declaration (`mix-blend-mode: difference`) driven by a single observer on
 * `<html>`, which is Locomotive's shipped trick and reads as far more expensive
 * than the ten lines it costs.
 */
export type HeaderProps = { onOpenPalette: () => void };

export default function Header({ onOpenPalette }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const targets = document.querySelectorAll('[data-bleed]');
    if (!targets.length) return;
    const live = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) live.add(e.target);
          else live.delete(e.target);
        }
        document.documentElement.classList.toggle('is-over-media', live.size > 0);
      },
      { rootMargin: '-56px 0px -100% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      document.documentElement.classList.remove('is-over-media');
    };
  }, []);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__in">
        <a className="wordmark t-mono-read" href="#main">
          PRATYUSH VATSA
          <span className="wordmark__sub">ENGINEERING STUDIO</span>
        </a>
        <nav aria-label="Sections">
          <ul className="site-nav t-mono-read">
            <li>
              <a className="link-plain" href="#work">
                WORK
              </a>
            </li>
            <li>
              <a className="link-plain" href="#measured">
                MEASURED
              </a>
            </li>
            <li>
              <a className="link-plain" href="#lab">
                LAB
              </a>
            </li>
            <li>
              <a className="link-plain" href="#contact">
                CONTACT
              </a>
            </li>
          </ul>
        </nav>
        <div className="site-header__ctl">
          <button type="button" className="palette-hint t-mono-read" onClick={onOpenPalette}>
            PRESS <kbd>K</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
