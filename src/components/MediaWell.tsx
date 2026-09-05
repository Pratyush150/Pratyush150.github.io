import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MEDIA } from '../content/media.generated';
import { useMotionAllowed, isFrugalConnection } from '../lib/motion';
import { requestPlay, release } from '../lib/playManager';

/**
 * The one media component. Every clip on the site goes through it, which is the
 * only way the six degradation states in the brief stay true: implemented once,
 * the whole page degrades correctly; implemented per section, it will not.
 *
 * Six states, one box, zero layout movement between them:
 *
 *   1  clip + poster, motion on, good link  poster paints, clip loads on
 *                                           approach, plays at 45% visibility
 *   2  clip, MOTION OFF / reduced motion    poster only, no network request
 *   3  clip, saveData or 2g                 poster only, no network request
 *   4  clip missing, poster present         poster only, STILL readout
 *   5  neither, an SVG figure exists        the figure, same aspect
 *   6  nothing at all                       a hairline specimen plate
 *
 * The box is sized by `aspect-ratio` before anything loads, so deleting every
 * file in `public/media` and rebuilding moves nothing.
 */
export type MediaWellProps = {
  /** Manifest id, e.g. `svslam-kitti-trajectory`. */
  id?: string | null;
  /** CSS aspect-ratio for the well. Fixed before load, never changes. */
  aspect: string;
  /** Names what it shows and on what data. Required — a clip without one does not ship. */
  caption: ReactNode;
  /** Rendered when there is no clip and no poster. */
  figure?: ReactNode;
  /** Set for a well that is off-screen at load, i.e. everything but the hero. */
  eager?: boolean;
  className?: string;
  /** Playback is driven from outside (the capability wall drives its own plate). */
  active?: boolean;
};

export default function MediaWell({
  id,
  aspect,
  caption,
  figure,
  eager = false,
  className = '',
  active,
}: MediaWellProps) {
  const assets = (id && MEDIA[id]) || undefined;
  const hasClip = Boolean(assets?.webm || assets?.mp4);
  const hasPoster = Boolean(assets?.poster);
  const motionAllowed = useMotionAllowed();

  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false); // near enough to fetch metadata
  const [visible, setVisible] = useState(false); // 45% in view
  const [failed, setFailed] = useState(false);

  const wanted = hasClip && !failed && motionAllowed;

  useEffect(() => {
    if (!wanted) return;
    if (isFrugalConnection()) return; // state 3: nothing is requested
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setArmed(true);
      setVisible(eager);
      return;
    }
    const near = new IntersectionObserver(
      (es) => es.some((e) => e.isIntersecting) && (setArmed(true), near.disconnect()),
      { rootMargin: '200px' },
    );
    const seen = new IntersectionObserver((es) => es.forEach((e) => setVisible(e.isIntersecting)), {
      threshold: 0.45,
    });
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, [wanted, eager]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const shouldPlay = wanted && armed && (active ?? visible);
    if (shouldPlay) requestPlay(v);
    else release(v);
  }, [wanted, armed, visible, active]);

  const state = hasClip ? 'clip' : hasPoster ? 'still' : figure ? 'figure' : 'pending';

  return (
    <figure className={`well ${className}`}>
      <div ref={boxRef} className="well__box" style={{ aspectRatio: aspect }}>
        {hasPoster ? (
          <picture>
            {assets?.posterAvif ? <source srcSet={assets.posterAvif} type="image/avif" /> : null}
            {assets?.posterWebp ? <source srcSet={assets.posterWebp} type="image/webp" /> : null}
            <img
              className="well__poster"
              src={assets?.poster}
              alt=""
              width={1280}
              height={720}
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
            />
          </picture>
        ) : null}

        {wanted && armed ? (
          <video
            ref={videoRef}
            className="well__video"
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onError={() => setFailed(true)}
          >
            {assets?.webm ? <source src={assets.webm} type="video/webm" /> : null}
            {assets?.mp4 ? <source src={assets.mp4} type="video/mp4" /> : null}
          </video>
        ) : null}

        {state === 'figure' ? <div className="well__figure">{figure}</div> : null}

        {state === 'pending' ? (
          <div className="well__plate">
            <span className="t-mono-read eyebrow">MEDIA — PENDING</span>
          </div>
        ) : null}
      </div>
      <figcaption className="well__cap t-mono-meta">
        {state === 'still' ? <span className="well__still t-mono-read">STILL — </span> : null}
        {caption}
      </figcaption>
    </figure>
  );
}
