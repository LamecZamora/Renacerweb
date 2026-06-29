import { useState } from 'react';
import { Card, PageHeader, Badge, Progress } from '../components/ui';
import { useLocalList, uid } from '../lib/storage';
import { hasGh, ghUser, ghCreateRepo, ghPutFile, slug } from '../lib/github';
import { COURSES } from '../data/courses';
import { learningDone, courseLearned } from '../lib/learning';
import { PROJECT_IDEAS, type ProjectIdea } from '../data/projectIdeas';
import { toast } from '../lib/toast';

type Task = { id: string; title: string; done: boolean };
type Project = { id: string; title: string; type: string; difficulty: number; tasks: Task[]; updatedAt?: string };

const COURSE_MAP = Object.fromEntries(COURSES.map((c) => [c.id, c]));

const HARD = ['sistema', 'distribu', 'compilador', 'kernel', 'blockchain', 'machine', 'inteligencia', 'red neuronal', 'tiempo real', 'multijugador', 'microservicio', 'encripta', 'seguridad', 'assembly', 'sistema operativo', 'base de datos', 'rest', 'motor', 'engine', '3d', 'realidad', 'c++'];
const MEDIUM = ['app', 'aplicación', 'aplicacion', 'api', 'web', 'móvil', 'movil', 'android', 'dashboard', 'panel', 'crud', 'juego', 'game', 'bot', 'scraper', 'ecommerce', 'tienda', 'chat'];
const EASY = ['landing', 'página', 'pagina', 'todo', 'lista', 'calculadora', 'portfolio', 'blog', 'reloj', 'contador', 'formulario'];

const TYPE_WEIGHT: Record<string, number> = { Videojuego: 2, Móvil: 1, API: 1, Web: 0, Desarrollo: 0, Otro: 0 };
const LABELS = ['', 'Muy fácil', 'Fácil', 'Media', 'Difícil', 'Muy difícil'];

// Plantillas de pasos recomendados por tipo
const STEPS: Record<string, string[]> = {
  Web: ['Definir objetivo y público', 'Crear wireframe / diseño', 'Configurar repositorio', 'Maquetar estructura (HTML/CSS)', 'Añadir interactividad', 'Hacer responsive', 'Desplegar online'],
  Móvil: ['Definir pantallas principales', 'Diseñar la interfaz', 'Configurar el proyecto', 'Implementar navegación', 'Conectar datos / almacenamiento', 'Probar en dispositivo', 'Publicar / compartir'],
  Videojuego: ['Definir la mecánica principal', 'Diseñar niveles', 'Crear personajes / sprites', 'Programar controles', 'Añadir sonido y música', 'Balancear dificultad', 'Pulir y testear'],
  API: ['Diseñar los endpoints', 'Definir el modelo de datos', 'Configurar el servidor', 'Implementar CRUD', 'Añadir autenticación', 'Documentar la API', 'Probar y desplegar'],
  Desarrollo: ['Definir requisitos', 'Planear la arquitectura', 'Configurar el entorno', 'Implementar funcionalidad central', 'Escribir pruebas', 'Refactorizar', 'Documentar'],
  Otro: ['Definir el objetivo', 'Investigar', 'Planear los pasos', 'Ejecutar', 'Revisar resultados'],
};

function estimateDifficulty(title: string, type: string): number {
  const t = title.toLowerCase();
  let score = 2;
  HARD.forEach((k) => { if (t.includes(k)) score += 2; });
  MEDIUM.forEach((k) => { if (t.includes(k)) score += 1; });
  EASY.forEach((k) => { if (t.includes(k)) score -= 1; });
  score += TYPE_WEIGHT[type] ?? 0;
  if (t.split(/\s+/).filter(Boolean).length > 6) score += 1;
  return Math.max(1, Math.min(5, Math.round(score)));
}

function suggestSteps(p: Project): string[] {
  const base = STEPS[p.type] ?? STEPS.Desarrollo;
  const extra: string[] = [];
  const t = p.title.toLowerCase();
  if (/login|auth|sesi[oó]n|usuario/.test(t)) extra.push('Implementar autenticación / login');
  if (/base de datos|db|sql|datos/.test(t)) extra.push('Diseñar la base de datos');
  if (/pago|tienda|ecommerce/.test(t)) extra.push('Integrar pasarela de pago');
  const all = [...base, ...extra];
  return all.filter((s) => !p.tasks.some((task) => task.title.toLowerCase() === s.toLowerCase()));
}

function statusOf(p: Project): { label: string; tone: 'brand' | 'green' | 'amber' | 'slate' } {
  const total = p.tasks.length;
  const done = p.tasks.filter((t) => t.done).length;
  if (total === 0) return { label: 'Sin tareas', tone: 'slate' };
  if (done === 0) return { label: 'Por empezar', tone: 'amber' };
  if (done < total) return { label: 'En progreso', tone: 'brand' };
  return { label: 'Completado', tone: 'green' };
}

function Stack({ requires }: { requires: string[] }) {
  return (
    <span className="flex flex-wrap items-center gap-1">
      {requires.map((id) => {
        const c = COURSE_MAP[id];
        return (
          <span key={id} className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium"
            style={{ background: `${c?.color ?? '#888'}1e`, color: c?.color ?? '#888' }}>
            {c?.icon} {c?.name ?? id}
          </span>
        );
      })}
    </span>
  );
}

function IdeaCard({ idea, missing, onCreate, created }: { idea: ProjectIdea; missing: string[]; onCreate: () => void; created: boolean }) {
  const ready = missing.length === 0;
  return (
    <div className={`rounded-2xl border p-4 ${ready ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-stone-200/70 dark:border-white/10'}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-bold text-sm">{idea.title}</h4>
        <div className="flex gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < idea.difficulty ? 'text-brand-500 text-xs' : 'text-stone-300 dark:text-white/15 text-xs'}>★</span>
          ))}
        </div>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">{idea.desc}</p>
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <Stack requires={idea.requires} />
        {idea.combo && <Badge tone="brand">🔀 Combo</Badge>}
        {idea.vancouver && <Badge tone="amber">🍁 Portafolio</Badge>}
      </div>
      {ready ? (
        created
          ? <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✓ Ya está en tus proyectos</p>
          : <button onClick={onCreate} className="w-full rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:opacity-95">+ Crear este proyecto (con pasos)</button>
      ) : (
        <p className="text-xs text-amber-600">🔒 Te falta: {missing.map((id) => COURSE_MAP[id]?.name ?? id).join(', ')} (≥50%)</p>
      )}
    </div>
  );
}

export default function Projects() {
  const { items, add, update, remove } = useLocalList<Project>('projects');
  const [showLocked, setShowLocked] = useState(false);
  const learnDone = learningDone();
  const existingTitles = new Set(items.map((p) => p.title.toLowerCase()));

  const ideasRanked = PROJECT_IDEAS.map((idea) => ({
    idea, missing: idea.requires.filter((id) => !courseLearned(id, learnDone)),
  })).sort((a, b) => a.missing.length - b.missing.length || a.idea.difficulty - b.idea.difficulty);
  const ready = ideasRanked.filter((x) => x.missing.length === 0);
  const almost = ideasRanked.filter((x) => x.missing.length === 1);
  const locked = ideasRanked.filter((x) => x.missing.length >= 2);

  const createFromIdea = (idea: ProjectIdea) => {
    add({
      id: uid(), title: idea.title, type: idea.type, difficulty: idea.difficulty,
      tasks: idea.tasks.map((t) => ({ id: uid(), title: t, done: false })),
      updatedAt: new Date().toISOString(),
    });
    toast(`🚀 Proyecto creado: ${idea.title}`);
  };

  // ── Asistente: describe qué quieres construir y te da pasos + ideas ──
  const [assistQ, setAssistQ] = useState('');
  const detectType = (q: string): string => {
    const t = q.toLowerCase();
    if (/juego|game|videojuego/.test(t)) return 'Videojuego';
    if (/\bapi\b|backend|servidor|endpoint|micro/.test(t)) return 'API';
    if (/\bapp\b|m[oó]vil|android|ios|celular/.test(t)) return 'Móvil';
    if (/web|p[aá]gina|sitio|landing|portafolio|dashboard|tienda/.test(t)) return 'Web';
    return 'Desarrollo';
  };
  const assistType = detectType(assistQ);
  const assistSteps = (() => {
    const base = STEPS[assistType] ?? STEPS.Desarrollo;
    const extra: string[] = [];
    const t = assistQ.toLowerCase();
    if (/login|auth|sesi[oó]n|usuario|cuenta|registr/.test(t)) extra.push('Implementar autenticación / login');
    if (/base de datos|bd|\bdb\b|sql|datos|guardar/.test(t)) extra.push('Diseñar la base de datos');
    if (/pago|tienda|ecommerce|vender|carrito/.test(t)) extra.push('Integrar pasarela de pago');
    if (/tiempo real|chat|mensaj/.test(t)) extra.push('Añadir tiempo real (WebSockets)');
    if (/clima|api externa|consumir|noticias|datos de/.test(t)) extra.push('Consumir una API externa (fetch)');
    if (/desplegar|publicar|subir|online/.test(t)) extra.push('Desplegar online (Vercel / GitHub Pages)');
    return [...base, ...extra];
  })();
  const assistWords = assistQ.toLowerCase().split(/\s+/).filter((w) => w.length >= 4);
  const assistIdeas = assistQ.trim().length >= 3
    ? PROJECT_IDEAS.filter((idea) => { const hay = (idea.title + ' ' + idea.desc).toLowerCase(); return assistWords.some((w) => hay.includes(w)); }).slice(0, 3)
    : [];
  const createFromQuery = () => {
    if (!assistQ.trim()) return;
    add({ id: uid(), title: assistQ.trim().slice(0, 60), type: assistType, difficulty: estimateDifficulty(assistQ, assistType), tasks: assistSteps.map((s) => ({ id: uid(), title: s, done: false })), updatedAt: new Date().toISOString() });
    toast('🚀 Proyecto creado con sus pasos');
    setAssistQ('');
  };

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Desarrollo');
  const [taskInput, setTaskInput] = useState<Record<string, string>>({});
  const [showSteps, setShowSteps] = useState<Record<string, boolean>>({});
  const [ghStatus, setGhStatus] = useState<Record<string, string>>({});

  const subirGitHub = async (p: Project) => {
    if (!hasGh()) { setGhStatus((s) => ({ ...s, [p.id]: 'Conéctate primero en el módulo 🐙 GitHub.' })); return; }
    setGhStatus((s) => ({ ...s, [p.id]: 'Subiendo a GitHub…' }));
    try {
      const user = await ghUser();
      const name = slug(p.title);
      const repo = await ghCreateRepo(name, p.title, false);
      const readme = `# ${p.title}\n\nProyecto **${p.type}** generado con RENACER AI 🌅\n\n## Tareas\n${p.tasks.map((t) => `- [${t.done ? 'x' : ' '}] ${t.title}`).join('\n') || '- (sin tareas aún)'}\n`;
      await ghPutFile(user.login, name, 'README.md', readme, 'docs: README inicial (RENACER AI)');
      setGhStatus((s) => ({ ...s, [p.id]: '✅ Repo creado' }));
      window.open(repo.html_url, '_blank');
    } catch (e) {
      setGhStatus((s) => ({ ...s, [p.id]: '⚠ ' + (e instanceof Error ? e.message : 'Error') }));
    }
  };

  const estimated = estimateDifficulty(title, type);
  const now = () => new Date().toISOString();

  const addProject = () => {
    if (!title.trim()) return;
    add({ id: uid(), title: title.trim(), type, difficulty: estimateDifficulty(title.trim(), type), tasks: [], updatedAt: now() });
    setTitle('');
  };

  const addTask = (p: Project, custom?: string) => {
    const t = (custom ?? taskInput[p.id] ?? '').trim();
    if (!t) return;
    update(p.id, { tasks: [...p.tasks, { id: uid(), title: t, done: false }], updatedAt: now() });
    if (!custom) setTaskInput((s) => ({ ...s, [p.id]: '' }));
  };

  const addAllSteps = (p: Project) => {
    const steps = suggestSteps(p).map((title) => ({ id: uid(), title, done: false }));
    update(p.id, { tasks: [...p.tasks, ...steps], updatedAt: now() });
  };

  const toggleTask = (p: Project, taskId: string) =>
    update(p.id, { tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)), updatedAt: now() });

  return (
    <>
      <PageHeader title="Proyectos" subtitle="Crea proyectos; sugiero pasos y el estado se actualiza con lo que marcas." icon="◳" />

      <Card className="mb-6">
        <h3 className="font-bold mb-3">Nuevo proyecto</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addProject()}
            placeholder="Ej. Sistema médico en Java, Landing page…"
            className="sm:col-span-2 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            {['Desarrollo', 'Web', 'Móvil', 'Videojuego', 'API', 'Otro'].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-stone-200/40 dark:bg-white/5 px-3 py-2">
          <span className="text-xs text-stone-500 dark:text-stone-400">Dificultad estimada:</span>
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < estimated ? 'text-brand-500' : 'text-stone-300 dark:text-white/15'}>★</span>
            ))}
          </span>
          <Badge tone={estimated >= 4 ? 'amber' : estimated <= 2 ? 'green' : 'brand'}>{LABELS[estimated]}</Badge>
        </div>
        <button onClick={addProject} className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">+ Crear proyecto</button>
      </Card>

      {/* Asistente de ideas: describe qué quieres construir */}
      <Card className="mb-6 border-brand-500/30">
        <div className="flex items-center gap-2 mb-1"><span>🧭</span><h3 className="font-bold">¿Qué quieres construir?</h3></div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Descríbelo en una frase y te doy los pasos recomendados y proyectos parecidos. Ej: "una tienda online con login y pagos".</p>
        <div className="flex gap-2">
          <input value={assistQ} onChange={(e) => setAssistQ(e.target.value)} placeholder="Quiero hacer…"
            className="flex-1 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          {assistQ.trim() && <button onClick={() => setAssistQ('')} className="rounded-lg border border-stone-200 dark:border-white/10 px-3 py-2 text-sm">✕</button>}
        </div>

        {assistQ.trim().length >= 3 && (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400 mb-2">📋 Pasos recomendados <Badge tone="slate">{assistType}</Badge></p>
              <ol className="space-y-1">
                {assistSteps.map((s, i) => <li key={i} className="text-sm text-stone-600 dark:text-stone-300 flex gap-2"><span className="text-brand-500 font-bold">{i + 1}.</span>{s}</li>)}
              </ol>
              <button onClick={createFromQuery} className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-ink-950 hover:opacity-95">+ Crear este proyecto con sus pasos</button>
            </div>
            {assistIdeas.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">💡 Proyectos parecidos</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  {assistIdeas.map((idea) => (
                    <button key={idea.id} onClick={() => createFromIdea(idea)} className="text-left rounded-xl border border-stone-200/70 dark:border-white/10 p-2.5 hover:ring-2 hover:ring-brand-500/40 transition">
                      <p className="text-sm font-bold">{idea.title}</p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">{idea.desc}</p>
                      <p className="mt-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400">+ Crear</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Proyectos sugeridos según tus cursos */}
      <Card className="mb-6 border-brand-500/30">
        <div className="flex items-center gap-2 mb-1"><span>💡</span><h3 className="font-bold">Proyectos sugeridos para ti</h3></div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">Ideas a tu medida según los cursos que ya dominas (≥50%), incluyendo combos de varios lenguajes. Crea uno y te pongo los primeros pasos. 🌶️</p>

        {ready.length > 0 ? (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">✅ Puedes construirlos ya ({ready.length})</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {ready.map(({ idea, missing }) => (
                <IdeaCard key={idea.id} idea={idea} missing={missing} created={existingTitles.has(idea.title.toLowerCase())} onCreate={() => createFromIdea(idea)} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-stone-500 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">Todavía no dominas ningún curso al 50%. Avanza en <b>📚 Cursos</b> y aquí aparecerán proyectos listos para construir. Mientras, aquí tienes los que están a un curso de distancia 👇</p>
        )}

        {almost.length > 0 && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600 mb-2">🔜 Casi listos · te falta 1 curso ({almost.length})</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {almost.slice(0, 4).map(({ idea, missing }) => (
                <IdeaCard key={idea.id} idea={idea} missing={missing} created={existingTitles.has(idea.title.toLowerCase())} onCreate={() => createFromIdea(idea)} />
              ))}
            </div>
          </>
        )}

        {locked.length > 0 && (
          <>
            <button onClick={() => setShowLocked((v) => !v)} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              {showLocked ? 'Ocultar' : `Ver ${locked.length} ideas más (requieren más cursos) ▾`}
            </button>
            {showLocked && (
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                {locked.map(({ idea, missing }) => (
                  <IdeaCard key={idea.id} idea={idea} missing={missing} created={existingTitles.has(idea.title.toLowerCase())} onCreate={() => createFromIdea(idea)} />
                ))}
              </div>
            )}
          </>
        )}
      </Card>

      {items.length === 0 ? (
        <Card><p className="text-sm text-stone-500">Sin proyectos todavía. Crea el primero arriba.</p></Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {items.map((p) => {
            const done = p.tasks.filter((t) => t.done).length;
            const status = statusOf(p);
            const suggestions = suggestSteps(p);
            return (
              <Card key={p.id}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{p.type} · {LABELS[p.difficulty]}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={status.tone}>{status.label}</Badge>
                    <button onClick={() => remove(p.id)} className="text-xs text-stone-400 hover:text-red-500">✕</button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < p.difficulty ? 'text-brand-500' : 'text-stone-300 dark:text-white/15'}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-stone-400">{done}/{p.tasks.length} tareas</span>
                </div>
                <Progress value={done} max={p.tasks.length || 1} className="mb-2" />
                {p.updatedAt && <p className="text-[11px] text-stone-400 mb-3">Actualizado: {new Date(p.updatedAt).toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>}

                <ul className="space-y-1.5 mb-3">
                  {p.tasks.map((t) => (
                    <li key={t.id}>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={t.done} onChange={() => toggleTask(p, t.id)} className="accent-brand-600 h-4 w-4" />
                        <span className={t.done ? 'line-through text-stone-400' : ''}>{t.title}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                {/* Pasos recomendados */}
                {suggestions.length > 0 && (
                  <div className="mb-3 rounded-xl bg-brand-500/10 border border-brand-500/20 p-3">
                    <button onClick={() => setShowSteps((s) => ({ ...s, [p.id]: !s[p.id] }))} className="flex w-full items-center justify-between text-xs font-semibold text-brand-700 dark:text-brand-400">
                      <span>✨ Pasos recomendados ({suggestions.length})</span>
                      <span>{showSteps[p.id] ? '▲' : '▼'}</span>
                    </button>
                    {showSteps[p.id] && (
                      <div className="mt-2 space-y-1">
                        {suggestions.map((s) => (
                          <div key={s} className="flex items-center justify-between gap-2">
                            <span className="text-xs text-stone-600 dark:text-stone-300">• {s}</span>
                            <button onClick={() => addTask(p, s)} className="rounded bg-brand-500/20 text-brand-700 dark:text-brand-400 px-2 py-0.5 text-xs font-semibold shrink-0">+ añadir</button>
                          </div>
                        ))}
                        <button onClick={() => addAllSteps(p)} className="mt-1 w-full rounded-lg bg-brand-600 py-1.5 text-xs font-semibold text-ink-950 hover:opacity-95">Añadir todos los pasos</button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    value={taskInput[p.id] ?? ''}
                    onChange={(e) => setTaskInput((s) => ({ ...s, [p.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addTask(p)}
                    placeholder="Nueva tarea…"
                    className="flex-1 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button onClick={() => addTask(p)} className="rounded-lg bg-brand-500/15 text-brand-700 dark:text-brand-400 px-3 py-1.5 text-sm font-semibold">+</button>
                </div>

                <div className="mt-3 flex items-center gap-2 border-t border-stone-200/60 dark:border-white/10 pt-3">
                  <button onClick={() => subirGitHub(p)} className="rounded-lg border border-stone-200 dark:border-white/10 px-3 py-1.5 text-xs font-semibold hover:border-brand-500">🐙 Subir a GitHub</button>
                  {ghStatus[p.id] && <span className="text-xs text-stone-500">{ghStatus[p.id]}</span>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
