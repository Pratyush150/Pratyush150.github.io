import { PROOF_ROWS, PROOF_FOOTER } from './proof';
import { REVEALS } from './work';
import { LAB_TILES } from './artefacts';
import { person, projects } from './index';

/**
 * The command-palette index, built from the content modules at build time. A
 * palette that only scrolls to sections is a tell; this one also searches the
 * projects and the measured numbers, so typing `mAP`, `KITTI` or `ATE` surfaces
 * the value with its provenance and jumps to the row.
 *
 * Plain substring scoring, about thirty lines, roughly sixty entries. No
 * fuzzy-search library.
 */
export type Entry = {
  group: 'SECTION' | 'WORK' | 'NUMBER' | 'LAB' | 'ACTION';
  label: string;
  detail?: string;
  href?: string;
  action?: 'copy-email' | 'toggle-motion';
  keywords: string;
};

const sections: Entry[] = [
  ['Hero', '#hero'],
  ['Capabilities', '#capability'],
  ['Selected work', '#work'],
  ['Case study — stereo visual SLAM', '#case'],
  ['Measured', '#measured'],
  ['Under the hood', '#stack'],
  ['The Lab', '#lab'],
  ['Process', '#process'],
  ['Bring us a problem', '#contact'],
].map(([label, href]) => ({
  group: 'SECTION' as const,
  label: label as string,
  href: href as string,
  keywords: (label as string).toLowerCase(),
}));

const work: Entry[] = REVEALS.map((r) => ({
  group: 'WORK',
  label: r.title,
  detail: r.slug,
  href: r.href,
  keywords: `${r.title} ${r.slug} ${r.meta}`.toLowerCase(),
}));

const repos: Entry[] = projects.map((p) => ({
  group: 'WORK',
  label: p.name,
  detail: p.tagline,
  href: p.repo_url,
  keywords: `${p.name} ${p.category} ${p.tagline} ${p.stack.join(' ')}`.toLowerCase(),
}));

const numbers: Entry[] = PROOF_ROWS.map((r) => ({
  group: 'NUMBER',
  label: `${r.numeral} — ${r.measures}`,
  detail: r.repoLabel,
  href: '#measured',
  keywords: `${r.numeral} ${r.measures} ${r.keywords.join(' ')}`.toLowerCase(),
}));

const lab: Entry[] = LAB_TILES.map((t) => ({
  group: 'LAB',
  label: t.question,
  detail: `STATUS: ${t.status}`,
  href: t.href ?? '#lab',
  keywords: `${t.question} ${t.line} ${t.status}`.toLowerCase(),
}));

const actions: Entry[] = [
  { group: 'ACTION', label: 'Copy email address', action: 'copy-email', keywords: 'copy email contact address' },
  { group: 'ACTION', label: 'Toggle motion', action: 'toggle-motion', keywords: 'motion pause stop animation video' },
  { group: 'ACTION', label: 'Open GitHub', href: person.github, keywords: 'github repositories source code' },
  { group: 'ACTION', label: 'Open LinkedIn', href: person.linkedin, keywords: 'linkedin profile' },
];

export const INDEX: Entry[] = [...sections, ...numbers, ...work, ...repos, ...lab, ...actions];

export function search(q: string): Entry[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return INDEX.slice(0, 12);
  const scored: { e: Entry; s: number }[] = [];
  for (const e of INDEX) {
    const i = e.keywords.indexOf(needle);
    if (i === -1) continue;
    scored.push({ e, s: i + (e.label.toLowerCase().startsWith(needle) ? -50 : 0) });
  }
  return scored.sort((a, b) => a.s - b.s).slice(0, 12).map((x) => x.e);
}

/** `>` switches the palette to a prompt. Every value is read from the content. */
export function runCommand(cmd: string): string[] {
  const [name] = cmd.trim().split(/\s+/);
  switch (name) {
    case 'whoami':
      return [`${person.name.toUpperCase()} — ${person.title.toUpperCase()}`];
    case 'ls':
      return projects.map((p) => p.name);
    case 'cat':
      return PROOF_ROWS.map((r) => `${r.numeral.padEnd(18)} ${r.measures}`).concat([
        '',
        PROOF_FOOTER.text,
      ]);
    case 'uptime':
      return ['available for projects; we reply within one working day'];
    case 'contact':
      return [person.email, '(copied to the clipboard)'];
    case 'help':
      return ['whoami', 'ls repos', 'cat proof', 'uptime', 'contact', 'help'];
    default:
      return [`command not found: ${name || '(nothing)'}`, "try 'help'"];
  }
}
