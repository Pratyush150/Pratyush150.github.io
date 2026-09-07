import { useEffect, useState } from 'react';

const ZONES: [string, string][] = [
  ['IST', 'Asia/Kolkata'],
  ['GMT', 'Etc/GMT'],
  ['EST', 'America/New_York'],
  ['PST', 'America/Los_Angeles'],
];

/**
 * Live clocks for the four zones in the geography line. Computed client-side
 * with `Intl.DateTimeFormat` and updated once a minute. It costs about twelve
 * lines, it is true, and it makes the page feel alive without animating.
 */
export default function Clocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="clocks">
      {ZONES.map(([label, tz]) => (
        <span key={label} className="clocks__z">
          {label}
          {now ? (
            <span className="clocks__t">
              {' '}
              {new Intl.DateTimeFormat('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: tz,
              }).format(now)}
            </span>
          ) : null}
        </span>
      ))}
    </span>
  );
}
