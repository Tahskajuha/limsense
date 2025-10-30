import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function LineChartWidget({ data, dataKey, color = '#0ea5e9', yLabel = '' }) {
  return (
    <div style={{ width: '100%', height: 280 }} className="chart-animated">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={900} animationEasing="ease-in-out" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}