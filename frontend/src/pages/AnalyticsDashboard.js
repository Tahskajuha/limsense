import { useMemo, useState } from 'react';
import { parseISO } from 'date-fns';
import { DateRange } from '../shared/DateRange';
import { LineChartWidget } from '../shared/LineChartWidget';
import { SummaryCard } from '../shared/SummaryCard';

const RAW = [
  { date: '2024-08-18', tat: 18.7, anomalies: 1, tests: 42 },
  { date: '2024-08-19', tat: 16.2, anomalies: 2, tests: 55 },
  { date: '2024-08-20', tat: 15.4, anomalies: 0, tests: 60 },
  { date: '2024-08-21', tat: 17.9, anomalies: 1, tests: 48 },
  { date: '2024-08-22', tat: 14.5, anomalies: 3, tests: 70 }
];

export default function AnalyticsDashboard() {
  const [range, setRange] = useState({ from: '2024-08-18', to: '2024-08-22' });

  const data = useMemo(() => {
    const from = parseISO(range.from).getTime();
    const to = parseISO(range.to).getTime();
    return RAW.filter(d => {
      const t = parseISO(d.date).getTime();
      return t >= from && t <= to;
    });
  }, [range]);

  const avgTAT = useMemo(() => data.length ? Number((data.reduce((a, b) => a + b.tat, 0) / data.length).toFixed(1)) : 0, [data]);
  const totalAnomalies = useMemo(() => data.reduce((a, b) => a + b.anomalies, 0), [data]);
  const successSeries = useMemo(() => data.map(d => ({ date: d.date, success: Math.max(0, Math.min(100, Number(((1 - (d.anomalies / Math.max(1, d.tests))) * 100).toFixed(1)))) })), [data]);

  return (
    <section>
      <h1>Analytics Dashboard</h1>
      <p className="muted">Monitor turnaround time and anomalies. Static demo data for now.</p>

      <div className="toolbar">
        <DateRange value={range} onChange={setRange} />
      </div>

      <div className="grid-3">
        <SummaryCard label="Average TAT (hrs)" value={avgTAT} />
        <SummaryCard label="Total Anomalies" value={totalAnomalies} />
        <SummaryCard label="Days in Range" value={data.length} />
      </div>

      <div className="grid-2 mt">
        <div className="card">
          <header className="card-header">Turnaround Time</header>
          <LineChartWidget
            data={data}
            dataKey="tat"
            color="#0ea5e9"
            yLabel="Hours"
          />
        </div>
        <div className="card">
          <header className="card-header">Anomalies</header>
          <LineChartWidget
            data={data}
            dataKey="anomalies"
            color="#f97316"
            yLabel="Count"
          />
        </div>
      </div>

      <div className="grid-2 mt">
        <div className="card">
          <header className="card-header">Success Rate (%)</header>
          <LineChartWidget
            data={successSeries}
            dataKey="success"
            color="#22c55e"
            yLabel="Percent"
          />
        </div>
      </div>
    </section>
  );
}