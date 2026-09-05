import { useEffect, useRef, useState } from 'react';
import {
  TRAJECTORY_ESTIMATE,
  TRAJECTORY_GROUND_TRUTH,
  TRAJECTORY_VIEWBOX,
} from '../content/trajectory';
import { CASE } from '../content/work';
import { useMotionAllowed } from '../lib/motion';
import { useInView } from '../lib/reveal';

/**
 * `04 THE MOMENT` — the payoff, and the only place `--ease-snap` is used.
 *
 * The video is the enhancement; **these two SVG paths are the content**. Both
 * are real: the grey one is the OXTS ground truth and the amber one is the
 * estimated trajectory, 180 points each decimated from the run's own 1,106
 * poses on the same indices. With no JavaScript both paths are visible and both
 * numeral pairs are shown side by side with the arrow between them, so the beat
 * works with zero media files — which is the reason it is built this way.
 *
 * One honest deviation from the brief: it specifies a crossfade between a
 * `poses_before_loop` path and a `poses` path. The pipeline computes the
 * before-loop poses in memory and never serialises them, so no such file
 * exists; drawing an invented one would be a fabricated figure. What snaps
 * here instead is the pair of measured numbers — ATE RMSE 3.331 m to 1.276 m
 * and translation 2.020% to 1.256% — both read from `benchmark.json`.
 */
export default function LoopSnap() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.6 });
  const allowed = useMotionAllowed();
  const [closed, setClosed] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    if (!allowed) {
      setClosed(true);
      return;
    }
    if (!inView) return;
    const id = window.setTimeout(() => setClosed(true), 900);
    return () => window.clearTimeout(id);
  }, [inView, allowed]);

  return (
    <div ref={ref} className={`snap${closed ? ' is-closed' : ''}`}>
      <figure className="snap__fig">
        <svg
          className="snap__svg"
          viewBox={TRAJECTORY_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="The estimated trajectory over the OXTS ground truth for KITTI drive 2011_09_30_drive_0027. The two paths overlie each other to within 1.276 metres of absolute trajectory error over 694.7 metres."
        >
          <path
            d={TRAJECTORY_GROUND_TRUTH}
            fill="none"
            stroke="var(--fg-3)"
            strokeWidth="3"
            strokeLinejoin="round"
            opacity="0.55"
          />
          <path
            ref={pathRef}
            className={`draw${inView || !allowed ? ' is-drawn' : ''}`}
            d={TRAJECTORY_ESTIMATE}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinejoin="round"
            style={len ? ({ '--len': `${len}` } as React.CSSProperties) : undefined}
          />
        </svg>
        <figcaption className="snap__cap t-mono-meta">
          Ground truth in grey, the estimate in amber. KITTI raw
          2011_09_30_drive_0027_sync, 1,106 poses decimated to 180 on identical
          indices, projected to the XZ plane. Read from{' '}
          <code>benchmarks/output/trajectory.txt</code> and{' '}
          <code>ground_truth.txt</code>.
        </figcaption>
      </figure>

      <dl className="snap__nums">
        {[
          { label: 'ATE RMSE', before: CASE.moment.before.ate, after: CASE.moment.after.ate },
          {
            label: 'TRANSLATION',
            before: CASE.moment.before.trans,
            after: CASE.moment.after.trans,
          },
        ].map((n) => (
          <div key={n.label} className="snap__num">
            <dt className="t-mono-read eyebrow">{n.label}</dt>
            <dd>
              <span className="snap__before t-figure-num">{n.before}</span>
              <span className="snap__to t-mono-read" aria-hidden="true">
                →
              </span>
              <span className="snap__after t-figure-num">{n.after}</span>
            </dd>
          </div>
        ))}
        <p className="snap__why t-mono-meta">
          Before and after bag-of-words loop closure, same run, same sequence.
          21 accepted closures out of 1,555 appearance candidates; all 21
          correct.
        </p>
      </dl>
    </div>
  );
}
