import Rail from './Rail';
import LabTile from './LabTile';
import { LAB_TILES } from '../content/artefacts';

/**
 * `07` The Lab. It must look different from the rest of the site, and its
 * distinctness comes from rules rather than a new palette: the ground drops to
 * `--bg-void` and the hairlines invert, so this is the only section that uses
 * boxes at all. Spans are irregular and hand-placed; no two rows repeat.
 *
 * No reveal animation anywhere in here. After the case study's choreography, a
 * section that is simply already there reads as confidence.
 *
 * One tile is ABANDONED with the reason. Publishing a dead end is the strongest
 * signal that the rest is real.
 */
export default function Lab() {
  return (
    <section id="lab" className="lab" aria-labelledby="lab-h" data-bleed>
      <div className="shell grid12">
        <Rail index="07" label="THE LAB" status="6 QUESTIONS" />
        <h2 id="lab-h" className="t-section lab__h">
          Things we wanted to know.
        </h2>
      </div>
      <div className="shell">
        <div className="lab__field">
          {LAB_TILES.map((t) => (
            <LabTile key={t.question} tile={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
