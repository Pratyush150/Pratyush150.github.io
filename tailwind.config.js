/**
 * SIGNAL — the design brief's hard rules are enforced in this config rather
 * than by convention, so the utilities that would break them do not exist in
 * the build at all.
 *
 *   - borderRadius: only `0` and `2px`. There is no round element on this site.
 *   - boxShadow / dropShadow / gradients / rings / blur: core plugins off.
 *     (The two permitted zero-blur hairlines are written by hand in index.css.)
 *   - colors: every value resolves to a §3.1 token, so no hex literal can
 *     reach a class name.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: {
    boxShadow: false,
    boxShadowColor: false,
    dropShadow: false,
    backgroundImage: false,
    gradientColorStops: false,
    ringWidth: false,
    ringColor: false,
    ringOffsetWidth: false,
    ringOffsetColor: false,
    blur: false,
    container: false,
    textShadow: false,
  },
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    borderRadius: {
      none: '0',
      press: '2px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      void: 'var(--bg-void)',
      base: 'var(--bg-base)',
      raise: 'var(--bg-raise)',
      elev: 'var(--bg-elev)',
      inset: 'var(--bg-inset)',
      fg: 'var(--fg)',
      'fg-2': 'var(--fg-2)',
      'fg-3': 'var(--fg-3)',
      'fg-dim': 'var(--fg-dim)',
      rule: 'var(--rule)',
      'rule-2': 'var(--rule-2)',
      'rule-ui': 'var(--rule-ui)',
      accent: 'var(--accent)',
      'accent-hi': 'var(--accent-hi)',
      'accent-dim': 'var(--accent-dim)',
      'on-accent': 'var(--on-accent)',
      'sig-ok': 'var(--sig-ok)',
      'sig-err': 'var(--sig-err)',
      // Preflight reaches for `colors.gray.400` for ::placeholder; give it a
      // token so no hex literal can reach the stylesheet.
      gray: { 400: 'var(--fg-3)' },
    },
    spacing: {
      0: '0',
      1: 'var(--s-1)',
      2: 'var(--s-2)',
      3: 'var(--s-3)',
      4: 'var(--s-4)',
      5: 'var(--s-5)',
      6: 'var(--s-6)',
      7: 'var(--s-7)',
      8: 'var(--s-8)',
      9: 'var(--s-9)',
      10: 'var(--s-10)',
      11: 'var(--s-11)',
      12: 'var(--s-12)',
      px: '1px',
      full: '100%',
    },
    extend: {
      transitionDuration: {
        xs: 'var(--t-xs)',
        sm: 'var(--t-sm)',
        md: 'var(--t-md)',
        lg: 'var(--t-lg)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        io: 'var(--ease-io)',
      },
    },
  },
  plugins: [],
};
