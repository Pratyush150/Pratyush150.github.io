/**
 * The left instrument rail: column 1 at >=1024px, a horizontal line above the
 * heading below that. It carries the section number, a hairline running the
 * section's height, the section eyebrow set vertically, and — where the section
 * has one — a live status readout. The numeral is doing a job, not decorating.
 */
export type RailProps = {
  index: string;
  label: string;
  status?: string;
};

export default function Rail({ index, label, status }: RailProps) {
  return (
    <div className="rail t-mono-read" aria-hidden="true">
      <span className="rail__num">{index}</span>
      <span className="rail__line" />
      <span className="rail__label">{label}</span>
      {status ? <span className="rail__status">{status}</span> : null}
    </div>
  );
}
