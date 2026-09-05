import MediaWell from './MediaWell';
import type { LabTile as Tile } from '../content/artefacts';

/**
 * A Lab tile. Hairline box, no fill, no radius, no shadow. Hover steps the
 * ground one level and underlines the question; that is the entire interaction.
 * A tile with no link and no media is fine and looks deliberate.
 */
export default function LabTile({ tile }: { tile: Tile }) {
  const body = (
    <>
      <h3 className="lab__q t-section">{tile.question}</h3>
      <p className="lab__line t-mono-meta">{tile.line}</p>
      {tile.clip ? (
        <div className="lab__media">
          <MediaWell
            id={tile.clip}
            aspect="16 / 9"
            caption={tile.clipCaption ?? tile.line}
          />
        </div>
      ) : null}
      <p className="lab__status t-mono-read rule-t">{`STATUS: ${tile.status}`}</p>
    </>
  );

  return tile.href ? (
    <a
      className={`lab__tile lab__tile--link ${tile.span}`}
      href={tile.href}
      target="_blank"
      rel="noreferrer"
      data-cursor="OPEN REPO ↗"
    >
      {body}
    </a>
  ) : (
    <article className={`lab__tile ${tile.span}`}>{body}</article>
  );
}
