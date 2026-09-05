import MediaWell from './MediaWell';
import type { Reveal } from '../content/work';

/**
 * Shape 3 — BAND. The media runs full-bleed as a letterbox with no columns at
 * all; the title sits *below* it in columns 2-7 and the metadata far right in
 * columns 10-12 on the same baseline. The only full-bleed media on the page
 * outside the case study.
 */
export default function WorkBand({ reveal }: { reveal: Reveal }) {
  return (
    <article className="rv rv--band" data-cursor="READ THE CODE ↗" aria-labelledby={`rv-${reveal.slug}`} data-bleed>
      <div className="rv__band">
        <MediaWell id={reveal.clip} aspect={reveal.aspect} caption={reveal.caption} />
      </div>
      <div className="shell grid12 rv__foot">
        <div className="rv__foot-l">
          <p className="rv__num t-figure-num" aria-hidden="true">
            {reveal.numeral}
          </p>
          <h3 id={`rv-${reveal.slug}`} className="rv__title t-project">
            {reveal.title}
          </h3>
        </div>
        <div className="rv__foot-r">
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
      </div>
    </article>
  );
}
