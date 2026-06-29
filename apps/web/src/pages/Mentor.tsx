import { useState } from 'react';
import { Card, PageHeader, Badge } from '../components/ui';

const SEED = [
  { role: 'mentor', text: 'Hola. Revisé tu semana: 4/5 entrenos, -0.5 kg, 5 lecciones de inglés y 3 retos de código. ¿En qué quieres que nos enfoquemos hoy?' },
];

export default function Mentor() {
  const [msgs, setMsgs] = useState(SEED);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMsgs((m) => [
      ...m,
      { role: 'user', text: input },
      { role: 'mentor', text: 'Basándome en tu historial, te recomiendo priorizar pronunciation (tu área más débil, 49%) y mantener la racha de entrenos. Te dejé 2 ejercicios listos. 💪' },
    ]);
    setInput('');
  };

  return (
    <>
      <PageHeader title="Mentor IA" subtitle="Tu acompañante que recuerda tu historial y te guía cada día." icon="🧠" />

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card><p className="text-xs uppercase text-slate-500">Consejo diario</p><p className="text-sm mt-1">Cierra el objetivo de inglés (5/7) hoy.</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Consejo semanal</p><p className="text-sm mt-1">Sube el cardio: tu % grasa baja lento.</p></Card>
        <Card><p className="text-xs uppercase text-slate-500">Advertencia</p><Badge tone="amber">Sueño bajo 3 días</Badge></Card>
      </div>

      <Card className="flex flex-col h-[420px]">
        <div className="flex-1 overflow-auto space-y-3 pr-1">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-200/70 dark:bg-white/10'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Pregúntale a tu mentor…"
            className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button onClick={send} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500">Enviar</button>
        </div>
      </Card>
    </>
  );
}
