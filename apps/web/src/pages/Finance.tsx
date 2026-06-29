import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card, Stat, PageHeader, Badge, Progress } from '../components/ui';
import { useLocalList, uid } from '../lib/storage';

type Tx = { id: string; type: 'INCOME' | 'EXPENSE' | 'SAVING'; amount: number; category: string; date: string };

const GOAL_KEY = 'renacer_savegoal';
type Goal = { target: number; deadline: string };
const DEFAULT_GOAL: Goal = { target: 200000, deadline: new Date(Date.now() + 365 * 86_400_000).toISOString().slice(0, 10) };

function SavingsGoal({ saved }: { saved: number }) {
  const [goal, setGoal] = useState<Goal>(() => {
    try { return { ...DEFAULT_GOAL, ...JSON.parse(localStorage.getItem(GOAL_KEY) ?? '{}') }; } catch { return DEFAULT_GOAL; }
  });
  const save = (g: Goal) => { setGoal(g); localStorage.setItem(GOAL_KEY, JSON.stringify(g)); };
  const pct = goal.target > 0 ? Math.min(100, Math.round((saved / goal.target) * 100)) : 0;
  const falta = Math.max(0, goal.target - saved);
  const dias = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86_400_000));
  const porMes = dias > 0 ? Math.ceil(falta / (dias / 30)) : falta;

  return (
    <Card className="mb-6 border-brand-500/30">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h3 className="font-bold">🍁 Meta de ahorro · Mudanza a Canadá</h3>
        <Badge tone={pct >= 100 ? 'green' : 'brand'}>{pct}%</Badge>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Tu ahorro acumulado (movimientos tipo "Ahorro") avanza hacia la meta. Faltan <b>{dias} días</b> para tu fecha objetivo.</p>
      <Progress value={saved} max={goal.target || 1} className="mb-2" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-4">
        <div className="rounded-xl bg-stone-200/40 dark:bg-white/5 p-2"><p className="font-display text-lg font-extrabold text-emerald-600 dark:text-emerald-400">${saved.toFixed(0)}</p><p className="text-[11px] text-stone-500">ahorrado</p></div>
        <div className="rounded-xl bg-stone-200/40 dark:bg-white/5 p-2"><p className="font-display text-lg font-extrabold">${falta.toFixed(0)}</p><p className="text-[11px] text-stone-500">te falta</p></div>
        <div className="rounded-xl bg-stone-200/40 dark:bg-white/5 p-2"><p className="font-display text-lg font-extrabold">{dias}</p><p className="text-[11px] text-stone-500">días restantes</p></div>
        <div className="rounded-xl bg-brand-500/10 p-2"><p className="font-display text-lg font-extrabold text-brand-600 dark:text-brand-400">${porMes.toFixed(0)}</p><p className="text-[11px] text-stone-500">ahorra/mes</p></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-xs text-stone-500">Meta ($)
          <input type="number" value={goal.target} onChange={(e) => save({ ...goal, target: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </label>
        <label className="block text-xs text-stone-500">Fecha objetivo
          <input type="date" value={goal.deadline} onChange={(e) => save({ ...goal, deadline: e.target.value })} className="mt-1 w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </label>
      </div>
    </Card>
  );
}

const TYPE_LABEL = { INCOME: 'Ingreso', EXPENSE: 'Gasto', SAVING: 'Ahorro' } as const;
const TYPE_TONE = { INCOME: 'green', EXPENSE: 'amber', SAVING: 'brand' } as const;

export default function Finance() {
  const { items, add, remove } = useLocalList<Tx>('finance');
  const [type, setType] = useState<Tx['type']>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const addTx = () => {
    const a = Number(amount);
    if (!a || a <= 0) return;
    add({ id: uid(), type, amount: a, category: category.trim() || 'General', date: new Date().toISOString() });
    setAmount(''); setCategory('');
  };

  const sum = (t: Tx['type']) => items.filter((x) => x.type === t).reduce((s, x) => s + x.amount, 0);
  const income = sum('INCOME'), expense = sum('EXPENSE'), saving = sum('SAVING');

  // Gasto por categoría (top)
  const byCat = Object.entries(
    items.filter((x) => x.type === 'EXPENSE').reduce<Record<string, number>>((acc, x) => {
      acc[x.category] = (acc[x.category] ?? 0) + x.amount;
      return acc;
    }, {}),
  ).map(([category, gasto]) => ({ category, gasto })).sort((a, b) => b.gasto - a.gasto).slice(0, 6);

  return (
    <>
      <PageHeader title="Finanzas" subtitle="Registra ingresos, gastos y ahorro. Tú llevas el control." icon="◇" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <Stat label="Ingresos" value={`$${income.toFixed(0)}`} />
        <Stat label="Gastos" value={`$${expense.toFixed(0)}`} />
        <Stat label="Ahorro" value={`$${saving.toFixed(0)}`} />
        <Stat label="Balance" value={`$${(income - expense).toFixed(0)}`} sub={income ? `${Math.round(((income - expense) / income) * 100)}% libre` : undefined} />
        <Stat label="Tasa de ahorro" value={income ? `${Math.round((saving / income) * 100)}%` : '—'} sub="de tus ingresos" />
      </div>

      {income > 0 && (() => {
        const rate = Math.round((saving / income) * 100);
        const tone = rate >= 20 ? 'green' : rate >= 10 ? 'brand' : 'amber';
        const msg = expense > income
          ? '⚠ Gastas más de lo que ingresas. Recorta una categoría grande este mes.'
          : rate >= 20 ? '🔥 ¡Excelente! Ahorras 20%+ de tus ingresos. Vas directo a la mudanza. 🍁'
          : rate >= 10 ? '👍 Buen ahorro. Intenta subir al 20% para acelerar tu meta.'
          : '💡 Apunta a ahorrar al menos el 10-20% de tus ingresos. Empieza por automatizarlo.';
        return (
          <Card className="mb-6 border-l-4" style={{ borderLeftColor: tone === 'green' ? '#10b981' : tone === 'amber' ? '#f59e0b' : 'rgb(var(--brand-500))' }}>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone={tone}>Salud financiera</Badge>
              <p className="text-sm text-stone-600 dark:text-stone-300">{msg}</p>
            </div>
          </Card>
        );
      })()}

      <SavingsGoal saved={saving} />

      <Card className="mb-6">
        <h3 className="font-bold mb-3">Nuevo movimiento</h3>
        <div className="grid sm:grid-cols-4 gap-2">
          <select value={type} onChange={(e) => setType(e.target.value as Tx['type'])} className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="INCOME">Ingreso</option>
            <option value="EXPENSE">Gasto</option>
            <option value="SAVING">Ahorro</option>
          </select>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Monto" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTx()} placeholder="Categoría (Comida, Ocio…)" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <button onClick={addTx} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">+ Registrar</button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold mb-3">Gasto por categoría</h3>
          {byCat.length === 0 ? (
            <p className="text-sm text-stone-500">Registra gastos para ver el desglose.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byCat}>
                <CartesianGrid strokeDasharray="3 3" stroke="#a8a29e33" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#a8a29e" />
                <YAxis tick={{ fontSize: 11 }} stroke="#a8a29e" />
                <Tooltip />
                <Legend />
                <Bar dataKey="gasto" name="Gasto" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="font-bold mb-3">Movimientos recientes</h3>
          {items.length === 0 ? (
            <p className="text-sm text-stone-500">Sin movimientos todavía.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
              {items.map((x) => (
                <div key={x.id} className="flex items-center justify-between rounded-lg border border-stone-200/70 dark:border-white/10 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Badge tone={TYPE_TONE[x.type]}>{TYPE_LABEL[x.type]}</Badge>
                    <span className="text-sm">{x.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${x.type === 'EXPENSE' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {x.type === 'EXPENSE' ? '−' : '+'}${x.amount.toFixed(0)}
                    </span>
                    <button onClick={() => remove(x.id)} className="text-xs text-stone-400 hover:text-red-500">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
