/** Shapes of `site-content.json`. The JSON is the single source of copy. */

export type Person = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  /** Still `REPLACE_ME` until the profile exists; rendered as a pending state. */
  fiverr: string;
  linkedin: string;
};

export type Category = { slug: string; name: string; blurb: string };

export type Project = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  repo_url: string;
  status: string;
};

export type ProcessStep = { step: number; title: string; detail: string };

export type SiteContent = {
  person: Person;
  hero: { headline: string; subheadline: string; blurb: string };
  credibility: { stat_or_label: string; detail: string }[];
  categories: Category[];
  projects: Project[];
  process: ProcessStep[];
  contact: { headline: string; blurb: string; note: string };
  about: { heading: string; bio: string[] };
};

/** A pending external profile: a designed placeholder, never a dead link. */
export const isPending = (value: string): boolean =>
  !value || value === 'REPLACE_ME' || value.startsWith('REPLACE');
