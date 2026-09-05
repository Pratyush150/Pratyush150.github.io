import MediaWell from './MediaWell';
import type { Reveal } from '../content/work';

/**
 * Shape 1 — OVERLAP. The media well bleeds off the left edge to column 9; the
 * title is set on top of it, crossing the media edge into columns 8-12 over a
 * solid `--bg-void` plate. The only reveal on the site where type touches
 * footage, and the plate is why the metadata never does: only `--fg` and
 * `--accent` are allowed to sit directly on a frame.
 */
export default function WorkOverlap({ reveal }: { reveal: Reveal }) {
  return (
    <article className="rv rv--overlap" data-cursor="VIEW CASE ↗" aria-labelledby={`rv-${reveal.slug}`}>
      <div className="rv__media">
        <MediaWell id={reveal.clip} aspect={reveal.aspect} caption={reveal.caption} />
      </div>
      <div className="rv__type">
        <p className="rv__num t-figure-num" aria-hidden="true">
          {reveal.numeral}
        </p>
        <h3 id={`rv-${reveal.slug}`} className="rv__title t-project">
          {reveal.title}
        </h3>
        <p className="rv__meta t-mono-meta">{reveal.meta}</p>
        <p>
          <a className="link-signal t-mono-read" href={reveal.href}>
            {reveal.linkLabel} <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </p>
      </div>
    </article>
  );
}
