/**
 * A bounded, in-order warm-up queue for the clips.
 *
 * The problem it solves: every well fetched its own clip only once the reader
 * was already 200px away, with `preload="none"`. By the time the section was on
 * screen the first byte had not arrived, so the well sat on its poster and the
 * motion looked broken rather than late.
 *
 * Firing them all at once is the other failure: a dozen parallel video fetches
 * on one connection starve each other and the first clip — the one actually
 * being looked at — arrives last.
 *
 * So: a queue with a hard concurrency cap, served in document order, running
 * only while the browser is idle. Nearest-to-viewport work can jump the line by
 * calling `warm(src, true)`. This is scheduling, not networking — there is no
 * server here to balance and no remote call to trip a breaker on.
 */

const MAX_IN_FLIGHT = 2;

const done = new Set<string>();
const queued = new Set<string>();
let waiting: string[] = [];
let inFlight = 0;
let scheduled = false;

const idle: (cb: () => void) => void =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? (cb) => (window as unknown as { requestIdleCallback: (c: () => void, o?: object) => void })
        .requestIdleCallback(cb, { timeout: 1200 })
    : (cb) => window.setTimeout(cb, 250);

function pump(): void {
  scheduled = false;
  while (inFlight < MAX_IN_FLIGHT && waiting.length) {
    const src = waiting.shift() as string;
    queued.delete(src);
    if (done.has(src)) continue;
    inFlight += 1;

    // A detached <video> with preload="auto" warms the HTTP cache without
    // adding an element to the page or decoding a single frame on screen.
    const probe = document.createElement('video');
    probe.preload = 'auto';
    probe.muted = true;
    const finish = (): void => {
      done.add(src);
      inFlight -= 1;
      probe.removeAttribute('src');
      probe.load();
      schedule();
    };
    probe.addEventListener('canplaythrough', finish, { once: true });
    probe.addEventListener('error', finish, { once: true });
    // Never let one stalled fetch hold a slot forever.
    window.setTimeout(() => {
      if (!done.has(src)) finish();
    }, 8000);
    probe.src = src;
  }
}

function schedule(): void {
  if (scheduled || !waiting.length) return;
  scheduled = true;
  idle(pump);
}

/** Warm one clip. `urgent` puts it at the head of the queue. */
export function warm(src: string | undefined, urgent = false): void {
  if (!src || done.has(src) || typeof document === 'undefined') return;
  if (queued.has(src)) {
    if (!urgent) return;
    waiting = waiting.filter((s) => s !== src);
  }
  queued.add(src);
  if (urgent) waiting.unshift(src);
  else waiting.push(src);
  schedule();
}

/** Mark a clip warm because something else already fetched it. */
export function markWarm(src: string | undefined): void {
  if (src) done.add(src);
}
