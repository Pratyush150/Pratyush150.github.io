/**
 * Real artefacts: captured stdout, a real source excerpt, the real pipeline.
 * Nothing in this file is illustrative. Each block names its source file.
 */

/** stereo-visual-slam/README.md lines 112-141 — "Real output from the command above". */
export const SLAM_TERMINAL: { text: string; tone?: 'warn' | 'ok' }[] = [
  { text: '$ python3 benchmarks/run.py --sequence data/kitti/2011_09_30/2011_09_30_drive_0027_sync' },
  { text: 'sequence      : data/kitti/2011_09_30/2011_09_30_drive_0027_sync' },
  { text: 'frames        : 0..1106 of 1106' },
  { text: 'baseline      : 0.5372 m' },
  { text: 'focal length  : 707.09 px' },
  { text: 'machine       : 11th Gen Intel(R) Core(TM) i5-1135G7 @ 2.40GHz, 8 logical cores' },
  { text: 'vocabulary    : training on 60 held-out frames (200..800 step 10)' },
  { text: '                trained in 73.8 s' },
  { text: 'running pipeline ...' },
  { text: '  frame   400  keyframes  129  landmarks  10168  tracked  195' },
  { text: '  frame   800  keyframes  251  landmarks  15666  tracked   49', tone: 'warn' },
  { text: '====================================================================' },
  { text: 'frames processed        : 1106' },
  { text: 'keyframes               : 348' },
  { text: 'landmarks               : 21393' },
  { text: 'mean tracked features   : 163.6' },
  { text: 'loop closures accepted  : 21' },
  {
    text: "loop gate counters      : {'queries': 347, 'appearance_candidates': 1555, 'rejected_consistency': 1062, 'rejected_few_matches': 467, 'rejected_geometry': 5, 'accepted': 21}",
  },
  { text: 'translation error       : 1.256 %', tone: 'ok' },
  { text: 'rotation error          : 0.01092 deg/m', tone: 'ok' },
  { text: 'ATE RMSE                : 1.276 m', tone: 'ok' },
  { text: 'ground-truth path       : 694.7 m' },
  { text: 'estimated path          : 696.6 m' },
];

export const SLAM_TERMINAL_SUMMARY =
  'Captured terminal output from benchmarks/run.py on KITTI raw drive 2011_09_30_drive_0027. It processes 1,106 frames into 348 keyframes and 21,393 landmarks, accepts 21 loop closures out of 1,555 appearance candidates, and scores 1.256% translation error, 0.01092 degrees per metre of rotation error and 1.276 m absolute trajectory error over a 694.7 m ground-truth path.';

/**
 * stereo-visual-slam/src/svslam/loop/detector.py, lines 201-218.
 * The temporal-consistency gate: 1,062 of 1,555 appearance candidates die here,
 * which is the single largest contributor to 21-of-21 loop-closure precision.
 */
export type CodeLine = { n: number; text: string; role?: 'comment' | 'signal' };

export const SLAM_CODE: CodeLine[] = [
  { n: 201, text: '# Temporal consistency: a candidate region must persist across queries.', role: 'comment' },
  { n: 202, text: 'current = {c.candidate_id for c in candidates}' },
  { n: 203, text: 'consistent: list[LoopCandidate] = []' },
  { n: 204, text: 'new_counts: dict[int, int] = {}' },
  { n: 205, text: 'for c in candidates:' },
  { n: 206, text: '    near_previous = any(' },
  { n: 207, text: '        abs(c.candidate_id - prev) <= cfg.temporal_exclusion' },
  { n: 208, text: '        for prev in self._previous_candidates' },
  { n: 209, text: '    )' },
  { n: 210, text: '    count = (self._consistency.get(c.candidate_id, 0) + 1) if near_previous else 1' },
  { n: 211, text: '    new_counts[c.candidate_id] = count' },
  { n: 212, text: '    if count >= cfg.consistency_required:', role: 'signal' },
  { n: 213, text: '        consistent.append(c)' },
  { n: 214, text: '    else:' },
  { n: 215, text: '        self.stats.rejected_consistency += 1' },
  { n: 216, text: 'self._previous_candidates = current' },
  { n: 217, text: 'self._consistency = new_counts' },
  { n: 218, text: 'return consistent' },
];

export const SLAM_CODE_SOURCE = 'src/svslam/loop/detector.py — lines 201-218';
export const SLAM_CODE_NOTE =
  'Two sightings before a candidate is allowed to become a loop. 1,062 of 1,555 die on this line, and the 21 that survive are all correct.';

/** The seven pipeline stages, in order. `critical` is drawn in amber. */
export const PIPELINE = [
  { id: 'kitti', label: 'KITTI stereo pair', critical: false },
  { id: 'feat', label: 'feature detect + bucket', critical: false },
  { id: 'stereo', label: 'stereo match, epipolar + LR check', critical: false },
  { id: 'pnp', label: 'RANSAC PnP', critical: true },
  { id: 'gn', label: 'Gauss-Newton SE(3)', critical: true },
  { id: 'ba', label: 'windowed bundle adjustment', critical: true },
  { id: 'loop', label: 'BoW loop closure', critical: false },
];

export const PIPELINE_FAILURE = {
  onEdge: 'ba',
  text: '40 px reprojection error → keyframes moved 2–4 m',
};

export const RULED_OUT = [
  'The odometry itself. Raw frame-to-frame steps matched ground truth to a few centimetres the whole time, which is why the error was invisible in every per-frame diagnostic.',
  'Feature quality. A ratio test plus a mutual-best cross-check was already in place; the matcher was not the problem, trusting it was.',
  'A tuning problem in bundle adjustment. Instrumenting the windows showed them starting at 34–72 px reprojection RMSE and finishing at 32–60. The optimiser was not failing to converge, it was converging on a contradiction.',
  'The motion plausibility gate, which was added second and masked part of the symptom. With the association bug fixed it fires zero times on this drive, and the ablation table in the repository says so rather than quietly keeping the credit.',
];

/** The Lab: things built to answer a question, shipped or abandoned. */
export type LabTile = {
  question: string;
  line: string;
  status: 'SHIPPED' | 'IN PROGRESS' | 'ABANDONED';
  href?: string;
  clip?: string;
  /** Names what the clip shows and on what data. Required wherever `clip` is. */
  clipCaption?: string;
  span: string;
};

export const LAB_TILES: LabTile[] = [
  {
    question: 'Can a robot work out where it is from two cameras and nothing else?',
    line: 'Stereo visual SLAM from scratch. 1.256% translation error over 694.7 m of KITTI, 21 of 21 loop closures correct.',
    status: 'SHIPPED',
    href: 'https://github.com/Pratyush150/stereo-visual-slam',
    span: 'lab-a',
  },
  {
    question: 'Can a pose graph disagree with itself?',
    line: 'A back end on NumPy, cross-checked against GTSAM 4.2 on twelve g2o datasets. It agrees on nine and lands lower on three.',
    status: 'SHIPPED',
    href: 'https://github.com/Pratyush150/pose-graph-slam',
    clip: 'posegraph-sphere2500-converging',
    clipCaption:
      'sphere2500 converging, drawn from the solver’s own per-iteration state: 2,500 poses, 4,949 constraints, ten iterations.',
    span: 'lab-b',
  },
  {
    question: 'What does INT8 actually cost?',
    line: 'One point of mAP for 2.36× — and one recipe that is 2.91× faster and detects nothing at all.',
    status: 'SHIPPED',
    href: 'https://github.com/Pratyush150/object-detection-benchmark',
    span: 'lab-c',
  },
  {
    question: 'Can a swarm avoid itself when one agent is late?',
    line: 'CBS, ECBS and prioritised planning over the standard MAPF benchmark maps, plus a dependency-graph execution layer. Across 1,119 measured runs, zero invalid plans. At 40 agents on random-32-32-20, plain CBS solves none and ECBS at w=1.1 solves all of them; a three-tick delay on one agent costs a fixed timetable its separation and the dependency graph none.',
    status: 'SHIPPED',
    href: 'https://github.com/Pratyush150/swarm-path-planning',
    span: 'lab-d',
  },
  {
    question: 'Can a bag-of-words vocabulary be small and still find a revisit?',
    line: 'Dropping the vocabulary from 1000 words to 400 collapsed top-3 loop recall from 0.71 to 0.35. Abandoned: the memory it saved was not worth the recall it cost, and the tuning note in the repository records the dead end rather than deleting it.',
    status: 'ABANDONED',
    href: 'https://github.com/Pratyush150/stereo-visual-slam',
    span: 'lab-e',
  },
  {
    question: 'Can detections be scored without trusting the scorer?',
    line: 'The COCO protocol implemented twice — once here, once by pycocotools — and asserted equal on 367,010 detections.',
    status: 'SHIPPED',
    href: 'https://github.com/Pratyush150/object-detection-benchmark',
    clip: 'detection-coco-val2017',
    clipCaption:
      'YOLOv8n detections on real COCO val2017 photographs, including a genuine failure case.',
    span: 'lab-f',
  },
];
