/**
 * The play manager.
 *
 * No `<video>` on this site carries an `autoplay` attribute — Apple ships
 * thirteen with none, and darkroom and Locomotive ship none either. Playback is
 * started from here, on intersection, which means the same branch that decides
 * whether to *play* is the branch that decides whether to *download*. Reduced
 * motion, MOTION OFF and data-saver gating therefore cost one condition rather
 * than three.
 *
 * At most two clips are ever playing. The third to ask evicts the least
 * recently started, and eviction is a `pause()`, never a `load()`, so the
 * decoded frame survives and re-entry is instant.
 */
const MAX_PLAYING = 2;
const playing: HTMLVideoElement[] = [];

export function requestPlay(el: HTMLVideoElement): void {
  if (playing.includes(el)) return;
  while (playing.length >= MAX_PLAYING) {
    const evicted = playing.shift();
    evicted?.pause();
  }
  playing.push(el);
  const p = el.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {
      // Autoplay policy or a decode error: the poster is already correct.
      release(el);
    });
  }
}

export function release(el: HTMLVideoElement): void {
  const i = playing.indexOf(el);
  if (i !== -1) playing.splice(i, 1);
  el.pause();
}

/** MOTION OFF: stop every clip on the page, wherever it is. */
export function pauseAll(): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('video').forEach((v) => v.pause());
  playing.length = 0;
}
