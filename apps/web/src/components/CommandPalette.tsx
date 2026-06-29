import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV } from './Layout';
import { COURSES } from '../data/courses';
import { dailyChallenge } from '../lib/learning';

type Item = { id: string; label: string; sub: string; icon: string; run: () => void };

export default function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Atajo global: Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('palette-open', onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('palette-open', onOpen); };
  }, []);

  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);

  const items: Item[] = useMemo(() => [
    { id: 'act-theme', label: 'Cambiar tema claro/oscuro', sub: 'Acción', icon: '🌓', run: () => window.dispatchEvent(new Event('toggle-theme')) },
    { id: 'act-reto', label: 'Reto del día', sub: 'Acción · ejercicio de hoy', icon: '🎯', run: () => {
      const r = dailyChallenge();
      if (r) localStorage.setItem('renacer_open_course', r.course.id);
      navigate('/learning');
    } },
    { id: 'act-backup', label: 'Copia de seguridad', sub: 'Acción · exportar/importar datos', icon: '💾', run: () => navigate('/settings') },
    ...NAV.map((n) => ({ id: 'nav-' + n.to, label: n.label, sub: 'Módulo', icon: n.icon, run: () => navigate(n.to) })),
    ...COURSES.map((c) => ({
      id: 'course-' + c.id, label: c.name, sub: 'Curso · ' + c.tagline, icon: c.icon,
      run: () => { localStorage.setItem('renacer_open_course', c.id); navigate('/learning'); },
    })),
  ], [navigate]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items.slice(0, 8);
    return items.filter((it) => (it.label + ' ' + it.sub).toLowerCase().includes(s)).slice(0, 12);
  }, [q, items]);

  useEffect(() => { setSel(0); }, [q]);

  if (!open) return null;

  const choose = (it?: Item) => { if (!it) return; it.run(); setOpen(false); };

  return (
    <div className="no-print fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] bg-ink-950/60 backdrop-blur-sm px-4" onClick={() => setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-ink-950 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-stone-200/70 dark:border-white/10 px-4">
          <span className="text-stone-400">🔎</span>
          <input
            ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              else if (e.key === 'Enter') { e.preventDefault(); choose(filtered[sel]); }
            }}
            placeholder="Busca un módulo o curso…"
            className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
          />
          <kbd className="text-[10px] text-stone-400 border border-stone-200 dark:border-white/10 rounded px-1.5 py-0.5">Esc</kbd>
        </div>
        <div className="max-h-80 overflow-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-stone-400">Sin resultados para “{q}”.</p>
          ) : filtered.map((it, i) => (
            <button key={it.id} onMouseEnter={() => setSel(i)} onClick={() => choose(it)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left ${i === sel ? 'bg-brand-500/15' : ''}`}>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-stone-200/60 dark:bg-white/5 text-lg shrink-0">{it.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{it.label}</p>
                <p className="text-xs text-stone-400 truncate">{it.sub}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="border-t border-stone-200/70 dark:border-white/10 px-4 py-2 text-[11px] text-stone-400 flex gap-3">
          <span>↑↓ navegar</span><span>↵ abrir</span><span>Ctrl/⌘ K alterna</span>
        </div>
      </div>
    </div>
  );
}
