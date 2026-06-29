import { useEffect, useState } from 'react';
import { Card, PageHeader } from '../components/ui';
import { getProfile, readList } from '../lib/storage';
import { learningDone } from '../lib/learning';
import { autoSkills } from '../lib/skills';

type CV = {
  headline: string; summary: string; email: string; phone: string; location: string;
  linkedin: string; github: string; skillsExtra: string;
  experience: { role: string; company: string; period: string; detail: string }[];
  education: { title: string; school: string; period: string }[];
};
type Project = { title: string; tasks: { done: boolean }[] };

const DEFAULT_CV: CV = {
  headline: 'Junior Java / Full-Stack Developer', summary: '', email: '', phone: '', location: 'Vancouver, BC (objetivo)',
  linkedin: '', github: '', skillsExtra: 'HTML, CSS, JavaScript',
  experience: [{ role: '', company: '', period: '', detail: '' }],
  education: [{ title: '', school: '', period: '' }],
};

function loadCV(): CV {
  try { return { ...DEFAULT_CV, ...JSON.parse(localStorage.getItem('renacer_cv') ?? '{}') }; } catch { return DEFAULT_CV; }
}

export default function CV() {
  const profile = getProfile();
  const [cv, setCv] = useState<CV>(loadCV);
  const set = (patch: Partial<CV>) => setCv((c) => ({ ...c, ...patch }));
  useEffect(() => { localStorage.setItem('renacer_cv', JSON.stringify(cv)); }, [cv]);

  // Habilidades que se forman SOLAS desde tus cursos + inglés.
  const skills = autoSkills(learningDone());

  const projects = readList<Project>('projects').filter((p) => p.tasks.length > 0);

  const copyText = () => {
    const txt = [
      `${profile?.name ?? 'Tu Nombre'} — ${cv.headline}`,
      cv.location, [cv.email, cv.phone, cv.linkedin, cv.github].filter(Boolean).join(' · '),
      '', 'PERFIL', cv.summary,
      '', 'SKILLS', skills.map((sk) => `${sk.name} (${sk.level})`).join(', ') + (cv.skillsExtra ? ', ' + cv.skillsExtra : ''),
      '', 'PROYECTOS', ...projects.map((p) => `- ${p.title}`),
      '', 'EXPERIENCIA', ...cv.experience.filter((e) => e.role).map((e) => `- ${e.role} @ ${e.company} (${e.period})\n  ${e.detail}`),
      '', 'EDUCACIÓN', ...cv.education.filter((e) => e.title).map((e) => `- ${e.title}, ${e.school} (${e.period})`),
    ].join('\n');
    navigator.clipboard?.writeText(txt);
    alert('CV copiado al portapapeles (texto).');
  };

  const readme = `# Hola, soy ${profile?.name ?? '...'} 👋\n\n${cv.headline} en camino a Vancouver 🍁\n\n## 🛠️ Skills\n${skills.map((sk) => `\`${sk.name}\``).join(' ')} ${cv.skillsExtra.split(',').map((s) => `\`${s.trim()}\``).join(' ')}\n\n## 🚀 Proyectos\n${projects.map((p) => `- **${p.title}**`).join('\n') || '- (añade proyectos en el módulo Proyectos)'}\n\n## 📫 Contacto\n${[cv.email && `✉️ ${cv.email}`, cv.linkedin && `🔗 ${cv.linkedin}`].filter(Boolean).join(' · ')}`;

  return (
    <>
      <div className="no-print">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <PageHeader title="CV Manager" subtitle="Tu CV se construye solo desde tu progreso. Edítalo, expórtalo y úsalo en Vancouver." icon="📄" />
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-ink-950 hover:opacity-95">🖨 Imprimir / PDF</button>
            <button onClick={copyText} className="rounded-lg border border-stone-200 dark:border-white/10 px-3 py-1.5 text-sm font-semibold">📋 Copiar texto</button>
          </div>
        </div>

        {/* Habilidades automáticas */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
            <h3 className="font-bold">🛠️ Tus habilidades <span className="text-xs font-normal text-stone-400">(se forman solas)</span></h3>
            <span className="text-xs text-stone-400">{skills.length} habilidades</span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Cada curso que avanzas suma una habilidad con su nivel. El inglés se muestra en escala CEFR (A1–C2). Esto entra solo en tu CV. 💪</p>
          {skills.length === 0 ? (
            <p className="text-sm text-stone-500">Avanza en 📚 Cursos e Inglés y aquí irán apareciendo tus habilidades.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((sk) => (
                <span key={sk.name} className="inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold"
                  style={{ borderColor: `${sk.color}55`, background: `${sk.color}14`, color: sk.color }}>
                  {sk.icon} {sk.name} <span className="rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px] text-stone-600 dark:text-stone-200">{sk.level}</span>
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Editor */}
        <Card className="mb-6">
          <h3 className="font-bold mb-3">Datos del CV</h3>
          <div className="grid sm:grid-cols-2 gap-2 mb-2">
            <input value={cv.headline} onChange={(e) => set({ headline: e.target.value })} placeholder="Título profesional" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={cv.location} onChange={(e) => set({ location: e.target.value })} placeholder="Ubicación" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={cv.email} onChange={(e) => set({ email: e.target.value })} placeholder="Email" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={cv.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="Teléfono" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={cv.linkedin} onChange={(e) => set({ linkedin: e.target.value })} placeholder="LinkedIn" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={cv.github} onChange={(e) => set({ github: e.target.value })} placeholder="GitHub" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <textarea value={cv.summary} onChange={(e) => set({ summary: e.target.value })} placeholder="Perfil / resumen profesional (2-3 líneas)" className="w-full h-20 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent p-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <input value={cv.skillsExtra} onChange={(e) => set({ skillsExtra: e.target.value })} placeholder="Skills extra (coma)" className="w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand-500" />

          <p className="text-xs font-semibold text-stone-500 mb-1">Experiencia</p>
          {cv.experience.map((e, i) => (
            <div key={i} className="grid sm:grid-cols-3 gap-2 mb-2">
              <input value={e.role} onChange={(ev) => set({ experience: cv.experience.map((x, k) => k === i ? { ...x, role: ev.target.value } : x) })} placeholder="Puesto" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm" />
              <input value={e.company} onChange={(ev) => set({ experience: cv.experience.map((x, k) => k === i ? { ...x, company: ev.target.value } : x) })} placeholder="Empresa" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm" />
              <input value={e.period} onChange={(ev) => set({ experience: cv.experience.map((x, k) => k === i ? { ...x, period: ev.target.value } : x) })} placeholder="Periodo" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm" />
              <input value={e.detail} onChange={(ev) => set({ experience: cv.experience.map((x, k) => k === i ? { ...x, detail: ev.target.value } : x) })} placeholder="Logro / descripción" className="sm:col-span-3 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm" />
            </div>
          ))}
          <button onClick={() => set({ experience: [...cv.experience, { role: '', company: '', period: '', detail: '' }] })} className="text-xs font-semibold text-brand-600 dark:text-brand-400">+ añadir experiencia</button>
        </Card>
      </div>

      {/* Vista previa imprimible del CV */}
      <div className="rounded-2xl border border-stone-200 dark:border-white/10 bg-white text-ink-900 p-8 shadow-sm" id="cv-print">
        <h1 className="font-display text-3xl font-extrabold">{profile?.name ?? 'Tu Nombre'}</h1>
        <p className="text-brand-600 font-semibold">{cv.headline}</p>
        <p className="text-xs text-stone-500 mt-1">{[cv.location, cv.email, cv.phone, cv.linkedin, cv.github].filter(Boolean).join(' · ')}</p>

        {cv.summary && (<><h2 className="font-bold mt-5 mb-1 border-b border-stone-200 pb-1">Perfil</h2><p className="text-sm text-stone-700">{cv.summary}</p></>)}

        <h2 className="font-bold mt-5 mb-2 border-b border-stone-200 pb-1">Skills</h2>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((sk) => <span key={sk.name} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">{sk.name} · {sk.level}</span>)}
          {cv.skillsExtra.split(',').filter((s) => s.trim()).map((s) => <span key={s} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">{s.trim()}</span>)}
        </div>

        {projects.length > 0 && (<><h2 className="font-bold mt-5 mb-2 border-b border-stone-200 pb-1">Proyectos</h2><ul className="text-sm text-stone-700 space-y-0.5">{projects.map((p, i) => <li key={i}>• {p.title}</li>)}</ul></>)}

        {cv.experience.some((e) => e.role) && (<><h2 className="font-bold mt-5 mb-2 border-b border-stone-200 pb-1">Experiencia</h2>{cv.experience.filter((e) => e.role).map((e, i) => (<div key={i} className="mb-2"><p className="text-sm font-semibold">{e.role} · {e.company} <span className="font-normal text-stone-500">{e.period}</span></p>{e.detail && <p className="text-xs text-stone-600">{e.detail}</p>}</div>))}</>)}
      </div>

      {/* GitHub README */}
      <Card className="mt-6 no-print">
        <h3 className="font-bold mb-2">Generador de README de GitHub</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">Copia esto y pégalo en un repo llamado igual que tu usuario (<code>tu-usuario/tu-usuario</code>) → aparece en tu perfil. <b>Nota:</b> la actualización automática real necesita tu token de GitHub (futuro).</p>
        <pre className="rounded-lg bg-ink-950 text-emerald-300 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap max-h-60">{readme}</pre>
        <button onClick={() => { navigator.clipboard?.writeText(readme); alert('README copiado.'); }} className="mt-2 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-ink-950">📋 Copiar README</button>
      </Card>
    </>
  );
}
