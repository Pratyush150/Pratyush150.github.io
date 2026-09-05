import { useEffect, useRef, useState } from 'react';
import Rail from './Rail';
import MediaWell from './MediaWell';
import { CAPABILITIES } from '../content';

/**
 * `02` Capability wall. Density 2, the `interaction` beat.
 *
 * This is where the rejected hero sequence is properly spent: the four worlds
 * are present simultaneously and the visitor drives them, which costs zero
 * seconds of the fifteen-second budget instead of nine.
 *
 * The four words are a real tablist — arrow keys move selection, Tab leaves the
 * group — so keyboard and screen-reader behaviour come from the semantics
 * rather than from extra code. Touch is the primary design: tab 0 is active on
 * load, so the plate is never empty. Hover is the enhancement, debounced by
 * 90ms so a pointer crossing the block does not fire four transitions.
 */
export default function CapabilityWall() {
  const [active, setActive] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const intend = (i: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(i), 90);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = CAPABILITIES.length - 1;
    let next = active;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const current = CAPABILITIES[active];

  return (
    <section id="capability" className="cap" aria-labelledby="cap-h">
      <div className="shell grid12 cap__grid">
        <Rail index="02" label="CAPABILITY" />
        <h2 id="cap-h" className="sr-only">
          What we work on
        </h2>

        <div
          className="cap__words"
          role="tablist"
          aria-orientation="vertical"
          aria-label="Capabilities"
          onKeyDown={onKeyDown}
        >
          {CAPABILITIES.map((c, i) => (
            <button
              key={c.word}
              type="button"
              role="tab"
              id={`cap-tab-${c.slug}`}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              aria-selected={i === active}
              aria-controls="cap-plate"
              tabIndex={i === active ? 0 : -1}
              className={`cap__word t-statement${i === active ? ' is-active' : ''}`}
              data-cursor={c.word}
              onMouseEnter={() => intend(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="cap__tick" aria-hidden="true" />
              {c.word}
            </button>
          ))}
        </div>

        <div
          className="cap__plate"
          id="cap-plate"
          role="tabpanel"
          aria-labelledby={`cap-tab-${current.slug}`}
          tabIndex={0}
        >
          <div className="cap__stack">
            {CAPABILITIES.map((c, i) => (
              <div
                key={c.word}
                className={`cap__layer${i === active ? ' is-active' : ''}`}
                aria-hidden={i === active ? undefined : true}
              >
                <MediaWell
                  id={c.clip}
                  aspect="4 / 3"
                  active={i === active}
                  caption={c.line}
                  figure={
                    <ul className="cap__spec t-mono-meta">
                      {c.stack.split(' · ').map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  }
                />
              </div>
            ))}
          </div>
          <p className="cap__meta t-mono-meta">
            <span className="cap__meta-word">{current.word}</span> {current.stack}
          </p>
        </div>
      </div>
    </section>
  );
}
