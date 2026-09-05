/**
 * The one reveal primitive, and the one "has this entered view" hook.
 *
 * `.reveal` defaults to *visible*. The hidden state is applied by CSS only
 * under `.js` (set by the pre-paint script) and only inside
 * `@media (prefers-reduced-motion: no-preference)`, so a page with no
 * JavaScript, or a reader who asked for less motion, gets the finished layout
 * rather than an empty one.
 */
import { useEffect, useRef, useState } from 'react';

type Options = {
  /** Fraction of the element that must be visible. */
  threshold?: number;
  rootMargin?: string;
  /** Fire once and disconnect. True for every content reveal on this site. */
  once?: boolean;
};

export function useInView<T extends HTMLElement>(
  options: Options = {},
): [React.RefObject<T>, boolean] {
  const { threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);

    // Failsafe. A reveal is a nice-to-have; a permanently blank section is not.
    // An observer can fail to fire for content the reader never scrolls past
    // slowly enough, for an anchor jump that lands beyond the trigger, or for a
    // restored scroll position. Anything still hidden shortly after mount is
    // shown unconditionally — off-screen elements reveal invisibly, so this
    // costs nothing and guarantees no reader meets an empty page.
    const failsafe = window.setTimeout(() => setInView(true), 1600);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

/**
 * Class helper for the section reveal. The element is always in the markup and
 * always readable; `is-in` is what CSS uses to release the transition.
 */
export const revealClass = (inView: boolean, extra = ''): string =>
  `reveal${inView ? ' is-in' : ''}${extra ? ` ${extra}` : ''}`;
