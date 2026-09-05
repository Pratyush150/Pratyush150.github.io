import { useEffect, useRef, useState } from 'react';
import Rail from './Rail';
import { STACK_LAYERS, LIMITS } from '../content';

/**
 * `06` Under the hood. Not a logo soup and not a chip farm: a sticky two-pane
 * where the left lists the five layers and the right scrolls through them, with
 * an observer marking the active layer. Technologies are set as a mono sentence
 * separated by `·`, never as chips and never as logos.
 *
 * Each layer carries one line only somebody who has done it would write — the
 * failure mode that layer produces. That line is what turns a stack list into
 * evidence. The section closes with LIMITS, which is the most persuasive block
 * in it for exactly that reason.
 */
export default function UnderTheHood() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = refs.current.indexOf(e.target as HTMLElement);
          if (i !== -1) setActive(i);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="stack" className="hood" aria-labelledby="hood-h">
      <div className="shell grid12">
        <Rail index="06" label="UNDER THE HOOD" status={STACK_LAYERS[active].name} />
        <h2 id="hood-h" className="t-section hood__h">
          Five layers, and the way each one fails.
        </h2>

        <nav className="hood__index" aria-label="Stack layers">
          <ol className="t-mono-read">
            {STACK_LAYERS.map((l, i) => (
              <li key={l.id} className={i === active ? 'is-active' : ''}>
                <span className="hood__tick" aria-hidden="true" />
                <a className="link-plain" href={`#layer-${l.id}`}>
                  {l.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="hood__panes">
          {STACK_LAYERS.map((l, i) => (
            <article
              key={l.id}
              id={`layer-${l.id}`}
              className="hood__pane rule-t"
              ref={(el) => {
                refs.current[i] = el;
              }}
            >
              <p className="t-mono-read eyebrow">{l.name}</p>
              <h3 className="t-section hood__pane-h">{l.title}</h3>
              <p className="t-body">{l.body}</p>
              <p className="hood__stack t-mono-meta">{l.stack}</p>
              <p className="hood__fail t-mono-meta">{l.failure}</p>
            </article>
          ))}
        </div>

        <div className="hood__limits">
          <h3 className="t-mono-read eyebrow">LIMITS</h3>
          <ul className="t-body">
            {LIMITS.map((t) => (
              <li key={t.slice(0, 20)} className="row-sep">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
