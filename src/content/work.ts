/**
 * `03` Selected work — the three repositories with externally verifiable
 * numbers against public datasets and public reference implementations.
 * Three reveals, three shapes, no shared silhouette.
 *
 * Every field of every metadata line differs between the three. A field that
 * would read the same on all three is not a field.
 */

export type Reveal = {
  numeral: string;
  slug: string;
  title: string;
  /** Real, checkable, non-interchangeable. Rendered as one mono line. */
  meta: string;
  clip: string | null;
  aspect: string;
  caption: string;
  href: string;
  linkLabel: string;
};

export const REVEALS: Reveal[] = [
  {
    numeral: '01',
    slug: 'stereo-visual-slam',
    title: 'Stereo visual SLAM, written from scratch',
    meta: 'ROBOTICS · ESTIMATION — KITTI 2011_09_30/0027, 1,106 frames, 694.7 m — 1.256% TRANS · 0.01092 DEG/M · ATE 1.276 M · 21/21 LOOPS',
    clip: 'svslam-kitti-trajectory',
    aspect: '1 / 1',
    caption:
      'The estimated trajectory drawing itself against OXTS ground truth on KITTI raw 2011_09_30_drive_0027_sync, and snapping shut when the loop closes. 1,106 stereo frames, 348 keyframes, 21 loop closures, ATE RMSE 3.33 m to 1.29 m. Rendered from the run’s own pose output.',
    href: '#case',
    linkLabel: 'VIEW CASE',
  },
  {
    numeral: '02',
    slug: 'object-detection-benchmark',
    title: 'A COCO metric that matches the reference exactly',
    meta: 'AI · PERCEPTION — COCO val2017, 4,872 images, 367,010 detections — mAP 36.63 · 0.0e+00 vs PYCOCOTOOLS · INT8 −0.93 FOR 2.36×',
    clip: 'detection-coco-val2017',
    aspect: '16 / 9',
    caption:
      'YOLOv8n detections on real COCO val2017 photographs, decoded and drawn by the benchmark. The boxes are the ones the 36.63 mAP figure is computed over.',
    href: 'https://github.com/Pratyush150/object-detection-benchmark',
    linkLabel: 'READ THE CODE',
  },
  {
    numeral: '03',
    slug: 'pose-graph-slam',
    title: 'A pose-graph back end on NumPy',
    meta: 'ROBOTICS · OPTIMISATION — 12 g2o DATASETS, sphere2500 2,500 POSES / 4,949 EDGES — ATE 27.93 M → 0.180 M IN 10 ITERATIONS, 2.8 S',
    clip: 'posegraph-sphere2500-converging',
    aspect: '21 / 9',
    caption:
      'The sphere2500 pose graph converging, rendered from the solver’s own per-iteration state: 2,500 poses and 4,949 constraints, absolute trajectory error 27.93 m to 0.180 m in ten iterations.',
    href: 'https://github.com/Pratyush150/pose-graph-slam',
    linkLabel: 'READ THE CODE',
  },
];

/** `04` The case study, on reveal 01. Five beats. */
export const CASE = {
  /**
   * From the repository's own README, unedited. Split into lines at build time
   * rather than by a runtime text-splitter, because the masked-line reveal
   * needs one wrapper per line and a split-text library is not worth 12 KB.
   */
  problem: [
    'A robot with a camera and no external',
    'positioning has to work out its own motion',
    'from what it sees. Errors compound, and',
    'wrong data is silent.',
  ],
  moment: {
    before: { ate: '3.331 m', trans: '2.020 %' },
    after: { ate: '1.276 m', trans: '1.256 %' },
  },
  result: [
    {
      numeral: '1.256 %',
      line: 'KITTI 09_30/0027\ntranslation error over 694.7 m',
    },
    {
      numeral: '21 / 21',
      line: 'accepted loop closures correct\n1,555 candidates, 1,534 rejected',
    },
    {
      numeral: '0.0e+00',
      line: 'largest abs. difference vs pycocotools\nacross all twelve COCO metrics',
    },
  ],
  reproduce:
    'git clone https://github.com/Pratyush150/stereo-visual-slam && python3 benchmarks/run.py --sequence data/kitti/2011_09_30/2011_09_30_drive_0027_sync',
};
