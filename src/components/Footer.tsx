import { person } from '../content';

/** `10` Footer. One hairline row. Nothing else. */
export default function Footer({ build }: { build: string }) {
  return (
    <footer className="foot" role="contentinfo">
      <div className="shell foot__row t-mono-read rule-t">
        <span>{person.name.toUpperCase()}</span>
        <a className="link-plain" href={`mailto:${person.email}`}>
          {person.email}
        </a>
        <a className="link-plain" href={person.github} target="_blank" rel="noreferrer">
          GITHUB <span aria-hidden="true">↗</span>
        </a>
        <a className="link-plain" href={person.linkedin} target="_blank" rel="noreferrer">
          LINKEDIN <span aria-hidden="true">↗</span>
        </a>
        {person.fiverr ? (
          <a className="link-plain" href={person.fiverr} target="_blank" rel="noreferrer">
            FIVERR <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        <span>BUILD {build}</span>
      </div>
    </footer>
  );
}
