import { useState } from 'react';

/** Ejecuta JavaScript del usuario en un sandbox simple capturando console.log. */
function runJs(code: string): string {
  const logs: string[] = [];
  const fakeConsole = { log: (...a: unknown[]) => logs.push(a.map((x) => format(x)).join(' ')) };
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('console', code);
    const ret = fn(fakeConsole);
    if (ret !== undefined) logs.push('↩ ' + format(ret));
    return logs.join('\n') || '(sin salida — usa console.log para imprimir)';
  } catch (e) {
    return '⚠ ' + (e instanceof Error ? `${e.name}: ${e.message}` : String(e));
  }
}

function format(x: unknown): string {
  if (typeof x === 'string') return x;
  try { return JSON.stringify(x); } catch { return String(x); }
}

export default function CodeRunner({ initial = '', lang = 'JavaScript' }: { initial?: string; lang?: string }) {
  const [code, setCode] = useState(initial);
  const [out, setOut] = useState<string | null>(null);
  const runnable = lang === 'JavaScript';

  return (
    <div className="rounded-xl border border-stone-200/70 dark:border-white/10 overflow-hidden">
      <div className="flex items-center justify-between bg-stone-100 dark:bg-white/5 px-3 py-1.5 text-xs">
        <span className="font-semibold text-stone-500 dark:text-stone-400">⌨ Consola · {lang}</span>
        <div className="flex gap-2">
          <button onClick={() => { setCode(''); setOut(null); }} className="text-stone-400 hover:text-stone-700 dark:hover:text-white">Limpiar</button>
          <button
            onClick={() => setOut(runnable ? runJs(code) : 'ℹ La ejecución en vivo está disponible para JavaScript. En otros lenguajes puedes escribir y comparar con la solución.')}
            className="rounded bg-brand-600 px-2 py-0.5 font-semibold text-ink-950 hover:opacity-95"
          >
            ▶ Ejecutar
          </button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        placeholder={runnable ? '// Escribe tu código aquí y pulsa Ejecutar\nconsole.log("Hola, Renacer");' : '// Escribe tu solución aquí…'}
        className="w-full h-40 bg-ink-950 text-emerald-300 font-mono text-xs p-3 resize-y focus:outline-none"
      />
      {out !== null && (
        <pre className="border-t border-stone-200/70 dark:border-white/10 bg-stone-50 dark:bg-black/40 text-stone-700 dark:text-stone-200 font-mono text-xs p-3 whitespace-pre-wrap max-h-40 overflow-auto">{out}</pre>
      )}
    </div>
  );
}
