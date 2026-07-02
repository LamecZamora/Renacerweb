import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, PageHeader, Badge } from '../components/ui';
import { extractText } from '../lib/docParser';
import { analyzeStory } from '../lib/robloxPlan';
import { toast } from '../lib/toast';
import { TEMPLATES, SNIPPETS, SNIPPET_CATS, GUIDE } from '../data/roblox';
import { runLua } from '../lib/luaRunner';

const copy = (text: string) => { navigator.clipboard?.writeText(text); toast('📋 Copiado al portapapeles'); };

function CodeBlock({ code, onTry }: { code: string; onTry?: () => void }) {
  return (
    <div className="relative">
      <div className="absolute right-2 top-2 flex gap-1">
        {onTry && <button onClick={onTry} className="rounded-md bg-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-200 hover:bg-emerald-500/50">▶ Probar</button>}
        <button onClick={() => copy(code)} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-stone-200 hover:bg-white/20">📋 Copiar</button>
      </div>
      <pre className="rounded-lg bg-ink-950 text-emerald-300 font-mono text-xs p-3 pr-28 overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  );
}

const LUA_EXAMPLES = [
  { name: 'Hola', code: 'print("¡Hola, Roblox!")' },
  { name: 'Bucle', code: 'for i = 1, 5 do\n  print("Vuelta " .. i)\nend' },
  { name: 'Tabla', code: 'local frutas = {"manzana", "pera", "uva"}\nfor i, f in ipairs(frutas) do\n  print(i, f)\nend' },
  { name: 'Función', code: 'local function doble(n)\n  return n * 2\nend\nprint(doble(21))' },
  { name: 'Condicional', code: 'local vida = 30\nif vida <= 0 then\n  print("Game Over")\nelse\n  print("Sigues vivo: " .. vida)\nend' },
];

function LuaEditor({ code, setCode }: { code: string; setCode: (c: string) => void }) {
  const [out, setOut] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const run = async () => {
    setRunning(true); setOut('Ejecutando…');
    try { setOut(await runLua(code)); } catch (e) { setOut('⚠ ' + (e instanceof Error ? e.message : String(e))); }
    finally { setRunning(false); }
  };
  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 className="font-bold">💻 Editor de Lua</h3>
          <div className="flex flex-wrap gap-1.5">
            {LUA_EXAMPLES.map((ex) => (
              <button key={ex.name} onClick={() => { setCode(ex.code); setOut(null); }} className="rounded-lg bg-stone-200/60 dark:bg-white/5 px-2.5 py-1 text-xs font-semibold hover:text-brand-600 dark:hover:text-brand-400">{ex.name}</button>
            ))}
          </div>
        </div>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
          className="w-full h-52 rounded-lg bg-ink-950 text-emerald-300 font-mono text-xs p-3 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500" />
        <div className="mt-2 flex gap-2">
          <button onClick={run} disabled={running} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-ink-950 hover:opacity-95 disabled:opacity-50">{running ? 'Ejecutando…' : '▶ Ejecutar'}</button>
          <button onClick={() => { setCode(''); setOut(null); }} className="rounded-xl border border-stone-200 dark:border-white/10 px-3 py-2 text-sm font-semibold">Limpiar</button>
        </div>
        {out !== null && (
          <pre className="mt-3 rounded-lg border border-stone-200/70 dark:border-white/10 bg-stone-50 dark:bg-black/40 text-stone-700 dark:text-stone-200 font-mono text-xs p-3 whitespace-pre-wrap max-h-48 overflow-auto">{out}</pre>
        )}
      </Card>
      <Card className="border-l-4 border-amber-500/50">
        <p className="text-sm text-stone-600 dark:text-stone-300"><b className="text-amber-600">Nota:</b> aquí pruebas la <b>lógica de Lua</b> (variables, tablas, funciones, bucles, print). Las APIs de Roblox (<code>workspace</code>, <code>Instance</code>, <code>game</code>…) solo corren dentro de Roblox Studio.</p>
      </Card>
    </>
  );
}

const TABS = [['generar', '🧠 Generador'], ['editor', '💻 Editor'], ['plantillas', '🎲 Plantillas'], ['recetario', '📜 Recetario Lua'], ['guia', '📘 Guía']] as const;
type Tab = typeof TABS[number][0];

const STEPS_KEY = 'renacer_roblox_steps';

export default function Roblox() {
  const [tab, setTab] = useState<Tab>('generar');
  const [story, setStory] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState<Set<string>>(() => { try { return new Set(JSON.parse(localStorage.getItem(STEPS_KEY) ?? '[]')); } catch { return new Set(); } });
  const [tpl, setTpl] = useState(TEMPLATES[0].id);
  const [snipCat, setSnipCat] = useState(SNIPPET_CATS[0]);
  const [editorCode, setEditorCode] = useState('-- Escribe Lua y pulsa Ejecutar\nlocal nombre = "Cemal"\nprint("¡Hola, " .. nombre .. "!")\n\nfor i = 1, 3 do\n  print("Vuelta " .. i)\nend');
  const tryInEditor = (c: string) => { setEditorCode(c); setTab('editor'); window.scrollTo({ top: 0 }); };

  // Optimización: analiza la historia 400ms DESPUÉS de dejar de escribir (no en cada tecla),
  // clave si pegas un documento grande de un proyecto extenso.
  const [debouncedStory, setDebouncedStory] = useState('');
  useEffect(() => { const id = setTimeout(() => setDebouncedStory(story), 400); return () => clearTimeout(id); }, [story]);
  const plan = useMemo(() => analyzeStory(debouncedStory), [debouncedStory]);

  const onFile = async (file: File) => {
    setLoading(true); setFileName(file.name);
    try { setStory((await extractText(file)).trim()); toast(`📄 Leído: ${file.name}`); }
    catch { toast('No pude leer ese archivo. Pega el texto.'); }
    finally { setLoading(false); }
  };

  const toggleStep = (key: string) => {
    const n = new Set(done); n.has(key) ? n.delete(key) : n.add(key);
    setDone(n); localStorage.setItem(STEPS_KEY, JSON.stringify([...n]));
  };

  const downloadPlan = () => {
    const md = `# Plan de mi juego de Roblox\n\n${plan.detected.length ? `Elementos: ${plan.detected.join(', ')}\n\n` : ''}`
      + `## Plan por hitos (proyecto ${plan.scope.size})\n${plan.scope.advice}\n${plan.scope.milestones.map((m) => `- ${m}`).join('\n')}\n\n`
      + plan.sections.map((s) => `## ${s.title}\n${s.steps.map((st) => `- [ ] ${st}`).join('\n')}${s.code ? `\n\n\`\`\`lua\n${s.code}\n\`\`\`` : ''}`).join('\n\n')
      + `\n\n## Recomendaciones\n${plan.recommendations.map((r) => `- ${r}`).join('\n')}`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
    a.download = 'mi-juego-roblox.md'; a.click(); URL.revokeObjectURL(a.href);
    toast('⬇ Plan descargado (.md)');
  };

  const totalSteps = plan.sections.reduce((n, s) => n + s.steps.length, 0);
  const doneCount = plan.sections.reduce((n, s) => n + s.steps.filter((st) => done.has(`${s.title}::${st}`)).length, 0);
  const template = TEMPLATES.find((x) => x.id === tpl)!;

  return (
    <>
      <PageHeader title="Crea tu juego de Roblox" subtitle="Tu estudio completo: genera un plan desde tu historia, usa plantillas, copia comandos Lua y aprende a publicar. 🎮" icon="🎮" />

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-xl px-3.5 py-2 text-sm font-bold transition ${tab === k ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── GENERADOR ── */}
      {tab === 'generar' && (<>
        <Card className="mb-6 border-brand-500/30">
          <h3 className="font-bold mb-1">📄 Tu historia / idea del juego</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Sube un archivo (.pdf, .docx, .txt) o pega tu idea. Mientras más describas (personajes, niveles, enemigos, tienda, misiones…), más completo será el plan.</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={() => fileRef.current?.click()} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-ink-950 hover:opacity-95">⬆ Subir documento</button>
            {story && <button onClick={() => { setStory(''); setFileName(''); }} className="rounded-xl border border-stone-200 dark:border-white/10 px-3 py-2 text-sm font-semibold">Limpiar</button>}
            {loading && <span className="text-sm text-stone-400 self-center">Leyendo…</span>}
            {fileName && !loading && <span className="text-xs text-stone-400 self-center">📎 {fileName}</span>}
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </div>
          <textarea value={story} onChange={(e) => setStory(e.target.value)}
            placeholder="Ej: Un RPG donde un héroe explora una aldea con mercaderes, acepta misiones, tiene inventario, pelea enemigos y un jefe, sube de nivel y guarda su progreso…"
            className="w-full h-28 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          {plan.detected.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-stone-500">Detecté:</span>
              {plan.detected.map((d) => <Badge key={d} tone="green">{d}</Badge>)}
            </div>
          )}
        </Card>

        {/* Alcance del proyecto + plan por hitos */}
        <Card className="mb-6 border-l-4 border-brand-500/50">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold">🧭 Plan por hitos</h3>
            <Badge tone={plan.scope.size === 'extenso' ? 'amber' : plan.scope.size === 'mediano' ? 'brand' : 'green'}>Proyecto {plan.scope.size}</Badge>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">{plan.scope.advice}</p>
          <ol className="space-y-1.5">
            {plan.scope.milestones.map((m, i) => (
              <li key={i} className="text-sm text-stone-600 dark:text-stone-300 flex gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/20 text-[11px] font-bold text-brand-700 dark:text-brand-400">{i + 1}</span>
                {m.replace(/^Hito \d+ · /, '')}
              </li>
            ))}
          </ol>
        </Card>

        {/* Guía paso a paso PERSONALIZADA (setup + fases según el proyecto) */}
        <Card className="mb-6">
          <h3 className="font-bold mb-1">📋 Guía personalizada de tu proyecto</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Generada a partir de tu descripción: qué instalar y cómo construir tu juego, fase por fase.</p>
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-1.5">🔧 1. Prepara tu entorno</h4>
            <ol className="space-y-1 list-decimal list-inside">
              {plan.guide.setup.map((s, i) => <li key={i} className="text-sm text-stone-600 dark:text-stone-300">{s}</li>)}
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1.5">🚧 2. Construye tu juego por fases</h4>
            <div className="space-y-3">
              {plan.guide.phases.map((ph, i) => (
                <div key={i} className="rounded-lg border border-stone-200/70 dark:border-white/10 p-3">
                  <p className="font-semibold text-sm mb-1">{ph.title}</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {ph.steps.map((s, k) => <li key={k} className="text-sm text-stone-600 dark:text-stone-300">{s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-display text-lg font-bold">🗺️ Paso a paso ({doneCount}/{totalSteps})</h3>
          <button onClick={downloadPlan} className="rounded-lg bg-brand-500/15 text-brand-700 dark:text-brand-400 px-3 py-1.5 text-sm font-semibold">⬇ Descargar plan (.md)</button>
        </div>
        <div className="space-y-4 mb-6">
          {plan.sections.map((sec, i) => (
            <Card key={i}>
              <h4 className="font-bold mb-2">{sec.title}</h4>
              <ul className="space-y-1.5 mb-3">
                {sec.steps.map((s, k) => {
                  const key = `${sec.title}::${s}`;
                  return (
                    <li key={k}>
                      <label className="flex items-start gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={done.has(key)} onChange={() => toggleStep(key)} className="accent-brand-600 h-4 w-4 mt-0.5" />
                        <span className={done.has(key) ? 'line-through text-stone-400' : 'text-stone-600 dark:text-stone-300'}>{s}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {sec.code && <CodeBlock code={sec.code} onTry={() => tryInEditor(sec.code!)} />}
            </Card>
          ))}
        </div>

        <Card className="mb-6 border-l-4 border-brand-500/50">
          <h3 className="font-bold mb-2">💡 Recomendaciones</h3>
          <ul className="space-y-1.5">{plan.recommendations.map((r, i) => <li key={i} className="text-sm text-stone-600 dark:text-stone-300">{r}</li>)}</ul>
        </Card>
      </>)}

      {/* ── PLANTILLAS ── */}
      {tab === 'plantillas' && (<>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">Elige el tipo de juego y te doy un plan completo por fases.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-5">
          {TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => setTpl(t.id)}
              className={`text-left rounded-xl border p-3 transition ${tpl === t.id ? 'ring-2 ring-brand-500 border-transparent' : 'border-stone-200/70 dark:border-white/10 hover:ring-2 hover:ring-brand-500/40'}`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{t.emoji}</span>
                <span className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <span key={i} className={i < t.difficulty ? 'text-brand-500 text-xs' : 'text-stone-300 dark:text-white/15 text-xs'}>★</span>)}</span>
              </div>
              <p className="font-bold text-sm mt-1">{t.name}</p>
            </button>
          ))}
        </div>
        <Card className="mb-4">
          <div className="flex items-center gap-2 mb-1"><span className="text-2xl">{template.emoji}</span><h3 className="font-bold">{template.name}</h3></div>
          <p className="text-sm text-stone-600 dark:text-stone-300 mb-3">{template.desc}</p>
          <div className="space-y-3">
            {template.phases.map((ph, i) => (
              <div key={i} className="rounded-xl border border-stone-200/70 dark:border-white/10 p-3">
                <p className="font-semibold text-sm mb-1.5">{ph.title}</p>
                <ul className="space-y-1">{ph.steps.map((s, k) => <li key={k} className="text-sm text-stone-600 dark:text-stone-300 flex gap-2"><span className="text-brand-500">•</span>{s}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">💰 Cómo monetizarlo</p>
            <ul className="space-y-0.5">{template.monetize.map((m, i) => <li key={i} className="text-sm text-stone-600 dark:text-stone-300">• {m}</li>)}</ul>
          </div>
        </Card>
      </>)}

      {/* ── RECETARIO ── */}
      {tab === 'recetario' && (<>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">Comandos Lua listos para copiar y pegar en tus scripts.</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {SNIPPET_CATS.map((c) => (
            <button key={c} onClick={() => setSnipCat(c)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${snipCat === c ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {SNIPPETS.filter((s) => s.cat === snipCat).map((s, i) => (
            <Card key={i}>
              <h4 className="font-bold text-sm">{s.title}</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">{s.desc}</p>
              <CodeBlock code={s.code} onTry={() => tryInEditor(s.code)} />
            </Card>
          ))}
        </div>
      </>)}

      {/* ── EDITOR LUA ── */}
      {tab === 'editor' && <LuaEditor code={editorCode} setCode={setEditorCode} />}

      {/* ── GUÍA ── */}
      {tab === 'guia' && (
        <div className="space-y-4">
          {GUIDE.map((g, i) => (
            <Card key={i}>
              <h3 className="font-bold mb-2">{g.title}</h3>
              <ul className="space-y-1.5">{g.items.map((it, k) => <li key={k} className="text-sm text-stone-600 dark:text-stone-300 flex gap-2"><span className="text-brand-500">•</span>{it}</li>)}</ul>
            </Card>
          ))}
          <Card>
            <div className="flex items-center gap-2"><Badge tone="brand">Tip</Badge><p className="text-sm text-stone-600 dark:text-stone-300">Haz el curso <b>🌙 Lua</b> en 📚 Cursos para dominar los comandos.</p></div>
          </Card>
        </div>
      )}
    </>
  );
}
