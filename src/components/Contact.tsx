import Rail from './Rail';
import BriefForm from './BriefForm';
import Clocks from './Clocks';
import { person, contact as contactCopy } from '../content';
import { isPending } from '../content/schema';

/**
 * `09` Bring us a problem. The `conversion` beat, 240px of air above it, and
 * the largest type on the page after the hero.
 *
 * The headline is left, the form is right, and they are vertically offset — the
 * form's first field aligns to the baseline of the headline's last line, not to
 * its top.
 *
 * There are no testimonials here and there will not be until there is a real,
 * named, attributed one. What covers the gap is the commitment: every
 * engagement starts with a written root-cause report at a fixed low price, and
 * the report stands on its own. That is a promise a bad studio cannot make.
 */
export default function Contact() {
  const fiverrPending = isPending(person.fiverr);

  return (
    <section id="contact" className="cta" aria-labelledby="cta-h" data-bleed>
      <div className="shell grid12 cta__grid">
        <Rail index="10" label="CONTACT" status="1 WORKING DAY" />

        <div className="cta__left">
          <h2 id="cta-h" className="t-statement cta__h">
            Bring us a problem.
          </h2>
          <p className="t-lede cta__lede">{contactCopy.blurb}</p>
          <p className="t-section cta__promise">
            Every engagement starts with a written root-cause report, at a fixed low price. You get
            an explanation you can act on even if you never hire us for the fix.
          </p>
          <p className="t-mono-meta cta__note">{contactCopy.note}</p>
          <p className="t-mono-read">
            <a
              className="link-signal"
              href={person.github}
              target="_blank"
              rel="noreferrer"
            >
              READ THE CODE BEFORE YOU TALK TO US <span className="arrow" aria-hidden="true">↗</span>
            </a>
          </p>
        </div>

        <div className="cta__right">
          <BriefForm />
        </div>

        <div className="cta__foot rule-t">
          <p className="t-mono-read cta__geo">
            BASED IN INDIA · WORKING GLOBALLY · <Clocks />
          </p>
          <ul className="cta__links t-mono-read">
            <li>
              <a className="link-plain" href={person.github} target="_blank" rel="noreferrer">
                GITHUB <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a className="link-plain" href={person.linkedin} target="_blank" rel="noreferrer">
                LINKEDIN <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              {fiverrPending ? (
                <span className="cta__pending" title="The Fiverr profile is not published yet.">
                  FIVERR <span className="cta__pending-tag">— PROFILE PENDING</span>
                </span>
              ) : (
                <a className="link-plain" href={person.fiverr} target="_blank" rel="noreferrer">
                  FIVERR <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
