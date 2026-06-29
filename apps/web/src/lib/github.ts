// Integración real con GitHub desde el navegador usando el token personal del
// usuario (guardado SOLO en localStorage). GitHub permite CORS con token.

const KEY = 'renacer_github_token';
export const getGhToken = () => localStorage.getItem(KEY) ?? '';
export const setGhToken = (t: string) => (t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY));
export const hasGh = () => !!getGhToken();

async function api(path: string, init?: RequestInit) {
  const res = await fetch('https://api.github.com' + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${getGhToken()}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `GitHub ${res.status}`);
  return data;
}

export type GhUser = { login: string; name: string | null; avatar_url: string; public_repos: number };
export type GhRepo = { name: string; html_url: string; description: string | null; private: boolean };

export const ghUser = (): Promise<GhUser> => api('/user');
export const ghRepos = (): Promise<GhRepo[]> => api('/user/repos?per_page=100&sort=updated');

export const ghCreateRepo = (name: string, description: string, isPrivate: boolean): Promise<GhRepo> =>
  api('/user/repos', { method: 'POST', body: JSON.stringify({ name, description, private: isPrivate, auto_init: true }) });

// Codifica UTF-8 a base64 (necesario para la Contents API).
const b64 = (s: string) => btoa(unescape(encodeURIComponent(s)));

/** Crea o actualiza un archivo en un repo (commit). */
export async function ghPutFile(owner: string, repo: string, path: string, content: string, message: string) {
  let sha: string | undefined;
  try {
    const existing = await api(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`);
    sha = existing.sha;
  } catch { /* archivo nuevo, sin sha */ }
  return api(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: b64(content), sha }),
  }) as Promise<{ content: { html_url: string }; commit: { html_url: string } }>;
}

export const slug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'proyecto-renacer';
