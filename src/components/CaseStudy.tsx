import Rail from './Rail';
import MediaWell from './MediaWell';
import Terminal from './Terminal';
import PipelineDiagram from './PipelineDiagram';
import LoopSnap from './LoopSnap';
import { CASE } from '../content/work';
import { RULED_OUT } from '../content/artefacts';
import { useInView } from '../lib/reveal';

/**
 * `04` Case study — one, in-page, on `stereo-visual-slam`. Not three: three at
 * this length is a magazine, one is a demonstration.
 *
 * Five beats, alternating ground, density `1 → 2 → 5 → 3 → 1`. That is the
 * actual cinematic move — whisper, explain, overwhelm, resolve, land — and beat
 * 03 is deliberately the densest screen on the site.
 */
export default function CaseStudy() {
  const [problemRef, problemIn] = useInView<HTMLParagraphElement>({ threshold: 0.4 });

  return (
    <section id="case" className="case" aria-labelledby="case-h">
      <h2 id="case-h" className="sr-only">
        Case study: stereo visual SLAM on KITTI
      </h2>

      {/* 01 THE PROBLEM — density 1. The empty screen is the beat. */}
      <div className="beat beat--problem" data-bleed>
        <div className="shell grid12">
          <Rail index="04" label="CASE STUDY" status="STEREO VISUAL SLAM" />
          <p
            ref={problemRef}
            className={`beat__statement t-statement${problemIn ? ' is-in' : ''}`}
          >
            {CASE.problem.map((line) => (
              <span key={line} className="ln_">
                <span className="ln">{line}</span>
              </span>
            ))}
          </p>
          <p className="beat__label t-mono-read eyebrow">01 — THE PROBLEM</p>
        </div>
      </div>

      {/* 02 THE IDEA — density 2. */}
      <div className="beat beat--idea">
        <div className="shell grid12">
          <p className="beat__label t-mono-read eyebrow">02 — THE IDEA</p>
          <h3 className="beat__h t-section">Seven stages, and one of them lies.</h3>
          <div className="beat__pipe">
            <PipelineDiagram />
          </div>
        </div>
      </div>

      {/* 03 BUILD — density 5. It should feel like a different website. */}
      <div className="beat beat--build" data-bleed>
        <div className="shell">
          <p className="beat__label t-mono-read eyebrow">03 — BUILD</p>
          <h3 className="beat__h-sm t-mono-read">
            13.3 % → 2.0 % → 1.26 %, AND WHY THE MIDDLE STEP WAS NOT A TUNING PROBLEM
          </h3>
          <div className="build__cols">
            <Terminal />
            <div className="build__media">
              <MediaWell
                id="svslam-kitti-tracked-features"
                aspect="16 / 9"
                caption="Tracked features and flow vectors on the real rectified KITTI frames of drive 2011_09_30_drive_0027_sync, inliers and rejections distinguished. Mean 163.6 tracked features per frame."
              />
            </div>
          </div>
          <div className="build__ruled">
            <h4 className="t-mono-read eyebrow">RULED OUT</h4>
            <ul className="build__list t-body">
              {RULED_OUT.map((r) => (
                <li key={r.slice(0, 24)} className="row-sep">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 04 THE MOMENT — density 3. */}
      <div className="beat beat--moment" data-bleed>
        <div className="shell">
          <p className="beat__label t-mono-read eyebrow">04 — THE MOMENT</p>
          <div className="moment__grid">
            <LoopSnap />
            <div className="moment__clip">
              <MediaWell
                id="svslam-kitti-trajectory"
                aspect="1 / 1"
                caption="The same run, animated from its own pose output: the estimate drawing itself against OXTS ground truth and snapping shut when the loop closes. 348 keyframes, 21 loop closures."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 05 RESULT — density 1. */}
      <div className="beat beat--result">
        <div className="shell grid12">
          <p className="beat__label t-mono-read eyebrow">05 — RESULT</p>
          <dl className="result__row">
            {CASE.result.map((r) => (
              <div key={r.numeral} className="result__item">
                <dt className="t-figure-num">{r.numeral}</dt>
                <dd className="t-mono-meta">
                  {r.line.split('\n').map((l) => (
                    <span key={l} className="result__line">
                      {l}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="result__repro t-mono-read rule2-t">
            REPRODUCE: <code>{CASE.reproduce}</code>
          </p>
        </div>
      </div>
    </section>
  );
}
