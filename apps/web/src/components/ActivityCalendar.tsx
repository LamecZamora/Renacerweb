import { getActiveDays } from '../lib/storage';

const WEEKS = 18; // ~4 meses
const DAY_MS = 86_400_000;
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function ActivityCalendar() {
  const active = new Set(getActiveDays());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // alinear el final a domingo de esta semana para columnas completas
  const end = new Date(today);
  end.setDate(today.getDate() + (6 - ((today.getDay() + 6) % 7))); // fin de semana (domingo)
  const totalDays = WEEKS * 7;

  const cells: { date: Date; active: boolean; future: boolean }[] = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * DAY_MS);
    const iso = d.toISOString().slice(0, 10);
    cells.push({ date: d, active: active.has(iso), future: d > today });
  }

  // etiquetas de mes por columna (cuando cambia el mes en la fila superior)
  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < WEEKS; w++) {
    const first = cells[w * 7].date;
    if (first.getMonth() !== lastMonth) {
      monthLabels.push({ col: w, label: MONTHS[first.getMonth()] });
      lastMonth = first.getMonth();
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="grid text-[9px] text-stone-400 mb-1" style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)`, gap: 3 }}>
          {Array.from({ length: WEEKS }).map((_, w) => (
            <span key={w} className="h-3">{monthLabels.find((m) => m.col === w)?.label ?? ''}</span>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column', gap: 3 }}>
          {cells.map((c, i) => (
            <div
              key={i}
              title={`${c.date.toLocaleDateString('es')}${c.active ? ' · activo' : ''}`}
              className="h-3 w-3 rounded-[3px]"
              style={{
                background: c.future ? 'transparent' : c.active ? '#f59e0b' : 'rgba(120,113,108,0.18)',
                opacity: c.future ? 0 : 1,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-400">
          <span>Menos</span>
          <span className="h-3 w-3 rounded-[3px]" style={{ background: 'rgba(120,113,108,0.18)' }} />
          <span className="h-3 w-3 rounded-[3px]" style={{ background: '#f59e0b' }} />
          <span>Activo</span>
        </div>
      </div>
    </div>
  );
}
