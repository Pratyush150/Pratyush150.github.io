import { PIPELINE, PIPELINE_FAILURE } from '../content/artefacts';
import { useInView } from '../lib/reveal';

/**
 * `02 THE IDEA` — the pipeline as a hairline architecture diagram that
 * assembles on entry: square-cornered nodes, 1px connectors with solid
 * triangle heads, the critical path drawn in amber, and one annotated failure
 * marker on the edge that actually failed. Inline SVG, no library.
 */
export default function PipelineDiagram() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <div ref={ref} className={`pipe${inView ? ' is-in' : ''}`}>
      <ol className="pipe__list">
        {PIPELINE.map((n, i) => (
          <li
            key={n.id}
            className={`pipe__node${n.critical ? ' is-critical' : ''}`}
            style={{ ['--i' as string]: String(Math.min(i, 2)) }}
          >
            <span className="pipe__idx t-mono-read" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="pipe__label t-mono-meta">{n.label}</span>
            {i < PIPELINE.length - 1 ? (
              <span className="pipe__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 8" focusable="false">
                  <path d="M0 4h16" stroke="currentColor" strokeWidth="1" fill="none" />
                  <path d="M16 1l6 3-6 3z" fill="currentColor" />
                </svg>
              </span>
            ) : null}
            {n.id === PIPELINE_FAILURE.onEdge ? (
              <span className="pipe__fail t-mono-read">{PIPELINE_FAILURE.text}</span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
