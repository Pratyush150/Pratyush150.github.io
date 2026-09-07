import { SLAM_TERMINAL, SLAM_TERMINAL_SUMMARY } from '../content/artefacts';

/**
 * A real captured transcript, not a mock. Fourteen lines are visible and the
 * rest is behind a mask fade — the one gradient permitted anywhere on the site.
 * It carries `role="img"` and a summarising label, so a screen reader gets the
 * result rather than fourteen lines of log.
 */
export default function Terminal() {
  return (
    <figure className="term">
      <figcaption className="term__cap t-mono-read eyebrow">
        CAPTURED — benchmarks/run.py
      </figcaption>
      <div className="term__box" role="img" aria-label={SLAM_TERMINAL_SUMMARY}>
        <pre className="term__pre t-mono-code">
          {SLAM_TERMINAL.map((l, i) => (
            <span key={i} className={l.tone ? `term__l is-${l.tone}` : 'term__l'}>
              {l.text}
              {'\n'}
            </span>
          ))}
        </pre>
      </div>
      <p className="term__more t-mono-read">
        <a
          className="link-plain"
          href="https://github.com/Pratyush150/stereo-visual-slam#worked-example"
          target="_blank"
          rel="noreferrer"
        >
          FULL LOG <span className="arrow" aria-hidden="true">↗</span>
        </a>
      </p>
    </figure>
  );
}
