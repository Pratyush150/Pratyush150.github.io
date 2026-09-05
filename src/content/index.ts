export {
  person,
  contact,
  processSteps,
  categories,
  projects,
} from './content.generated';
export type { PaletteProject } from './content.generated';

export const REPO_OWNER = 'https://github.com/Pratyush150';

/** The four capability words of the wall, in the order they are read. */
export const CAPABILITIES = [
  {
    word: 'SOFTWARE',
    slug: 'product',
    stack: 'React · React Native · TypeScript · FastAPI · SQLite · WebSocket · Vite',
    line: 'Dashboards, ground stations and mobile apps, written by the same people who write the real-time code underneath.',
    clip: 'fleet-ops-dashboard',
    figure: 'stack' as const,
  },
  {
    word: 'AI',
    slug: 'automation-ai',
    stack: 'ONNX Runtime · YOLOv8 · INT8 quantisation · pycocotools · RAG · evaluation harnesses',
    line: 'Perception and retrieval that are measured rather than asserted — every model ships with the benchmark that scores it.',
    clip: 'detection-coco-val2017',
    figure: null,
  },
  {
    word: 'ROBOTICS',
    slug: 'robotics-control',
    stack: 'ROS 2 Humble · PX4 · ArduPilot · MAVLink · rclpy · rosbag2 · Gazebo · Jetson',
    line: 'Autonomy that ships to real vehicles: MAVLink bridges, bringup, SLAM, state estimation and the failure modes that only appear in metal.',
    clip: 'svslam-kitti-tracked-features',
    figure: null,
  },
  {
    word: 'AUTOMATION',
    slug: 'simulation-testing',
    stack: 'Modbus TCP/RTU · OPC-UA · MQTT Sparkplug B · DAG runners · historians · scenario regression',
    line: 'Acquisition, alarms and workflow engines with real retry and resume semantics, plus the simulation harness that regression-tests them.',
    clip: 'posegraph-sphere2500-converging',
    figure: null,
  },
];

/** Five layers, each with the failure mode that layer actually produces. */
export const STACK_LAYERS = [
  {
    id: 'boundary',
    name: 'BOARD BOUNDARY',
    title: 'Someone else\'s board, and what our code has to survive on it',
    body: 'Pixhawk-class autopilots, Jetson and Raspberry Pi companions, serial and USB links, encoders, Modbus devices — your hardware, not ours. We write the firmware and the drivers that run on it and the software that talks to it. Everything below this line has a physical failure mode that has to be handled in code.',
    stack: 'Pixhawk · Jetson Orin/Nano · Raspberry Pi · RS-485 · USB CDC-ACM · quadrature encoders',
    failure:
      'BOARD BOUNDARY — the USB port renumbers between boots, so /dev/ttyACM0 is a different device than it was yesterday and the bringup script is confidently wrong.',
  },
  {
    id: 'firmware',
    name: 'FIRMWARE & TRANSPORT',
    title: 'The link, and everything that lies about it',
    body: 'MAVLink over serial, UDP and TCP; rate control, offboard setpoints and link diagnostics. A heartbeat tells you the link is up. It does not tell you the stream is alive.',
    stack: 'MAVLink 2 · pymavlink · MAVROS · PX4 · ArduPilot · pyserial · 8N1 bandwidth modelling',
    failure:
      'TRANSPORT — ATTITUDE keeps arriving at a perfect 10 Hz with a timestamp that stopped advancing when the autopilot browned out, and every downstream node keeps publishing the last good value.',
  },
  {
    id: 'middleware',
    name: 'MIDDLEWARE',
    title: 'ROS 2, and the acquisition layer for machines that are not robots',
    body: 'Bringup, lifecycle, geodesy, missions, geofence and state machines on the robot side; Modbus and OPC-UA acquisition with alarms and a historian on the plant side.',
    stack: 'ROS 2 Humble · rclpy · DDS · rosbag2 · Modbus TCP/RTU · OPC-UA · MQTT Sparkplug B',
    failure:
      'MIDDLEWARE — a Modbus device reverses its word order on a firmware update and the historian records a plausible number that is off by a factor of 65,536.',
  },
  {
    id: 'perception',
    name: 'PERCEPTION & ESTIMATION',
    title: 'Where wrong data is silent',
    body: 'Stereo and LiDAR SLAM, pose-graph back ends, PnP and Gauss-Newton on SE(3), Kalman and extended Kalman filters, detection and tracking on the edge.',
    stack: 'OpenCV · NumPy · SciPy sparse · ONNX Runtime · g2o file format · KITTI · COCO',
    failure:
      'ESTIMATION — nothing throws. The bundle adjustment starts from a 40-pixel reprojection error, arbitrates between contradictory observations, and resolves it by moving keyframes two to four metres.',
  },
  {
    id: 'interface',
    name: 'INTERFACE',
    title: 'The part the operator actually touches',
    body: 'Fleet dashboards, ground stations, mobile telemetry apps. Built against the same message definitions as the robot, so a schema change breaks the build rather than the shift.',
    stack: 'React · React Native · TypeScript · WebSocket · Vite · Vitest',
    failure:
      'INTERFACE — the dashboard renders a stale value indistinguishably from a fresh one, and the operator trusts it for four hours.',
  },
];

export const LIMITS = [
  'What runs offline: every benchmark and every test on this page. Heavy dependencies are guarded, so the suites pass with pymavlink, ONNX Runtime and the datasets absent.',
  'What needs a network: dataset fetches, the LLM-backed assistants, and the ONNX export step. Nothing else.',
  'The SLAM and detection work is evaluated on public benchmarks — KITTI and COCO — not on your sensor rig. Numbers on your data will differ, and the first thing we would do is measure them.',
  'Several repositories are reference implementations rather than production systems: they exist to be read and to be correct, not to be deployed unmodified.',
  'We write software, not hardware. Firmware, drivers, embedded C++ and board bring-up in software terms for boards you already have: yes. Building, wiring, assembling or repairing a machine, PCB and mechanical design, or anything that would have to be shipped to us: no.',
  'We decline work we would do badly. That currently includes web3, ad tech, growth automation, and anything where the brief is a design comp and a deadline.',
];

/** The portrait plate. `src: null` renders the drawn specimen plate instead. */
export const PORTRAIT = {
  src: '/media/portrait.jpg' as string | null,
  srcWebp: '/media/portrait.webp' as string | null,
  alt: 'Pratyush Vatsa',
  caption: 'PRATYUSH VATSA',
  role: 'INDIA — WORKING WORLDWIDE',
};

/** `09` Who you would be working with. */
export const ABOUT = {
  status: 'SOFTWARE ONLY',
  heading: 'You will be talking to the person writing the code.',
  paragraphs: [
    'There is no account manager between you and the work. The person who reads your logs is the person who writes the fix, which is why the first thing you get back is a diagnosis rather than a quote.',
    'The work runs across four layers — flight stacks and control, simulation and testing, industrial acquisition and AI, and the interfaces people actually operate. They are the same job at different altitudes, and the seams between them are where projects usually break.',
  ],
  pull: 'A wrong yes costs you more than an honest no.',
  notes: [
    {
      title: 'DIAGNOSIS BEFORE IMPLEMENTATION',
      detail:
        'Every engagement opens with a written root-cause report. It stands on its own — you can act on it whether or not the implementation is bought here.',
    },
    {
      title: 'EVERY NUMBER IS REPRODUCIBLE',
      detail:
        'Results on this page were produced by public code on public data, and the command that produces each one is printed beside it. Including the one that is worse than the published figure.',
    },
    {
      title: 'SOFTWARE ONLY, FIRMWARE INCLUDED',
      detail:
        'We write the software, including the software that runs on your hardware — firmware for your flight controller, drivers, embedded C++, ROS 2 nodes, MAVLink integration, perception. We do not build, wire, assemble or repair the machine, and nothing has to be shipped to us: logs, parameter dumps and a photo of the setup are what we work from.',
    },
    {
      title: 'SCOPE IS NAMED, NOT DISCOVERED',
      detail:
        'Remote robotics debugging has unbounded scope, so it is sold as diagnosis first and quoted afterwards. Work that would be done badly is declined rather than accepted.',
    },
  ],
};
