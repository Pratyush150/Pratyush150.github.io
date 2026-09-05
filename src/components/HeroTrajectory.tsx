import { useEffect, useRef, useState } from 'react';
import { TRAJECTORY_ESTIMATE, TRAJECTORY_VIEWBOX } from '../content/trajectory';
import { useMotionAllowed } from '../lib/motion';

/**
 * The real KITTI estimated path, drawing itself once behind the hero type.
 *
 * One of only two long draws on the site. Inline SVG, one path, 180 points
 * decimated from the run's own 1,106 poses — no library, no canvas, and no
 * network request. It runs once and stops; it is decorative, so it is hidden
 * from assistive technology and it is not rendered below 1024px at all.
 */
export default function HeroTrajectory() {
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const allowed = useMotionAllowed();

  useEffect(() => {
    const path = ref.current;
    if (!path) return;
    setLen(path.getTotalLength());
  }, []);

  useEffect(() => {
    // Motion off: the path is simply already drawn, no transition.
    if (!allowed) {
      setDrawn(true);
      return;
    }
    // Wait for the measurement, or the dash offset would be released before
    // `--len` exists and the draw would never be seen.
    if (!len) return;
    const id = window.requestAnimationFrame(() => setDrawn(true));
    return () => window.cancelAnimationFrame(id);
  }, [allowed, len]);

  return (
    <svg
      className="hero__traj"
      viewBox={TRAJECTORY_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <path
        ref={ref}
        className={`draw${drawn ? ' is-drawn' : ''}`}
        d={TRAJECTORY_ESTIMATE}
        fill="none"
        stroke="var(--accent-dim)"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="round"
        style={len ? ({ '--len': `${len}` } as React.CSSProperties) : undefined}
      />
    </svg>
  );
}
