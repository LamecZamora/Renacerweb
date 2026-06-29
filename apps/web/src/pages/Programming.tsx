import { useState } from 'react';
import { Card, PageHeader, Progress, Badge } from '../components/ui';
import { useProgress } from '../lib/storage';
import CodeRunner from '../components/CodeRunner';
import { CHALLENGES, CODE_TOTAL, CODE_LANGS, LANG_THEORY, type Challenge } from '../data/programming';

function ChallengeCard({ ch, done, onToggle }: { ch: Challenge; done: boolean; onToggle: () => void }) {
  const [showSol, setShowSol] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  return (
    <Card className={done ? 'ring-1 ring-emerald-500/40' : ''}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="slate">{ch.lang}</Badge>
            <h3 className="font-bold">{ch.title}</h3>
          </div>
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < ch.difficulty ? 'text-brand-500' : 'text-stone-300 dark:text-white/15'}>★</span>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-1.5 text-xs cursor-pointer shrink-0">
          <input type="checkbox" checked={done} onChange={onToggle} className="accent-emerald-600 h-4 w-4" />
          {done ? 'Hecho' : 'Marcar'}
        </label>
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-300">{ch.prompt}</p>

      <div className="mt-3 flex gap-3">
        <button onClick={() => setShowEditor((s) => !s)} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
          {showEditor ? 'Cerrar editor' : '✏️ Escribir código'}
        </button>
        <button onClick={() => setShowSol((s) => !s)} className="text-xs font-semibold text-stone-500 hover:underline">
          {showSol ? 'Ocultar solución' : 'Ver solución'}
        </button>
      </div>

      {showEditor && <div className="mt-3"><CodeRunner lang={ch.lang} /></div>}
      {showSol && (
        <pre className="mt-2 rounded-lg bg-ink-950 text-emerald-300 font-mono text-xs p-3 overflow-x-auto whitespace-pre">{ch.solution}</pre>
      )}
    </Card>
  );
}

export default function Programming({ embedded = false }: { embedded?: boolean }) {
  const { isDone, toggle, count } = useProgress('code');
  const [lang, setLang] = useState<string>('Todos');

  const list = lang === 'Todos' ? CHALLENGES : CHALLENGES.filter((c) => c.lang === lang);
  const theory = lang !== 'Todos' ? LANG_THEORY[lang] : null;

  return (
    <>
      {!embedded && <PageHeader title="Programación" subtitle="Teoría, retos por lenguaje y una consola para escribir y ejecutar código." icon="⌘" />}

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">Retos completados</h3>
          <Badge tone="brand">{count} / {CODE_TOTAL}</Badge>
        </div>
        <Progress value={count} max={CODE_TOTAL} />
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">Domina un lenguaje completando ≥90% de sus retos (✓).</p>
      </Card>

      {/* Consola de práctica libre */}
      <Card className="mb-6">
        <h3 className="font-bold mb-3">💻 Consola de práctica</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Escribe JavaScript y ejecútalo al instante. Usa <code className="text-brand-600 dark:text-brand-400">console.log()</code> para ver resultados.</p>
        <CodeRunner lang="JavaScript" initial={'// Pruébalo:\nconsole.log("Hola, " + "Renacer".toUpperCase());'} />
      </Card>

      <div className="flex gap-2 flex-wrap mb-5">
        {['Todos', ...CODE_LANGS].map((l) => {
          const langChs = CHALLENGES.filter((c) => c.lang === l);
          const mastered = l !== 'Todos' && langChs.length > 0 && langChs.filter((c) => isDone(c.id)).length / langChs.length >= 0.9;
          return (
            <button key={l} onClick={() => setLang(l)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                lang === l ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'
              }`}>
              {l} {mastered ? '✓' : ''}
            </button>
          );
        })}
      </div>

      {theory && (
        <Card className="mb-5 bg-brand-500/5 border-brand-500/20">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            <b className="text-brand-700 dark:text-brand-400">📖 {lang}:</b> {theory}
          </p>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {list.map((ch) => (
          <ChallengeCard key={ch.id} ch={ch} done={isDone(ch.id)} onToggle={() => toggle(ch.id)} />
        ))}
      </div>
    </>
  );
}
