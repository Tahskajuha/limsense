export function SummaryCard({ label, value }) {
    return (
      <div className="card stat">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    );
  }