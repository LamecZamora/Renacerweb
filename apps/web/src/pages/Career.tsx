import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, PageHeader, Progress, Badge } from '../components/ui';
import { useLocalList, uid, countDone } from '../lib/storage';
import { COURSES } from '../data/courses';
import { courseProgress, learningDone, levelDoneCount } from '../lib/learning';
import { computeStats } from '../lib/stats';
import { ENGLISH_TOTAL, SPEAKING_TOTAL } from '../data/english';
import { type Job } from '../data/jobs';
import { computeCRS, crsVerdict, EDUCATION, type CrsInput, type CheckPhase } from '../data/canada';
import { DESTINATIONS } from '../data/destinations';

const CRS_KEY = 'renacer_crs';
const DEST_KEY = 'renacer_destination';
const DEFAULT_CRS: CrsInput = { age: 24, education: 'bachelor', clb: 7, canExp: 0, foreignExp: 3, pnp: false, jobOffer: false, canStudy: false, sibling: false, french: false };

function CrsCalculator() {
  const [input, setInput] = useState<CrsInput>(() => {
    try { return { ...DEFAULT_CRS, ...JSON.parse(localStorage.getItem(CRS_KEY) ?? '{}') }; } catch { return DEFAULT_CRS; }
  });
  const set = <K extends keyof CrsInput>(k: K, v: CrsInput[K]) => {
    const next = { ...input, [k]: v }; setInput(next); localStorage.setItem(CRS_KEY, JSON.stringify(next));
  };
  const { total, breakdown } = computeCRS(input);
  const verdict = crsVerdict(total);
  const num = (k: keyof CrsInput) => input[k] as number;

  return (
    <Card className="mb-6">
      <h3 className="font-bold mb-1">Calculadora CRS · Express Entry</h3>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">Estimación para solicitante soltero. No es asesoría legal: úsala para ver qué subir.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block text-sm">Edad: <b>{num('age')}</b>
            <input type="range" min={18} max={50} value={num('age')} onChange={(e) => set('age', Number(e.target.value))} className="w-full accent-brand-600" />
          </label>
          <label className="block text-sm">Educación
            <select value={input.education} onChange={(e) => set('education', e.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              {EDUCATION.map((e) => <option key={e.key} value={e.key}>{e.label}</option>)}
            </select>
          </label>
          <label className="block text-sm">Nivel de inglés CLB: <b>{num('clb')}</b> <span className="text-xs text-stone-400">(CLB7 ≈ IELTS 6.0)</span>
            <input type="range" min={4} max={10} value={num('clb')} onChange={(e) => set('clb', Number(e.target.value))} className="w-full accent-brand-600" />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-xs">Exp. en Canadá (años)
              <select value={num('canExp')} onChange={(e) => set('canExp', Number(e.target.value))} className="mt-1 w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-2 py-1 text-sm">
                {[0,1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="block text-xs">Exp. fuera (años)
              <select value={num('foreignExp')} onChange={(e) => set('foreignExp', Number(e.target.value))} className="mt-1 w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-2 py-1 text-sm">
                {[0,1,2,3].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {([['pnp','Nominación provincial (+600)'],['jobOffer','Oferta de trabajo (+50)'],['canStudy','Estudios en Canadá (+30)'],['sibling','Hermano/a en Canadá (+15)'],['french','Francés NCLC 7+ (+25)']] as const).map(([k, label]) => (
              <label key={k} className="flex items-center gap-1.5 cursor-pointer col-span-2">
                <input type="checkbox" checked={input[k] as boolean} onChange={(e) => set(k, e.target.checked)} className="accent-brand-600 h-4 w-4" />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white p-5 text-center mb-3">
            <p className="text-xs uppercase tracking-[0.18em] opacity-80">Tu CRS estimado</p>
            <p className="font-display text-5xl font-extrabold">{total}</p>
            <Badge tone={verdict.tone}>{verdict.txt}</Badge>
          </div>
          <div className="space-y-1.5">
            {breakdown.map((b) => (
              <div key={b.label} className="flex items-center justify-between text-sm">
                <span className="text-stone-500 dark:text-stone-400">{b.label}</span>
                <b className="font-display">{b.points}</b>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-stone-400">Cortes recientes rondan 480-540; con PNP el corte baja mucho. Tu mejor palanca: <b>inglés CLB 9+</b> y una <b>nominación provincial</b>.</p>
        </div>
      </div>
    </Card>
  );
}

function MigrationChecklist({ phases, storageKey, title }: { phases: CheckPhase[]; storageKey: string; title: string }) {
  const [doneSet, setDoneSet] = useState<Set<string>>(() => {
    try { return new Set<string>(JSON.parse(localStorage.getItem(storageKey) ?? '[]')); } catch { return new Set(); }
  });
  const toggle = (id: string) => {
    const next = new Set(doneSet); next.has(id) ? next.delete(id) : next.add(id);
    setDoneSet(next); localStorage.setItem(storageKey, JSON.stringify([...next]));
  };
  const total = phases.reduce((n, p) => n + p.items.length, 0);
  const done = phases.reduce((n, p) => n + p.items.filter((i) => doneSet.has(i.id)).length, 0);

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="font-bold">{title}</h3>
        <Badge tone={done === total ? 'green' : 'brand'}>{done}/{total} completado</Badge>
      </div>
      <Progress value={done} max={total} className="mb-4" />
      <div className="grid sm:grid-cols-2 gap-4">
        {phases.map((phase) => {
          const pDone = phase.items.filter((i) => doneSet.has(i.id)).length;
          return (
            <div key={phase.id} className="rounded-xl border border-stone-200/70 dark:border-white/10 p-3">
              <p className="font-semibold text-sm mb-2">{phase.title} <span className="text-xs text-stone-400">({pDone}/{phase.items.length})</span></p>
              <ul className="space-y-1.5">
                {phase.items.map((it) => (
                  <li key={it.id}>
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={doneSet.has(it.id)} onChange={() => toggle(it.id)} className="accent-emerald-600 h-4 w-4 mt-0.5" />
                      <span className={doneSet.has(it.id) ? 'line-through text-stone-400' : ''}>{it.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

type App = { id: string; empresa: string; ciudad: string; fecha: string; estado: string };
const ESTADOS = ['Aplicado', 'Entrevista', 'Oferta', 'Rechazado'];
const ESTADO_TONE: Record<string, 'brand' | 'green' | 'amber' | 'slate'> = { Aplicado: 'brand', Entrevista: 'amber', Oferta: 'green', Rechazado: 'slate' };

export default function Career() {
  const [destId, setDestId] = useState(() => localStorage.getItem(DEST_KEY) || 'vancouver');
  const dest = DESTINATIONS.find((d) => d.id === destId) ?? DESTINATIONS[0];
  const pickDest = (id: string) => { setDestId(id); localStorage.setItem(DEST_KEY, id); };

  const done = learningDone();
  const java = COURSES.find((c) => c.id === 'java')!;
  const react = COURSES.find((c) => c.id === 'react')!;
  const lvPct = (i: number) => { const lv = java.levels[i]; return lv.exercises.length ? Math.round((levelDoneCount(lv, done) / lv.exercises.length) * 100) : 0; };

  const st = computeStats();
  // Indicadores 100% automáticos, derivados de tu progreso real (ya no son manuales).
  const portfolioPct = Math.min(100, st.projectsCompleted * 25 + Math.min(40, st.projects * 10));
  const cvPct = Math.min(100, st.coursesCompleted * 12 + st.projectsCompleted * 16);
  const interviewPct = Math.min(100, Math.round((countDone('interview') / 20) * 100));

  const indicators: { key: string; label: string; pct: number }[] = [
    { key: 'ingles', label: 'Inglés', pct: Math.min(100, Math.round((countDone('english') / (ENGLISH_TOTAL + SPEAKING_TOTAL)) * 100)) },
    { key: 'java', label: 'Java', pct: courseProgress(java, done).pct },
    { key: 'spring', label: 'Spring Boot', pct: lvPct(8) },
    { key: 'react', label: 'React', pct: courseProgress(react, done).pct },
    { key: 'docker', label: 'Docker', pct: lvPct(9) },
    { key: 'github', label: 'GitHub / Portafolio', pct: portfolioPct },
    { key: 'cv', label: 'CV / Resume', pct: cvPct },
    { key: 'entrevistas', label: 'Entrevistas (práctica)', pct: interviewPct },
  ];
  const overall = Math.round(indicators.reduce((s, i) => s + i.pct, 0) / indicators.length);

  const { items: apps, add, update, remove } = useLocalList<App>('applications');
  const [empresa, setEmpresa] = useState('');
  const [ciudad, setCiudad] = useState(dest.city);
  const addApp = () => { if (!empresa.trim()) return; add({ id: uid(), empresa: empresa.trim(), ciudad: ciudad.trim() || dest.city, fecha: new Date().toISOString(), estado: 'Aplicado' }); setEmpresa(''); };

  // Skill gap
  const SKILLS: Record<string, number> = {
    java: indicators[1].pct, 'spring boot': indicators[2].pct, spring: indicators[2].pct,
    react: indicators[3].pct, docker: indicators[4].pct, sql: lvPct(7), git: portfolioPct,
    github: portfolioPct, inglés: indicators[0].pct, ingles: indicators[0].pct, english: indicators[0].pct,
  };
  const [req, setReq] = useState('Java, Spring Boot, React, SQL, Docker, Git, Inglés');
  const reqList = req.split(',').map((s) => s.trim()).filter(Boolean);
  const have = reqList.filter((s) => (SKILLS[s.toLowerCase()] ?? 0) >= 50);
  const missing = reqList.filter((s) => (SKILLS[s.toLowerCase()] ?? 0) < 50);
  const compat = reqList.length ? Math.round((have.length / reqList.length) * 100) : 0;

  // Job Matcher
  const { items: userJobs, add: addJob, remove: removeJob } = useLocalList<Job>('jobs');
  const [jt, setJt] = useState('');
  const [jc, setJc] = useState('');
  const [js, setJs] = useState('Java, Spring Boot, SQL');
  const matchOf = (job: Job) => {
    const hit = job.skills.filter((s) => (SKILLS[s.toLowerCase()] ?? 0) >= 50).length;
    return job.skills.length ? Math.round((hit / job.skills.length) * 100) : 0;
  };
  const rankedJobs = [...dest.jobs, ...userJobs]
    .map((j) => ({ ...j, match: matchOf(j), faltan: j.skills.filter((s) => (SKILLS[s.toLowerCase()] ?? 0) < 50) }))
    .sort((a, b) => b.match - a.match);
  const advice = (m: number) => (m >= 70 ? { txt: 'Aplica ya ✅', tone: 'green' as const } : m >= 40 ? { txt: 'Aplica y refuerza', tone: 'amber' as const } : { txt: 'Aún no: estudia más', tone: 'slate' as const });

  return (
    <>
      <PageHeader title="Empleo & Reubicación" subtitle="Tu camino hacia un empleo de desarrollador, en el destino que elijas. 🌍" icon="🌍" />

      {/* Selector de destino */}
      <div className="flex flex-wrap gap-2 mb-5">
        {DESTINATIONS.map((d) => (
          <button key={d.id} onClick={() => pickDest(d.id)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition ${destId === d.id ? 'text-white shadow-glow' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}
            style={destId === d.id ? { background: d.color } : undefined}>
            {d.flag} {d.city}
          </button>
        ))}
      </div>

      <Card className="mb-6 relative overflow-hidden text-white border-0" style={{ background: `linear-gradient(135deg, ${dest.color}, rgba(0,0,0,0.55))` }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] opacity-80">Progreso hacia {dest.city}, {dest.country}</p>
            <p className="font-display text-5xl font-extrabold">{overall}%</p>
            <p className="text-xs opacity-90 mt-1 max-w-md">{dest.tagline}</p>
          </div>
          <span className="text-6xl">{dest.flag}</span>
        </div>
        <div className="mt-3 h-3 rounded-full bg-white/25 overflow-hidden">
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${overall}%` }} />
        </div>
      </Card>

      {/* Nota de visa / reubicación */}
      <Card className="mb-6 border-l-4" style={{ borderLeftColor: dest.color }}>
        <p className="text-sm text-stone-600 dark:text-stone-300"><b style={{ color: dest.color }}>{dest.flag} {dest.city}:</b> {dest.visa}</p>
      </Card>

      {/* Preparación como dev */}
      <Card className="mb-6">
        <h3 className="font-bold mb-3">Tu preparación como desarrollador</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {indicators.map((ind) => (
            <div key={ind.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{ind.label}</span>
                <span className="text-stone-500">{ind.pct}%</span>
              </div>
              <Progress value={ind.pct} max={100} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">Todo se calcula <b>automáticamente</b>: Inglés y lenguajes desde tus cursos; Portafolio y CV desde tus proyectos completados; Entrevistas desde lo que practicas en 🎤 Entrevista. Avanza y los porcentajes suben solos.</p>
      </Card>

      {dest.pointsSystem === 'canada-crs' && <CrsCalculator />}
      <MigrationChecklist key={dest.id} phases={dest.checklist} storageKey={dest.checklistKey} title={`Checklist · ${dest.city}`} />

      {/* Skill Gap Analyzer */}
      <Card className="mb-6">
        <h3 className="font-bold mb-2">Skill Gap Analyzer</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">Pega las tecnologías que pide una vacante (separadas por coma) y mide tu compatibilidad.</p>
        <textarea value={req} onChange={(e) => setReq(e.target.value)} className="w-full h-16 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        <div className="mt-3 grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-stone-200/40 dark:bg-white/5 p-3 text-center">
            <p className="font-display text-2xl font-extrabold" style={{ color: compat >= 70 ? '#22c55e' : compat >= 40 ? '#f59e0b' : '#ef4444' }}>{compat}%</p>
            <p className="text-xs text-stone-500">compatibilidad</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Ya tienes ({have.length})</p>
            <p className="text-xs text-stone-600 dark:text-stone-300">{have.join(', ') || '—'}</p>
          </div>
          <div className="rounded-xl bg-red-500/10 p-3">
            <p className="text-xs font-semibold text-red-500 mb-1">A reforzar ({missing.length})</p>
            <p className="text-xs text-stone-600 dark:text-stone-300">{missing.join(', ') || '¡Todo cubierto!'}</p>
          </div>
        </div>
      </Card>

      {/* Job Matcher */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-bold">Job Matcher · {dest.city}</h3>
          <div className="flex gap-2 flex-wrap">
            {dest.jobLinks.map((l) => (
              <a key={l.name} href={l.url} target="_blank" rel="noreferrer" className="rounded-lg border border-stone-200 dark:border-white/10 px-2.5 py-1 text-xs font-semibold hover:border-brand-500">🔎 {l.name}</a>
            ))}
          </div>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Vacantes ordenadas por tu compatibilidad. Los enlaces abren la búsqueda real de empleos de dev en {dest.city}.</p>

        <div className="space-y-2">
          {rankedJobs.map((j, i) => {
            const a = advice(j.match);
            return (
              <div key={j.id} className={`rounded-xl border p-3 ${i === 0 ? 'border-brand-500 ring-1 ring-brand-500/30' : 'border-stone-200/70 dark:border-white/10'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {i === 0 && j.match > 0 && <Badge tone="brand">⭐ Mejor match</Badge>}
                      <span className="font-semibold text-sm">{j.title}</span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{j.company} · {j.city}{j.salary ? ` · ${j.salary}` : ''} · {j.level}</p>
                    <p className="text-xs mt-1 text-stone-500 dark:text-stone-400">Requiere: {j.skills.join(', ')}</p>
                    {j.faltan.length > 0 && <p className="text-xs text-red-500">Te falta: {j.faltan.join(', ')}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-xl font-extrabold" style={{ color: j.match >= 70 ? '#22c55e' : j.match >= 40 ? '#f59e0b' : '#ef4444' }}>{j.match}%</p>
                    <Badge tone={a.tone}>{a.txt}</Badge>
                    {!dest.jobs.some((s) => s.id === j.id) && <button onClick={() => removeJob(j.id)} className="block mt-1 ml-auto text-xs text-stone-400 hover:text-red-500">✕</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid sm:grid-cols-4 gap-2">
          <input value={jt} onChange={(e) => setJt(e.target.value)} placeholder="Puesto" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <input value={jc} onChange={(e) => setJc(e.target.value)} placeholder="Empresa" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <input value={js} onChange={(e) => setJs(e.target.value)} placeholder="Skills (coma)" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <button onClick={() => { if (jt.trim()) { addJob({ id: uid(), title: jt.trim(), company: jc.trim() || '—', city: dest.city, level: 'Junior', skills: js.split(',').map((s) => s.trim()).filter(Boolean) }); setJt(''); setJc(''); } }}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-ink-950">+ Añadir vacante</button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Interview Trainer */}
        <Card>
          <h3 className="font-bold mb-2">Prepara la entrevista</h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 mb-3">Practica preguntas técnicas y de comportamiento (en inglés para Vancouver/Tokyo) con respuesta modelo.</p>
          <Link to="/interview" className="inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">🎤 Ir al simulador →</Link>
        </Card>

        {/* Application Tracker */}
        <Card>
          <h3 className="font-bold mb-3">Application Tracker</h3>
          {apps.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {ESTADOS.map((s) => {
                const n = apps.filter((a) => a.estado === s).length;
                return <Badge key={s} tone={ESTADO_TONE[s]}>{s}: {n}</Badge>;
              })}
            </div>
          )}
          <div className="flex gap-2 mb-3">
            <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addApp()} placeholder="Empresa" className="flex-1 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Ciudad" className="w-28 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <button onClick={addApp} className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-ink-950">+</button>
          </div>
          {apps.length === 0 ? (
            <p className="text-sm text-stone-500">Aún sin postulaciones. Registra la primera.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-auto pr-1">
              {apps.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-stone-200/70 dark:border-white/10 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{a.empresa}</p>
                    <p className="text-xs text-stone-400">{a.ciudad} · {new Date(a.fecha).toLocaleDateString('es')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={a.estado} onChange={(e) => update(a.id, { estado: e.target.value })} className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-2 py-1 text-xs focus:outline-none">
                      {ESTADOS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <Badge tone={ESTADO_TONE[a.estado]}>{a.estado}</Badge>
                    <button onClick={() => remove(a.id)} className="text-xs text-stone-400 hover:text-red-500">✕</button>
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
