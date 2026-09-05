import { useEffect, useRef, useState } from 'react';
import { person } from '../content';
import { BRIEF_STAGES, BRIEF_STEPS } from '../content/brief';
import { SUBJECT, WEB3FORMS_ENDPOINT, WEB3FORMS_KEY } from '../content/submit';
import { mailtoHref, readForm, validateStep, type Answers } from '../lib/composeBrief';

/**
 * The multi-step brief. Four steps, one question per step.
 *
 * It is ONE real `<form>` in the DOM the whole time. Steps are `<fieldset>`s
 * and inactive ones are `hidden`, never unmounted — which is what lets it work
 * with JavaScript disabled (all four fieldsets simply stay visible and the
 * stepper never appears), lets the browser autofill it, and makes a submit a
 * real submit.
 *
 * Success is a state change, not a redirect. Errors are text beside the field,
 * because colour must never be the only carrier of state.
 */
export default function BriefForm() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const last = BRIEF_STEPS.length - 1;

  /**
   * Until this flips, every fieldset is visible and there is no stepper — which
   * is exactly the state a reader without JavaScript stays in. Server render
   * and first client render agree, so hydration is clean and nothing moves:
   * the progress readout swaps its own text rather than appearing.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const answers = (): Answers => {
    const form = formRef.current;
    if (!form) return {};
    return Object.fromEntries(
      ['build', 'true', 'where', 'email', 'link', 'botcheck'].map((n) => [n, readForm(form, n)]),
    );
  };

  const advance = () => {
    const msg = validateStep(step, last, answers());
    setError(msg);
    if (msg) return;
    const next = Math.min(step + 1, last);
    setStep(next);
    window.setTimeout(() => {
      const sel = `#step-${BRIEF_STEPS[next].key} textarea, #step-${BRIEF_STEPS[next].key} input`;
      formRef.current?.querySelector<HTMLElement>(sel)?.focus();
    }, 0);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const a = answers();
    if (a.botcheck) return; // honeypot: let it do nothing at all
    const msg = validateStep(last, last, a);
    if (msg) {
      e.preventDefault();
      setError(msg);
      return;
    }
    if (WEB3FORMS_KEY) return; // native POST; works with JavaScript disabled too
    e.preventDefault();
    window.location.href = mailtoHref(a);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="brief brief--done" role="status">
        <p className="t-statement">Got it. You’ll hear back within one working day.</p>
        <p className="t-mono-meta">
          If your mail client did not open, write to{' '}
          <a className="link-signal" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="brief"
      onSubmit={onSubmit}
      action={WEB3FORMS_KEY ? WEB3FORMS_ENDPOINT : `mailto:${person.email}`}
      method="POST"
      encType={WEB3FORMS_KEY ? undefined : 'text/plain'}
    >
      {WEB3FORMS_KEY ? (
        <>
          <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
          <input type="hidden" name="subject" value={SUBJECT} />
        </>
      ) : null}
      <input className="sr-only" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <p className="brief__prog t-mono-read" aria-live="polite">
        {mounted
          ? `STEP ${String(step + 1).padStart(2, '0')} / ${String(BRIEF_STEPS.length).padStart(2, '0')}`
          : 'FOUR QUESTIONS'}
        <span className="brief__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${mounted ? (step + 1) / BRIEF_STEPS.length : 1})` }} />
        </span>
      </p>

      {BRIEF_STEPS.map((s, i) => (
        <fieldset
          key={s.key}
          id={`step-${s.key}`}
          className="brief__step"
          hidden={mounted && i !== step}
        >
          <legend className="t-body">{s.legend}</legend>
          {s.hint ? <p className="brief__hint t-mono-meta">{s.hint}</p> : null}

          {i < 2 ? (
            <textarea className="ctl brief__ta" name={s.key} rows={3} onBlur={() => setError('')} />
          ) : null}

          {i === 2 ? (
            <div className="brief__radios">
              {BRIEF_STAGES.map((v) => (
                <label key={v} className="brief__radio ctl t-mono-read">
                  <input type="radio" name="where" value={v} />
                  {v}
                </label>
              ))}
            </div>
          ) : null}

          {i === 3 ? (
            <>
              <label className="brief__label t-mono-read" htmlFor="brief-email">
                EMAIL
              </label>
              <input
                id="brief-email"
                className="ctl brief__in"
                type="email"
                name="email"
                required
                autoComplete="email"
                onBlur={() => setError(validateStep(last, last, answers()))}
              />
              <label className="brief__label t-mono-read" htmlFor="brief-link">
                OPTIONAL — LINK TO A LOG, BAG FILE, REGISTER MAP OR DOCUMENT SAMPLE
              </label>
              <input id="brief-link" className="ctl brief__in" type="url" name="link" />
            </>
          ) : null}
        </fieldset>
      ))}

      {error ? (
        <p className="brief__err t-mono-meta" role="alert">
          {error}
        </p>
      ) : null}

      <p className="brief__nav">
        {mounted && step > 0 ? (
          <button type="button" className="ctl t-mono-read" onClick={() => setStep(step - 1)}>
            BACK
          </button>
        ) : null}
        {mounted && step < last ? (
          <button type="button" className="ctl t-mono-read" onClick={advance}>
            NEXT
          </button>
        ) : null}
        <button
          type="submit"
          className="ctl-fill t-mono-read brief__send"
          hidden={mounted && step < last}
        >
          SEND IT
        </button>
      </p>

      <p className="brief__alt t-mono-meta">
        Or just email us{' '}
        <a
          className="link-signal"
          href={`mailto:${person.email}?subject=${encodeURIComponent(SUBJECT)}`}
        >
          {person.email} <span className="arrow" aria-hidden="true">↗</span>
        </a>
      </p>
    </form>
  );
}
