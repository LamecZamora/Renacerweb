// Gráficas del Dashboard aisladas para cargar recharts de forma diferida (lazy):
// así las tarjetas y stats pintan al instante y la librería de gráficas (~112 kB gzip)
// entra después, sin bloquear el primer render de la página principal.
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
} from 'recharts';

export function WeightChart({ data }: { data: { date: string; weight?: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.55} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a8a29e" />
        <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} stroke="#a8a29e" />
        <Tooltip />
        <Area type="monotone" dataKey="weight" stroke="#d97706" strokeWidth={2.5} fill="url(#g)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatsRadar({ data }: { data: { stat: string; level: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="#a8a29e55" />
        <PolarAngleAxis dataKey="stat" tick={{ fontSize: 10, fill: '#a8a29e' }} />
        <Radar dataKey="level" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
