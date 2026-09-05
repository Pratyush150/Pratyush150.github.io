/**
 * The global MOTION switch.
 *
 * WCAG 2.2.2 requires a pause mechanism for automatically-playing looping
 * motion longer than five seconds — for every user, not only those who set
 * `prefers-reduced-motion`. This site is built on looping video, so the switch
 * is a real control rather than a compliance note.
 *
 * It initialises OFF under `prefers-reduced-motion: reduce` and ON otherwise;
 * a stored choice wins over the preference in both directions. The value lives
 * on `<html data-motion>` so CSS can read it and the pre-paint script in
 * index.html can set it before React mounts.
 */
import { useEffect, useState } from 'react';

export type MotionState = 'on' | 'off';

const KEY = 'signal-motion';
const listeners = new Set<(v: MotionState) => void>();

export const prefersReduced = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

export const readMotion = (): MotionState => {
  if (typeof document === 'undefined') return 'on';
  const attr = document.documentElement.getAttribute('data-motion');
  return attr === 'off' ? 'off' : 'on';
};

export const setMotion = (value: MotionState): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-motion', value);
  // The reveal primitives are only allowed to start hidden while motion is on.
  document.documentElement.classList.toggle('js', value === 'on' && !prefersReduced());
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* storage unavailable: the switch still works for this page view */
  }
  listeners.forEach((fn) => fn(value));
};

/** Subscribe to the switch. Returns the current value, `'on'` during SSR. */
export function useMotion(): MotionState {
  const [value, setValue] = useState<MotionState>('on');
  useEffect(() => {
    setValue(readMotion());
    listeners.add(setValue);
    return () => {
      listeners.delete(setValue);
    };
  }, []);
  return value;
}

/**
 * True when motion is allowed to run at all: the switch is ON and the OS is not
 * asking for reduced motion. Every draw, every crossfade and every video
 * request goes through this one branch.
 */
export function useMotionAllowed(): boolean {
  const motion = useMotion();
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(prefersReduced());
  }, []);
  return motion === 'on' && !reduced;
}

/** `navigator.connection` is not in lib.dom; this is the shape we read. */
type SaveDataConnection = { saveData?: boolean; effectiveType?: string };

/** Data-saver or a 2g link: no clip is requested at all. */
export function isFrugalConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  const c = (navigator as Navigator & { connection?: SaveDataConnection }).connection;
  if (!c) return false;
  if (c.saveData === true) return true;
  return c.effectiveType === '2g' || c.effectiveType === 'slow-2g';
}
