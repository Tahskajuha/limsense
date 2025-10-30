import { useMemo, useRef, useState } from 'react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { generatePDF } from '../utils/pdf';
import { SummaryCard } from '../shared/SummaryCard';
import { DateRange } from '../shared/DateRange';

const MOCK = [
  { id: 'S-001', date: '2024-08-18', tests: 42, avgTAT: 18.7, anomalies: 1 },
  { id: 'S-002', date: '2024-08-19', tests: 55, avgTAT: 16.2, anomalies: 2 },
  { id: 'S-003', date: '2024-08-20', tests: 60, avgTAT: 15.4, anomalies: 0 },
  { id: 'S-004', date: '2024-08-21', tests: 48, avgTAT: 17.9, anomalies: 1 },
  { id: 'S-005', date: '2024-08-22', tests: 70, avgTAT: 14.5, anomalies: 3 }
];

export default function Reports() {
  const [range, setRange] = useState({ from: '2024-08-18', to: '2024-08-22' });
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef(null);

  const filtered = useMemo(() => {
    const from = parseISO(range.from);
    const to = parseISO(range.to);
    return MOCK.filter(r => {
      const d = parseISO(r.date);
      return (isAfter(d, from) || +d === +from) && (isBefore(d, to) || +d === +to);
    });
  }, [range]);

  const totals = useMemo(() => {
    const totalTests = filtered.reduce((a, b) => a + b.tests, 0);
    const avgTAT = filtered.length ? (filtered.reduce((a, b) => a + b.avgTAT, 0) / filtered.length) : 0;
    const totalAnomalies = filtered.reduce((a, b) => a + b.anomalies, 0);
    return { totalTests, avgTAT: Number(avgTAT.toFixed(1)), totalAnomalies };
  }, [filtered]);

  const onDownload = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      await generatePDF(
        reportRef.current,
        `LIMS_Summary_${format(parseISO(range.from), 'yyyyMMdd')}_${format(parseISO(range.to), 'yyyyMMdd')}.pdf`
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section>
      <h1>Report Generation</h1>
      <p className="muted">Generate a summary report with filters and export to PDF.</p>

      <div className="toolbar">
        <DateRange value={range} onChange={setRange} />
        <button className="btn primary" onClick={onDownload} disabled={downloading}>
          {downloading ? 'Generating PDF…' : 'Download PDF'}
        </button>
      </div>

      <div className="grid-3" ref={reportRef}>
        <SummaryCard label="Total Tests" value={totals.totalTests} />
        <SummaryCard label="Average Turnaround (hrs)" value={totals.avgTAT} />
        <SummaryCard label="Anomalies Detected" value={totals.totalAnomalies} />
      </div>

      <div className="card mt">
        <header className="card-header">
          <div>Summary Table</div>
          <div className="muted">From {range.from} to {range.to}</div>
        </header>
        <div className="table">
          <div className="tr th">
            <div>ID</div>
            <div>Date</div>
            <div>Tests</div>
            <div>Avg TAT (hrs)</div>
            <div>Anomalies</div>
          </div>
          {filtered.map(row => (
            <div className="tr" key={row.id}>
              <div>{row.id}</div>
              <div>{row.date}</div>
              <div>{row.tests}</div>
              <div>{row.avgTAT}</div>
              <div>{row.anomalies}</div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty">No data in range.</div>}
        </div>
      </div>
    </section>
  );
}
