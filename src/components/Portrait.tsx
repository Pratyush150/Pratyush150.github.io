import { PORTRAIT } from '../content';

/**
 * The portrait plate. Square corners, a 1px rule and an offset registration
 * frame — a specimen mounted on a card, not a headshot in a circle.
 *
 * The image is desaturated and a small amount of the page accent is blended
 * back in with `mix-blend-mode: color`, so a photograph taken in any light
 * cannot fight the four-hue system around it. The box reserves its 4:5 space
 * before the file loads, so nothing on the page moves when it arrives.
 *
 * With no file configured it renders the same box at the same size with the
 * initials drawn in outline — deliberately a drawn object, not an apology.
 */
export default function Portrait() {
  const { src, srcWebp, alt, caption, role } = PORTRAIT;

  return (
    <figure className="portrait">
      <div className="portrait__plate">
        {src ? (
          <picture>
            {srcWebp ? <source srcSet={srcWebp} type="image/webp" /> : null}
            <img
              className="portrait__img"
              src={src}
              alt={alt}
              width={800}
              height={1000}
              loading="lazy"
              decoding="async"
            />
          </picture>
        ) : (
          <svg className="portrait__plate-svg" viewBox="0 0 320 400" role="img" aria-label={alt}>
            <defs>
              <pattern id="pp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0v40" fill="none" stroke="var(--fg-dim)" strokeWidth="1" opacity=".22" />
              </pattern>
            </defs>
            <rect width="320" height="400" fill="url(#pp-grid)" />
            <text className="portrait__initials" x="160" y="216" textAnchor="middle">
              PV
            </text>
            <g className="portrait__crop" fill="none" strokeWidth="1">
              <path d="M14 26V14h12M306 26V14h-12M14 374v12h12M306 374v12h-12" />
            </g>
            <text className="portrait__dim" x="16" y="390">
              4:5
            </text>
          </svg>
        )}
      </div>
      <figcaption className="portrait__cap t-mono-meta">
        <span>{caption}</span>
        <span>{role}</span>
      </figcaption>
    </figure>
  );
}
