import Rail from './Rail';
import Portrait from './Portrait';
import { ABOUT } from '../content';

/**
 * `09` Who you would actually be working with.
 *
 * Shape: a two-pane split — the portrait plate held in the narrow left track,
 * prose in the wide right one. Every other section on this page is either
 * full-bleed, a rule with things hung off it, or a table; this is the only
 * place a photograph and running prose sit side by side, so it does not repeat
 * the shape of the process rail above it or the contact band below it.
 *
 * The numbered notes are set as hanging indents rather than a list, because
 * they are commitments about how the work runs, not features.
 */
export default function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-h">
      <div className="shell grid12">
        <Rail index="09" label="WHO" status={ABOUT.status} />

        <div className="about__plate">
          <Portrait />
        </div>

        <div className="about__body">
          <h2 id="about-h" className="about__h t-section">
            {ABOUT.heading}
          </h2>

          {ABOUT.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="about__p t-body">
              {p}
            </p>
          ))}

          <blockquote className="about__pull">{ABOUT.pull}</blockquote>

          <dl className="about__notes">
            {ABOUT.notes.map((n, i) => (
              <div key={n.title} className="about__note">
                <dt className="t-mono-meta">
                  {String(i + 1).padStart(2, '0')} — {n.title}
                </dt>
                <dd className="t-body">{n.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
