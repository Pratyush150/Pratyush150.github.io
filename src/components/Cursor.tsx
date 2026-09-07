import { useEffect, useRef, useState } from 'react';
import { useMotionAllowed } from '../lib/motion';

/**
 * The cursor is an instrument readout, not a blob — and it is demoted on
 * purpose. None of the five engineering-credible references in the teardown
 * ships one at all; ours exists because it was asked for, it carries no
 * information that is not already in the DOM, and it is the first thing to cut.
 *
 * Hard gates, all of them non-negotiable:
 *   - only when `(pointer: fine)` AND `(prefers-reduced-motion: no-preference)`
 *     AND the MOTION switch is ON; unmounted entirely otherwise;
 *   - **the native cursor is never hidden.** `cursor: none` appears nowhere on
 *     this site. The square is drawn in addition to the system pointer, so the
 *     reader keeps their own pointer size, colour and contrast settings;
 *   - `pointer-events: none`, `contain: layout style size`, one rAF loop;
 *   - damped, not tweened: `x += (target - x) / 12` per frame, written to two
 *     custom properties so CSS does the transform.
 */
export default function Cursor() {
  const allowed = useMotionAllowed();
  const [fine, setFine] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    try {
      setFine(window.matchMedia('(pointer: fine)').matches);
    } catch {
      setFine(false);
    }
  }, []);

  useEffect(() => {
    if (!allowed || !fine) return;
    const el = ref.current;
    if (!el) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = (e.target as HTMLElement | null)?.closest?.('[data-cursor]');
      setLabel(target?.getAttribute('data-cursor') ?? '');
    };

    const tick = () => {
      x += (tx - x) / 12;
      y += (ty - y) / 12;
      el.style.setProperty('--cx', `${x.toFixed(1)}px`);
      el.style.setProperty('--cy', `${y.toFixed(1)}px`);
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.cancelAnimationFrame(frame);
    };
  }, [allowed, fine]);

  if (!allowed || !fine) return null;

  return (
    <div ref={ref} className={`cur${label ? ' is-marked' : ''}`} aria-hidden="true">
      <span className="cur__sq" />
      {label ? <span className="cur__lbl t-mono-read">{label}</span> : null}
    </div>
  );
}
