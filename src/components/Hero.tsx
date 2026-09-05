import Rail from './Rail';
import HeroTrajectory from './HeroTrajectory';

/**
 * `01` Hero. Density 1: a headline and almost nothing else.
 *
 * The headline is static, prerendered, and painted in the real face on the
 * first frame — it is the LCP element and it is never animated. The sequenced
 * variant is rejected: it costs a 15-second visitor six to nine seconds for no
 * information, and the four verbs it would have spelled out are spent on the
 * capability wall instead, where the visitor drives them.
 *
 * The asymmetry that matters: the hero block is hard left in columns 2-9 and
 * the discipline strip is hard right in columns 7-12, overlapping horizontally
 * and offset vertically. Nothing here is centred.
 */
export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-h" data-bleed>
      <div className="shell grid12 hero__grid">
        <Rail index="01" label="INDEX" status="AVAILABLE" />

        <p className="hero__avail t-mono-read">
          <span className="mark" aria-hidden="true" />
          AVAILABLE FOR PROJECTS — WE REPLY WITHIN ONE WORKING DAY
        </p>

        {/* Literal uppercase, not `text-transform`: the 1.7 KB preloaded
            subset contains only these glyphs, and glyph selection has to be
            able to find them on the first frame. */}
        <h1 id="hero-h" className="t-hero hero__h">
          WE BUILD COMPLEX THINGS.
        </h1>

        <p className="hero__disc t-mono-read">SOFTWARE · AI · ROBOTICS · SYSTEMS</p>

        <p className="hero__lede t-lede">
          Software for machines that have to work outside the lab.
        </p>

        <p className="hero__ctas">
          <a className="link-signal" href="#work">
            See the work <span className="arrow" aria-hidden="true">↗</span>
          </a>
          <a className="link-plain" href="#contact">
            Bring us a problem <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </p>

        <p className="hero__scroll t-mono-read" aria-hidden="true">
          SCROLL ▼
        </p>
      </div>

      <div className="hero__art" aria-hidden="true">
        <HeroTrajectory />
      </div>
    </section>
  );
}
