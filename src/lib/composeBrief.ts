import { person } from '../content';
import { SUBJECT } from '../content/submit';

/**
 * Reading the form and turning it into a message.
 *
 * The `mailto:` this builds is the fallback path, so it has to be genuinely
 * good rather than an empty draft: every answer is labelled, the unanswered
 * optional ones say so, and the subject names where it came from. A buyer who
 * will not fill in a form is not a lost buyer, they are a buyer who wants to
 * write an email — so the email is worth composing properly.
 */
export type Answers = Record<string, string>;

export const readForm = (form: HTMLFormElement, name: string): string => {
  const el = form.elements.namedItem(name);
  if (!el) return '';
  if (el instanceof RadioNodeList) return el.value;
  return (el as HTMLInputElement | HTMLTextAreaElement).value.trim();
};

/** Validation runs on blur and on advance, never on keystroke. */
export const validateStep = (index: number, last: number, a: Answers): string => {
  if (index === 0 && (a.build ?? '').length < 12)
    return 'Tell us a little more — a sentence or two is enough to answer honestly.';
  if (index === last) {
    const email = a.email ?? '';
    if (!email) return 'We need an address to reply to.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'That address does not look right.';
  }
  return '';
};

export const mailtoHref = (a: Answers): string => {
  const body = [
    'What we are trying to build:',
    a.build ?? '',
    '',
    'What has to be true for it to work:',
    a.true || '(not answered)',
    '',
    `Where it is now: ${a.where || '(not answered)'}`,
    `Evidence: ${a.link || '(none attached)'}`,
    '',
    `Reply to: ${a.email ?? ''}`,
  ].join('\n');
  return `mailto:${person.email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(
    body,
  )}`;
};
