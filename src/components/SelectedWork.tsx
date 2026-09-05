import Rail from './Rail';
import WorkOverlap from './WorkOverlap';
import WorkSplit from './WorkSplit';
import WorkBand from './WorkBand';
import { REVEALS } from '../content/work';

/**
 * `03` Selected work. The `wow` beat, density 2 rising to 3.
 *
 * Three reveals, three genuinely different silhouettes — overlap, split, band —
 * because alternating left and right is itself a pattern. They butt against one
 * another with a single hairline and zero vertical padding, so the section
 * reads as one continuous strip. All the air is inside the shapes.
 *
 * These three because they are the three repositories with externally
 * verifiable numbers against public datasets and public reference
 * implementations. The rest of the work is in the ledger and the Lab.
 */
export default function SelectedWork() {
  return (
    <section id="work" className="work" aria-labelledby="work-h">
      <div className="shell grid12">
        <Rail index="03" label="SELECTED WORK" status="3 OF 15" />
        <h2 id="work-h" className="work__h t-section">
          Three things you can check.
        </h2>
      </div>
      <div className="work__strip">
        <WorkOverlap reveal={REVEALS[0]} />
        <WorkSplit reveal={REVEALS[1]} />
        <WorkBand reveal={REVEALS[2]} />
      </div>
    </section>
  );
}
