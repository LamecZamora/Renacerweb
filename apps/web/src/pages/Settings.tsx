import { useRef, useState } from 'react';
import { Card, PageHeader, Badge } from '../components/ui';
import { getProfile, saveProfile, exportAccount, importAccount, clearAccount, type Profile } from '../lib/storage';
import { THEMES, applyTheme, currentThemeId } from '../lib/theme';
import CloudSync from '../components/CloudSync';

export default function Settings() {
  const current = getProfile();
  const [name, setName] = useState(current?.name ?? '');
  const [goal, setGoal] = useState(current?.goal ?? '');
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState(currentThemeId());
  const fileRef = useRef<HTMLInputElement>(null);

  const pickTheme = (id: string) => { setTheme(id); applyTheme(id); };

  const save = () => {
    const p: Profile = {
      name: name.trim() || 'Tú',
      goal: goal.trim(),
      // Peso y altura se fijan al crear la cuenta (no se editan aquí).
      startWeight: current?.startWeight,
      heightCm: current?.heightCm,
      createdAt: current?.createdAt ?? new Date().toISOString(),
    };
    saveProfile(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const doExport = () => {
    const blob = new Blob([JSON.stringify(exportAccount(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renacer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importAccount(JSON.parse(String(reader.result)));
        alert('Datos restaurados. La app se recargará.');
        location.href = '/';
      } catch {
        alert('Archivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <PageHeader title="Ajustes" subtitle="Edita tu perfil y gestiona tus datos." icon="⚙️" />

      <div className="mb-6"><CloudSync /></div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Tu perfil</h3>
          {saved && <Badge tone="green">¡Guardado!</Badge>}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="text-stone-500 dark:text-stone-400 text-xs">Nombre</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </label>
          <label className="text-sm">
            <span className="text-stone-500 dark:text-stone-400 text-xs">Objetivo principal</span>
            <input value={goal} onChange={(e) => setGoal(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </label>
          <div className="text-sm">
            <span className="text-stone-500 dark:text-stone-400 text-xs">Peso inicial (kg) 🔒</span>
            <div className="mt-1 w-full rounded-lg border border-stone-200/70 dark:border-white/10 bg-stone-200/30 dark:bg-white/5 px-3 py-2 text-sm text-stone-500">{current?.startWeight ?? '—'}</div>
          </div>
          <div className="text-sm">
            <span className="text-stone-500 dark:text-stone-400 text-xs">Altura (cm) 🔒</span>
            <div className="mt-1 w-full rounded-lg border border-stone-200/70 dark:border-white/10 bg-stone-200/30 dark:bg-white/5 px-3 py-2 text-sm text-stone-500">{current?.heightCm ?? '—'}</div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-stone-400">El peso inicial y la altura se fijan al crear tu cuenta y no se editan (son tu punto de partida). Tu peso actual lo registras en 🏋 Fitness.</p>
        <button onClick={save} className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">Guardar cambios</button>
      </Card>

      <Card className="mb-6">
        <h3 className="font-bold mb-1">🎨 Color de la interfaz</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Elige el color de acento según tu personalidad. Tiñe botones, barras, iconos y detalles de toda la app.</p>
        <div className="flex flex-wrap gap-2.5">
          {THEMES.map((t) => (
            <button key={t.id} onClick={() => pickTheme(t.id)} title={t.name}
              className={`group flex flex-col items-center gap-1.5 rounded-xl px-2 py-2 transition ${theme === t.id ? 'bg-stone-200/60 dark:bg-white/10' : 'hover:bg-stone-200/40 dark:hover:bg-white/5'}`}>
              <span className={`grid h-9 w-9 place-items-center rounded-full ring-2 ${theme === t.id ? 'ring-offset-2 ring-offset-white dark:ring-offset-ink-950' : 'ring-transparent'}`} style={{ background: t.swatch, boxShadow: theme === t.id ? `0 0 0 2px ${t.swatch}` : undefined }}>
                {theme === t.id && <span className="text-white text-sm">✓</span>}
              </span>
              <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400">{t.name}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="font-bold mb-2">Copia de seguridad</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
          Tus datos viven en este navegador. Exporta un respaldo y guárdalo; puedes restaurarlo aquí o en otro equipo.
        </p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={doExport} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">⬇ Exportar datos (JSON)</button>
          <button onClick={() => fileRef.current?.click()} className="rounded-xl border border-stone-200 dark:border-white/10 px-4 py-2 text-sm font-semibold">⬆ Importar / restaurar</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
        </div>
      </Card>

      <Card className="border-red-500/30">
        <h3 className="font-bold mb-2 text-red-500">Zona de peligro</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Esto borra todo tu progreso de esta cuenta. No se puede deshacer (exporta antes).</p>
        <button
          onClick={() => { if (confirm('¿Borrar TODA tu cuenta y progreso?')) { clearAccount(); location.href = '/'; } }}
          className="rounded-xl border border-red-500/40 text-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-500/10"
        >
          Borrar cuenta
        </button>
      </Card>
    </>
  );
}
