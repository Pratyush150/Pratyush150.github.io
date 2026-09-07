import { useId, useState } from 'react';
import type { ProofRow as Row } from '../content/proof';

/**
 * One hairline ledger row. The whole row is the hit target and it is a real
 * `<button aria-expanded aria-controls>`, so Enter and Space open it. Expanded,
 * it shows the command that reproduces the number, the relevant table as a real
 * `<table>`, and one caveat stated plainly. The caveat is not a disclaimer; it
 * is the proof that the number is a measurement.
 *
 * Rows do not animate on scroll and do not stagger, and any number of them may
 * be open at once.
 */
export default function ProofRow({ row }: { row: Row }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(row.command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="pr rule-t">
      <button
        type="button"
        className="pr__row"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="pr__idx t-mono-read eyebrow">{row.index}</span>
        <span className="pr__num">
          <span className="t-figure-num">{row.numeral}</span>
          <span className="pr__measures t-mono-meta">{row.measures}</span>
        </span>
        <span className="pr__claim t-body">{row.claim}</span>
        <span className="pr__act t-mono-read">
          <span className="pr__repo">{row.repoLabel}</span>
          <span aria-hidden="true">{open ? '×' : '+'}</span>
        </span>
      </button>

      <div id={id} className={`pr__panel${open ? ' is-open' : ''}`} hidden={!open}>
        <div className="pr__panel-in">
          <div className="pr__cmd">
            <h3 className="t-mono-read eyebrow">REPRODUCE</h3>
            <pre className="t-mono-code">{row.command}</pre>
            <button type="button" className="ctl t-mono-read pr__copy" onClick={copy}>
              {copied ? 'COPIED' : 'COPY COMMAND'}
            </button>
          </div>
          <div className="pr__table-wrap">
            <table className="tbl t-mono-meta">
              <caption className="t-mono-read eyebrow">{row.table.caption}</caption>
              <thead>
                <tr>
                  {row.table.head.map((h, i) => (
                    <th key={h || i} scope="col" className={i >= row.table.numericFrom ? 'num' : ''}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {row.table.rows.map((r) => (
                  <tr key={r[0]}>
                    <th scope="row">{r[0]}</th>
                    {r.slice(1).map((c, i) => (
                      <td key={i} className="num">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="pr__caveat t-body">{row.caveat}</p>
          <p className="t-mono-read">
            <a className="link-signal" href={row.repo} target="_blank" rel="noreferrer">
              READ THE REPOSITORY <span className="arrow" aria-hidden="true">↗</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
