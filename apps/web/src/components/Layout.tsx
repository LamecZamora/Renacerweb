import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { useProfile } from '../lib/storage';
import Onboarding from './Onboarding';
import CommandPalette from './CommandPalette';
import Toasts from './Toasts';
import Motivation from './Motivation';
import InstallPrompt from './InstallPrompt';
import { checkAchievements } from '../lib/achievementsWatch';

const openPalette = () => window.dispatchEvent(new Event('palette-open'));

export const NAV = [
  { to: '/', label: 'Dashboard', icon: '◎' },
  { to: '/learning', label: 'Cursos', icon: '📚' },
  { to: '/career', label: 'Empleo 🌍', icon: '💼' },
  { to: '/interview', label: 'Entrevista', icon: '🎤' },
  { to: '/cv', label: 'CV', icon: '📄' },
  { to: '/github', label: 'GitHub', icon: '🐙' },
  { to: '/characters', label: 'Personajes', icon: '🎭' },
  { to: '/achievements', label: 'Logros', icon: '🏆' },
  { to: '/fitness', label: 'Fitness', icon: '🏋' },
  { to: '/english', label: 'Inglés', icon: '🗣' },
  { to: '/projects', label: 'Proyectos', icon: '◳' },
  { to: '/roblox', label: 'Roblox 🎮', icon: '🎮' },
  { to: '/journal', label: 'Diario', icon: '✶' },
  { to: '/reading', label: 'Lectura', icon: '❖' },
  { to: '/finance', label: 'Finanzas', icon: '◇' },
  { to: '/reports', label: 'Reportes', icon: '▤' },
  { to: '/settings', label: 'Ajustes', icon: '⚙' },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-ink-950 font-display font-extrabold shadow-glow">R</span>
      <div className="leading-none">
        <p className="font-display text-lg font-extrabold tracking-tight">RENACER</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Sistema personal</p>
      </div>
    </div>
  );
}

export default function Layout() {
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, setProfile, reset } = useProfile();
  const location = useLocation();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  // Permite alternar el tema desde el buscador (Ctrl+K).
  useEffect(() => {
    const onToggle = () => setDark((d) => !d);
    window.addEventListener('toggle-theme', onToggle);
    return () => window.removeEventListener('toggle-theme', onToggle);
  }, []);
  // Notifica logros recién desbloqueados al cambiar de pantalla.
  useEffect(() => { checkAchievements(); }, [location.pathname]);

  if (!profile) return <Onboarding onDone={setProfile} />;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-gradient-to-r from-brand-500/20 to-brand-500/[0.04] text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/25 shadow-[inset_2px_0_0_0_#f59e0b]'
        : 'text-stone-600 hover:bg-stone-200/60 hover:translate-x-0.5 dark:text-stone-300 dark:hover:bg-white/5'
    }`;

  return (
    <div className="app-atmosphere min-h-screen bg-stone-50 text-ink-900 dark:bg-ink-950 dark:text-stone-100 font-sans">
      {/* Barra superior móvil */}
      <div className="no-print md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-stone-200/70 dark:border-white/10 bg-stone-50/90 dark:bg-ink-950/90 backdrop-blur p-3 safe-top">
        <Logo />
        <div className="flex items-center gap-2">
          <button onClick={openPalette} aria-label="Buscar" className="rounded-lg border border-stone-200 dark:border-white/10 px-3 py-1.5 text-lg">🔎</button>
          <button onClick={() => setMobileOpen((o) => !o)} aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} className="rounded-lg border border-stone-200 dark:border-white/10 px-3 py-1.5 text-lg">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="no-print md:hidden border-b border-stone-200/70 dark:border-white/10 p-3 grid grid-cols-2 gap-1 bg-stone-50 dark:bg-ink-950">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)} className={linkClass}>
              <span className="w-4 text-center opacity-80">{item.icon}</span>{item.label}
            </NavLink>
          ))}
          <button onClick={() => setDark(!dark)} className="col-span-2 mt-1 rounded-xl border border-stone-200 dark:border-white/10 px-3 py-2 text-sm font-medium">
            {dark ? '☀ Modo claro' : '☾ Modo oscuro'}
          </button>
        </nav>
      )}

      <div className="flex">
        {/* Sidebar escritorio */}
        <aside className="no-print hidden md:flex w-64 flex-col gap-1 border-r border-stone-200/70 dark:border-white/10 p-4 min-h-screen sticky top-0">
          <div className="mb-6 px-2 pt-2"><Logo /></div>
          <button onClick={openPalette} className="mb-3 flex items-center justify-between rounded-xl border border-stone-200 dark:border-white/10 px-3 py-2 text-sm text-stone-400 hover:border-brand-500/50 hover:text-stone-600 dark:hover:text-stone-200">
            <span className="flex items-center gap-2">🔎 Buscar…</span>
            <kbd className="text-[10px] border border-stone-200 dark:border-white/10 rounded px-1.5 py-0.5">Ctrl K</kbd>
          </button>
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Módulos</p>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              <span className="w-4 text-center opacity-80">{item.icon}</span>{item.label}
            </NavLink>
          ))}
          <div className="mt-auto space-y-2">
            <div className="rounded-xl border border-stone-200/70 dark:border-white/10 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">Cuenta</p>
              <p className="text-sm font-semibold truncate">{profile.name}</p>
            </div>
            <button onClick={() => setDark(!dark)} className="w-full flex items-center justify-center gap-2 rounded-xl border border-stone-200 dark:border-white/10 px-3 py-2 text-sm font-medium hover:bg-stone-100 dark:hover:bg-white/5">
              {dark ? '☀ Modo claro' : '☾ Modo oscuro'}
            </button>
            <button onClick={() => { if (confirm('¿Cerrar sesión y borrar el progreso de esta cuenta?')) reset(); }} className="w-full rounded-xl px-3 py-2 text-xs font-medium text-stone-400 hover:text-red-500">
              Cerrar sesión / reiniciar
            </button>
          </div>
        </aside>

        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <m.div key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}>
              <Outlet />
            </m.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette />
      <Toasts />
      <Motivation />
      <InstallPrompt />
    </div>
  );
}
