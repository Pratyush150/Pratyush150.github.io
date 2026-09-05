import { useEffect, useRef, useState } from 'react';
import Rail from './Rail';
import { processSteps } from '../content';

/**
 * `08` Process. Seven stages hung off a single 1px rule, odd stops above and
 * even below, so the section has a physical zig-zag rather than seven equal
 * cards. An amber segment grows along the rule with scroll position — the one
 * place scroll drives an animation on this site.
 *
 * The stage names are the client's seven. The *copy* hanging off stages 2, 3, 4
 * and 7 is the four real steps from the content file, because "paid diagnosis
 * first, and the report stands on its own" is a commercial commitment and
 * therefore better selling copy than any generic stage name.
 */
const STAGES = [
  { name: 'IDEA', from: null as number | null },
  { name: 'DISCOVERY', from: 0 },
  { name: 'PROTOTYPE', from: 1 },
  { name: 'ENGINEERING', from: 2 },
  { name: 'TESTING', from: null },
  { name: 'DEPLOYMENT', from: null },
  { name: 'MAINTENANCE', from: 3 },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const span = r.height + window.innerHeight;
        const seen = window.innerHeight - r.top;
        setProgress(Math.max(0, Math.min(1, seen / span)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="process" className="proc" aria-labelledby="proc-h">
      <div className="shell grid12">
        <Rail index="08" label="PROCESS" />
        <h2 id="proc-h" className="t-section proc__h">
          How an engagement runs.
        </h2>
      </div>
      <div className="shell" ref={ref}>
        <ol className="proc__rail">
          <li className="proc__line" aria-hidden="true">
            <span className="proc__trace" style={{ transform: `scaleX(${progress})` }} />
          </li>
          {STAGES.map((s, i) => {
            const step = s.from === null ? null : processSteps[s.from];
            return (
              <li key={s.name} className={`proc__stop${i % 2 === 0 ? ' is-up' : ' is-down'}`}>
                <span className="proc__n t-mono-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="proc__name t-mono-read">{s.name}</span>
                {step ? (
                  <span className="proc__detail">
                    <span className="proc__title t-body">{step.title}</span>
                    <span className="proc__body t-mono-meta">{step.detail}</span>
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="shell grid12">
        <p className="proc__claim t-section">
          One team. One conversation. End-to-end execution.
        </p>
        <p className="proc__refuse t-body">We say no to work we would do badly.</p>
      </div>
    </section>
  );
}
