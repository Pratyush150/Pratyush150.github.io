/** The four questions of the `09` brief, and the three stages of step 3. */
export type BriefStep = { key: string; legend: string; hint: string };

export const BRIEF_STEPS: BriefStep[] = [
  {
    key: 'build',
    legend: 'What are you trying to build?',
    hint: 'Or what is going wrong. The machine or the process, and the versions.',
  },
  {
    key: 'true',
    legend: 'What has to be true for it to work?',
    hint: 'The constraint that makes this hard: a rate, a latency, a safety case, a deadline.',
  },
  { key: 'where', legend: 'Where is it now?', hint: '' },
  { key: 'reply', legend: 'Where do we reply?', hint: '' },
];

export const BRIEF_STAGES = ['IDEA', 'PROTOTYPE', 'PRODUCTION SYSTEM'];
