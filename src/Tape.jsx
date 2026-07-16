// Safety-tape marquees: two crossing ribbons scrolling the record,
// like warning tape across the seam between sheets.
const LINE = [
  'Robofest 3.0 — First Prize ₹10,00,000',
  'Adani Robo Race — 1st Place',
  'Maze Solving Robot',
  'PLC & Process Automation',
  '3D Print · CNC · Laser · PCB',
  'Project & Innovation Lab',
  'Robofest 5.0 — All Categories',
  'Vayu Rakshak · Hemoglobin Analyser',
];

function Row({ variant }) {
  // content doubled once so translateX(-50%) loops seamlessly
  const items = [...LINE, ...LINE];
  return (
    <div className={`tape ${variant}`}>
      <div className="tape-track">
        {items.map((t, i) => (
          <span className="tape-item" key={i}>
            {t}
            <em>✦</em>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Tape() {
  return (
    <div className="tape-wrap" aria-hidden="true">
      <Row variant="tape-a" />
      <Row variant="tape-b" />
    </div>
  );
}
