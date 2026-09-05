import Rail from './Rail';
import ProofRow from './ProofRow';
import { PROOF_ROWS, PROOF_LEDE, PROOF_FOOTER } from '../content/proof';

/**
 * `05` Measured. The `result` beat, density 4.
 *
 * There are no client counts, project counts, country counts or testimonials on
 * this site, because we do not have them and inventing them is out of the
 * question. The deeper reason they are absent is that they are unfalsifiable,
 * and an engineering buyer prices an unfalsifiable claim at zero. Everything
 * here can be checked, and one of the numbers is deliberately unflattering.
 */
export default function Measured() {
  return (
    <section id="measured" className="meas" aria-labelledby="meas-h">
      <div className="shell grid12 meas__head">
        <Rail index="05" label="MEASURED" status="4 ROWS" />
        <h2 id="meas-h" className="t-section meas__h">
          Numbers you can run yourself.
        </h2>
        <p className="t-lede meas__lede">{PROOF_LEDE}</p>
      </div>
      <div className="shell meas__rows">
        {PROOF_ROWS.map((row) => (
          <ProofRow key={row.index} row={row} />
        ))}
        <p className="meas__foot t-mono-read rule2-t">
          {PROOF_FOOTER.text}{' '}
          <a className="link-signal" href="https://github.com/Pratyush150" target="_blank" rel="noreferrer">
            READ ANY OF IT <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </p>
        <p className="meas__foot-note t-mono-meta">{PROOF_FOOTER.detail}</p>
      </div>
    </section>
  );
}
