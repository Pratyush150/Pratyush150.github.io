import { useEffect, useMemo, useRef, useState } from 'react';
import { search, runCommand, type Entry } from '../content/paletteIndex';
import { person } from '../content';
import { readMotion, setMotion } from '../lib/motion';
import { pauseAll } from '../lib/playManager';

/**
 * `K` (and ⌘K / Ctrl+K) opens the palette. It is the fastest way to use the
 * page rather than an easter egg that only scrolls: it searches sections, the
 * projects and the measured numbers. Typing `>` turns it into a prompt whose
 * commands return real values read from the content at build time.
 *
 * Full keyboard: arrows move, Enter selects, Escape closes, focus is trapped
 * while open and returns to the trigger on close.
 */
export type PaletteProps = { open: boolean; onClose: () => void };

export default function CommandPalette({ open, onClose }: PaletteProps) {
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const isPrompt = q.startsWith('>');
  const results = useMemo<Entry[]>(() => (isPrompt ? [] : search(q)), [q, isPrompt]);

  useEffect(() => {
    if (!open) return;
    setQ('');
    setCursor(0);
    setLines([]);
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    document.documentElement.classList.add('palette-open');
    return () => {
      window.clearTimeout(t);
      document.documentElement.classList.remove('palette-open');
    };
  }, [open]);

  if (!open) return null;

  const go = (e: Entry) => {
    if (e.action === 'copy-email') {
      void navigator.clipboard?.writeText(person.email);
    } else if (e.action === 'toggle-motion') {
      const next = readMotion() === 'on' ? 'off' : 'on';
      setMotion(next);
      if (next === 'off') pauseAll();
    } else if (e.href?.startsWith('#')) {
      document.querySelector(e.href)?.scrollIntoView({ block: 'start' });
      window.location.hash = e.href;
    } else if (e.href) {
      window.open(e.href, '_blank', 'noopener');
    }
    onClose();
  };

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      onClose();
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      if (isPrompt) {
        const cmd = q.slice(1).trim();
        setLines([`$ ${cmd}`, ...runCommand(cmd)]);
        if (cmd.startsWith('contact')) void navigator.clipboard?.writeText(person.email);
        setQ('>');
      } else if (results[cursor]) {
        go(results[cursor]);
      }
    } else if (ev.key === 'Tab') {
      // One focusable element while open: keep focus inside.
      ev.preventDefault();
      inputRef.current?.focus();
    }
  };

  return (
    <div className="pal" role="presentation" onMouseDown={onClose}>
      <div
        ref={shellRef}
        className="pal__shell"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="pal__in t-mono-code"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search sections, projects and numbers — or type > for a prompt"
          aria-label="Search sections, projects and numbers"
          aria-activedescendant={results[cursor] ? `pal-opt-${cursor}` : undefined}
          aria-controls="pal-list"
          role="combobox"
          aria-expanded="true"
          autoComplete="off"
          spellCheck={false}
        />

        {isPrompt ? (
          <pre className="pal__term t-mono-code">
            {lines.length ? lines.join('\n') : "type a command, then Enter. 'help' lists them."}
          </pre>
        ) : (
          <ul className="pal__list" id="pal-list" role="listbox" aria-label="Results">
            {results.map((e, i) => (
              <li
                key={`${e.group}-${e.label}`}
                id={`pal-opt-${i}`}
                role="option"
                aria-selected={i === cursor}
                className={`pal__opt${i === cursor ? ' is-cursor' : ''}`}
                onMouseEnter={() => setCursor(i)}
                onClick={() => go(e)}
              >
                <span className="pal__grp t-mono-read eyebrow">{e.group}</span>
                <span className="pal__lbl">{e.label}</span>
                {e.detail ? <span className="pal__det t-mono-meta">{e.detail}</span> : null}
              </li>
            ))}
            {results.length === 0 ? (
              <li className="pal__opt pal__opt--empty t-mono-meta">no match</li>
            ) : null}
          </ul>
        )}

        <p className="pal__foot t-mono-read eyebrow">
          ↑ ↓ MOVE · ENTER SELECT · ESC CLOSE · &gt; PROMPT
        </p>
      </div>
    </div>
  );
}
