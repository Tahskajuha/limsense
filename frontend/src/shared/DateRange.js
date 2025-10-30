export function DateRange({ value, onChange }) {
  const update = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="daterange">
      <label className="field">
        <span>From</span>
        <input type="date" value={value.from} onChange={e => update('from', e.target.value)} />
      </label>
      <label className="field">
        <span>To</span>
        <input type="date" value={value.to} onChange={e => update('to', e.target.value)} />
      </label>
    </div>
  );
}


