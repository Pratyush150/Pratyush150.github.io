/**
 * The `05 MEASURED` rows.
 *
 * Every figure here was read out of a repository's own committed benchmark
 * output, and the `command` field is the command that regenerates it. Where a
 * number is unflattering it is printed unflattered; see row 03.
 */

export type ProofTable = {
  caption: string;
  head: string[];
  rows: string[][];
  /** Index of the column to right-align as data. 0 is always the label. */
  numericFrom: number;
};

export type ProofRow = {
  index: string;
  numeral: string;
  measures: string;
  claim: string;
  repo: string;
  repoLabel: string;
  command: string;
  table: ProofTable;
  caveat: string;
  /** Words the command palette matches against. */
  keywords: string[];
};

export const PROOF_ROWS: ProofRow[] = [
  {
    index: '01',
    numeral: '1.256 %',
    measures:
      'KITTI odometry translation error · drive 2011_09_30_drive_0027 · 1,106 frames · 694.7 m',
    claim:
      'Stereo visual SLAM written from scratch — features, stereo matching, RANSAC PnP, a hand-written Gauss-Newton step on SE(3), windowed bundle adjustment and bag-of-words loop closure. Well-tuned stereo systems on KITTI land around 1%. Loop closure took this from 2.020% to 1.256%, and 21 of 21 accepted loop closures are correct: 1,062 candidates were rejected by the consistency gate, 467 for too few matches, 5 by geometry.',
    repo: 'https://github.com/Pratyush150/stereo-visual-slam',
    repoLabel: 'stereo-visual-slam',
    command:
      'git clone https://github.com/Pratyush150/stereo-visual-slam && cd stereo-visual-slam\npython3 tools/fetch_kitti.py --output data/kitti\npython3 benchmarks/run.py --sequence data/kitti/2011_09_30/2011_09_30_drive_0027_sync',
    table: {
      caption: 'Before and after loop closure, same run, same sequence.',
      head: ['', 'translation (%)', 'rotation (deg/m)', 'ATE RMSE (m)'],
      rows: [
        ['before loop closure', '2.020', '0.01125', '3.331'],
        ['after loop closure', '1.256', '0.01092', '1.276'],
      ],
      numericFrom: 1,
    },
    caveat:
      'The first full-sequence run scored 13.3%. Every descriptor match between consecutive keyframes was being turned into a landmark observation and roughly half of them were wrong; the per-frame poses were fine throughout. Gating the association on a reprojection check took odometry from 13.3% to 2.0%. That is in the repository, with the instrumented bundle-adjustment residuals that found it.',
    keywords: ['kitti', 'slam', 'ate', 'translation', 'loop closure', 'odometry'],
  },
  {
    index: '02',
    numeral: '0.0e+00',
    measures: 'largest absolute difference vs pycocotools, across all twelve COCO metrics',
    claim:
      'The COCO mAP metric implemented from the protocol rather than wrapped from a library, then checked against pycocotools on 367,010 real detections over 4,872 real COCO val2017 images. Identical on every one of the twelve metrics to every digit double precision has, including crowd-region handling and the area-band edge cases — and 32.5 s against the reference implementation’s 49.5 s.',
    repo: 'https://github.com/Pratyush150/object-detection-benchmark',
    repoLabel: 'object-detection-benchmark',
    command:
      'git clone https://github.com/Pratyush150/object-detection-benchmark && cd object-detection-benchmark\npython3 tools/fetch_assets.py --dest assets\npython3 benchmarks/verify_metric.py --annotations assets/annotations/instances_val2017.json --detections assets/cache/fp32_<hash>.json',
    table: {
      caption:
        'All twelve COCO metrics, both implementations, same 367,010 detections over the same 4,872 images.',
      head: ['metric', 'detbench', 'pycocotools', 'abs diff'],
      rows: [
        ['AP @ 0.50:0.95, all', '0.366292468048', '0.366292468048', '0.0e+00'],
        ['AP @ 0.50, all', '0.514783906518', '0.514783906518', '0.0e+00'],
        ['AP @ 0.75, all', '0.398023047115', '0.398023047115', '0.0e+00'],
        ['AP @ 0.50:0.95, small', '0.173954129172', '0.173954129172', '0.0e+00'],
        ['AP @ 0.50:0.95, medium', '0.404532620277', '0.404532620277', '0.0e+00'],
        ['AP @ 0.50:0.95, large', '0.520095107021', '0.520095107021', '0.0e+00'],
        ['AR @ 0.50:0.95, maxDets=1', '0.303619498914', '0.303619498914', '0.0e+00'],
        ['AR @ 0.50:0.95, maxDets=10', '0.493089837060', '0.493089837060', '0.0e+00'],
        ['AR @ 0.50:0.95, maxDets=100', '0.531297782877', '0.531297782877', '0.0e+00'],
        ['AR @ 0.50:0.95, small', '0.289230886977', '0.289230886977', '0.0e+00'],
        ['AR @ 0.50:0.95, medium', '0.592759654029', '0.592759654029', '0.0e+00'],
        ['AR @ 0.50:0.95, large', '0.706709325495', '0.706709325495', '0.0e+00'],
      ],
      numericFrom: 1,
    },
    caveat:
      'pycocotools is not a dependency of the package. It appears only in the test suite and in benchmarks/verify_metric.py, to hold the from-scratch implementation honest.',
    keywords: ['coco', 'map', 'pycocotools', 'mean average precision', 'metric'],
  },
  {
    index: '03',
    numeral: '−0.93 mAP',
    measures: 'for a 2.36× inference speed-up · static INT8 · YOLOv8n · same images, same CPU',
    claim:
      'What quantisation actually costs, measured rather than assumed: about one point of mAP for a 2.36× inference speed-up and a 3.5× smaller file. The same table carries the variant with the best latency in it and an mAP of exactly zero — quantise the decode tail along with the rest of the graph, check the result by looking at throughput, and you will ship that one.',
    repo: 'https://github.com/Pratyush150/object-detection-benchmark',
    repoLabel: 'object-detection-benchmark',
    command:
      'python3 benchmarks/run_sweep.py --assets assets --annotations assets/annotations/instances_val2017.json --images assets/val2017\npython3 benchmarks/run_latency.py --assets assets --sweep benchmarks/results/sweep.json',
    table: {
      caption:
        'YOLOv8n, ONNX Runtime on CPU, 4,872 val2017 images. The last row is the failure this benchmark exists to catch.',
      head: ['variant', 'size', 'mAP', 'Δ mAP', 'inference p50', 'speed-up'],
      rows: [
        ['fp32', '12.82 MB', '36.63', '—', '82.4 ms', '1.00×'],
        ['int8-static-c16', '3.66 MB', '35.70', '−0.93', '34.9 ms', '2.36×'],
        ['int8-static', '3.66 MB', '35.22', '−1.41', '35.8 ms', '2.30×'],
        ['int8-static-pertensor', '3.58 MB', '34.24', '−2.39', '34.2 ms', '2.41×'],
        ['int8-static-notail', '3.60 MB', '0.00', '−36.63', '28.3 ms', '2.91×'],
      ],
      numericFrom: 1,
    },
    caveat:
      'The unflattering number: Ultralytics publishes 37.3 mAP for YOLOv8n on val2017. This measures 36.63 on 4,872 images and 36.57 on all 5,000 with the same settings — about 0.7 points short. It is not a disagreement about the metric, which is verified above to twelve decimal places on these exact detections. The five causes are (1) single-label decode rather than multi-label NMS, (2) NMS at IoU 0.7 with 300 boxes, tuned per release upstream, (3) letterbox padding colour, upscaling and offset rounding, which move boxes by about a pixel where AP75 lives, (4) export settings — opset 13, static 640×640, no graph simplification, NMS outside the graph, and (5) 4,872 images rather than 5,000, because 128 are reserved for quantisation calibration; that split is worth 0.06 points. Every one of them is a command-line flag in the repository.',
    keywords: ['int8', 'quantisation', 'yolov8', 'latency', 'speedup', 'ultralytics', '37.3'],
  },
  {
    index: '04',
    numeral: '27.93 m → 0.180 m',
    measures:
      'sphere2500 absolute trajectory error · 2,500 poses · 4,949 constraints · 10 iterations, 2.8 s',
    claim:
      'A pose-graph SLAM back end on NumPy and SciPy sparse — no g2o, no GTSAM, no Ceres, no scipy.optimize. Twelve standard g2o datasets, and the same twelve optimised again with GTSAM 4.2 through its Python bindings purely to produce an outside number. On the nine where both solvers converge normally the final costs agree to within 0.3%, and on five of them to three or more significant figures.',
    repo: 'https://github.com/Pratyush150/pose-graph-slam',
    repoLabel: 'pose-graph-slam',
    command:
      'git clone https://github.com/Pratyush150/pose-graph-slam && cd pose-graph-slam\npython3 tools/fetch_datasets.py intel manhattan manhattan_gt sphere2500 sphere2500_gt\npython3 benchmarks/run_benchmarks.py\npython3 tools/gtsam_crosscheck.py   # the outside column',
    table: {
      caption:
        'Final chi-squared, ours against GTSAM 4.2 on the identical files. Both run untuned: default LevenbergMarquardtParams, a tight prior on the first pose.',
      head: ['dataset', 'our final chi2', 'GTSAM final chi2', 'agreement'],
      rows: [
        ['CSAIL', '40.55', '40.56', 'same to 3+ figures'],
        ['intel', '45', '45.01', 'same to 3+ figures'],
        ['parking-garage', '1.268', '1.268', 'same to 3+ figures'],
        ['manhattan', '3549', '3549', 'same to 3+ figures'],
        ['sphere2500', '1351', '1351', 'same to 3+ figures'],
        ['cubicle', '2746', '2749', 'within 0.1%'],
        ['torus3D', '5.99e+04', '5.996e+04', 'within 0.1%'],
        ['tinyGrid3D', '18.63', '18.66', 'within 0.2%'],
        ['smallGrid3D', '1036', '1039', 'within 0.3%'],
        ['sphere_bignoise', '7.370e+06', '7.814e+06', 'ours lower by 6%'],
        ['city10000', '512', '1.836e+07', 'ours lower by 4 orders'],
        ['MIT', '770.2', '4.414e+09', 'GTSAM took no step'],
      ],
      numericFrom: 1,
    },
    caveat:
      'Reading the last three rows honestly: on sphere_bignoise, city10000 and MIT the two solvers did not land in the same place, and ours landed lower. That is not a claim to have beaten GTSAM — it is an untuned comparison in both directions, and torus3D and sphere_bignoise are local minima on our side too. The repository says so in the same table.',
    keywords: ['gtsam', 'pose graph', 'sphere2500', 'chi2', 'city10000', 'ate'],
  },
];

/**
 * The closing line under the four rows. Counted, not estimated:
 * `pytest --collect-only` across every repository that has a suite, plus the
 * `it()`/`test()` blocks in the two TypeScript ones. Includes
 * `swarm-path-planning` (224 tests), which is now public with CI.
 */
export const PROOF_FOOTER = {
  text: '3,449 TESTS COLLECTED · 16 REPOSITORIES · A CI WORKFLOW ON EVERY ONE',
  detail:
    'Collected with pytest on the fourteen Python repositories and counted as it()/test() blocks in the two TypeScript ones. Sixteen repositories, sixteen workflow files.',
};

export const PROOF_LEDE =
  'Every number on this page was produced by code in a public repository, on a public dataset, and the command that produces it is printed beside it.';
