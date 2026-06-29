import { useEffect, useState } from 'react';
import { Card, PageHeader, Badge } from '../components/ui';
import { getGhToken, setGhToken, hasGh, ghUser, ghRepos, ghCreateRepo, ghPutFile, slug, type GhUser, type GhRepo } from '../lib/github';

export default function GitHub() {
  const [token, setToken] = useState(getGhToken());
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [status, setStatus] = useState<string>('');

  const connect = async () => {
    setGhToken(token.trim());
    setStatus('Conectando…');
    try {
      const u = await ghUser();
      setUser(u);
      setRepos(await ghRepos());
      setStatus('');
    } catch (e) {
      setUser(null);
      setStatus('⚠ ' + (e instanceof Error ? e.message : 'No se pudo conectar'));
    }
  };

  useEffect(() => { if (hasGh()) void connect(); /* auto-conectar si ya hay token */ // eslint-disable-next-line
  }, []);

  // Crear repo
  const [repoName, setRepoName] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [priv, setPriv] = useState(false);
  const createRepo = async () => {
    if (!repoName.trim()) return;
    setStatus('Creando repo…');
    try {
      const r = await ghCreateRepo(slug(repoName), repoDesc, priv);
      setRepos(await ghRepos());
      setStatus('');
      setRepoName(''); setRepoDesc('');
      window.open(r.html_url, '_blank');
    } catch (e) { setStatus('⚠ ' + (e instanceof Error ? e.message : 'Error')); }
  };

  // Commit de archivo (subir documento / programar)
  const [fRepo, setFRepo] = useState('');
  const [fPath, setFPath] = useState('hola.md');
  const [fContent, setFContent] = useState('# Hola desde RENACER AI\n\nEste archivo se subió desde la app.');
  const commitFile = async () => {
    if (!user || !fRepo.trim() || !fPath.trim()) return;
    setStatus('Subiendo archivo…');
    try {
      const res = await ghPutFile(user.login, fRepo.trim(), fPath.trim(), fContent, `docs: ${fPath} vía RENACER AI`);
      setStatus('');
      window.open(res.content.html_url, '_blank');
    } catch (e) { setStatus('⚠ ' + (e instanceof Error ? e.message : 'Error')); }
  };

  return (
    <>
      <PageHeader title="GitHub" subtitle="Conecta tu GitHub y sube tus proyectos, documentos y código de verdad." icon="🐙" />

      {/* Conexión */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">Conexión</h3>
          {user ? <Badge tone="green">Conectado: @{user.login}</Badge> : <Badge tone="amber">Sin conectar</Badge>}
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{user.name ?? user.login}</p>
              <p className="text-xs text-stone-500">{user.public_repos} repos públicos</p>
            </div>
            <button onClick={() => { setGhToken(''); setUser(null); setToken(''); setRepos([]); }} className="text-xs text-stone-400 hover:text-red-500">Desconectar</button>
          </div>
        ) : (
          <>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
              Pega un <b>Personal Access Token</b> de GitHub (Settings → Developer settings → Tokens). Permiso mínimo: <code>repo</code> / Contents. Se guarda <b>solo en tu navegador</b>.
            </p>
            <div className="flex gap-2">
              <input value={token} onChange={(e) => setToken(e.target.value)} type="password" placeholder="ghp_… o github_pat_…" className="flex-1 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <button onClick={connect} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">Conectar</button>
            </div>
          </>
        )}
        {status && <p className="mt-2 text-xs text-stone-500">{status}</p>}
      </Card>

      {user && (
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          {/* Crear repo */}
          <Card>
            <h3 className="font-bold mb-3">Crear repositorio</h3>
            <input value={repoName} onChange={(e) => setRepoName(e.target.value)} placeholder="Nombre del repo" className="w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={repoDesc} onChange={(e) => setRepoDesc(e.target.value)} placeholder="Descripción" className="w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <label className="flex items-center gap-2 text-sm mb-3"><input type="checkbox" checked={priv} onChange={(e) => setPriv(e.target.checked)} className="accent-brand-600" /> Privado</label>
            <button onClick={createRepo} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">🚀 Crear repo</button>
          </Card>

          {/* Subir archivo / programar */}
          <Card>
            <h3 className="font-bold mb-3">Subir archivo / código</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select value={fRepo} onChange={(e) => setFRepo(e.target.value)} className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">Elige un repo…</option>
                {repos.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
              <input value={fPath} onChange={(e) => setFPath(e.target.value)} placeholder="ruta/archivo.md" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <textarea value={fContent} onChange={(e) => setFContent(e.target.value)} className="w-full h-32 rounded-lg bg-ink-950 text-emerald-300 font-mono text-xs p-3 mb-2 focus:outline-none" />
            <button onClick={commitFile} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">⬆ Subir (commit)</button>
          </Card>
        </div>
      )}

      {user && repos.length > 0 && (
        <Card className="mb-6">
          <h3 className="font-bold mb-3">Tus repositorios ({repos.length})</h3>
          <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-auto">
            {repos.map((r) => (
              <a key={r.name} href={r.html_url} target="_blank" rel="noreferrer" className="rounded-lg border border-stone-200/70 dark:border-white/10 p-2 hover:border-brand-500">
                <p className="text-sm font-semibold flex items-center gap-1">{r.name} {r.private && <span className="text-[10px] text-stone-400">🔒</span>}</p>
                <p className="text-xs text-stone-500 truncate">{r.description ?? 'Sin descripción'}</p>
              </a>
            ))}
          </div>
        </Card>
      )}

      <Card className="border-amber-500/30">
        <h3 className="font-bold mb-1">Sobre LinkedIn</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          LinkedIn no permite subir proyectos automáticamente desde apps externas (su API es cerrada). Lo que sí puedes: comparte el enlace de tu repo con el botón nativo de LinkedIn.
          {' '}<a className="text-brand-600 dark:text-brand-400 underline" href="https://www.linkedin.com/sharing/share-offsite/?url=https://github.com" target="_blank" rel="noreferrer">Compartir en LinkedIn</a>
        </p>
      </Card>
    </>
  );
}
