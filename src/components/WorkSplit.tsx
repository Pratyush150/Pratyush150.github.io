import MediaWell from './MediaWell';
import type { Reveal } from '../content/work';

/**
 * Shape 2 — SPLIT. Media contained in columns 2-6; the numeral, title and
 * metadata stacked in columns 8-12 and top-aligned to the media's bottom third,
 * so the type hangs low and the quadrant above it stays empty. The empty
 * top-right quadrant is the point. Do not fill it.
 */
export default function WorkSplit({ reveal }: { reveal: Reveal }) {
  return (
    <article className="rv rv--split" data-cursor="READ THE CODE ↗" aria-labelledby={`rv-${reveal.slug}`}>
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
          <a
            className="link-signal t-mono-read"
            href={reveal.href}
            rel="noreferrer"
            target="_blank"
          >
            {reveal.linkLabel} <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </p>
      </div>
    </article>
  );
}
