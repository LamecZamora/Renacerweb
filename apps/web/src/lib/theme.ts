// Personalización del color de acento (se mantiene el modo oscuro/claro aparte).
export type ThemePreset = { id: string; name: string; swatch: string; vars: Record<string, string> };

export const THEMES: ThemePreset[] = [
  { id: 'amber', name: 'Ámbar', swatch: '#f59e0b', vars: { '--brand-50': '255 251 235', '--brand-100': '254 243 199', '--brand-400': '251 191 36', '--brand-500': '245 158 11', '--brand-600': '217 119 6', '--brand-700': '180 83 9', '--ember': '251 146 60' } },
  { id: 'emerald', name: 'Esmeralda', swatch: '#10b981', vars: { '--brand-50': '236 253 245', '--brand-100': '209 250 229', '--brand-400': '52 211 153', '--brand-500': '16 185 129', '--brand-600': '5 150 105', '--brand-700': '4 120 87', '--ember': '110 231 183' } },
  { id: 'ocean', name: 'Océano', swatch: '#3b82f6', vars: { '--brand-50': '239 246 255', '--brand-100': '219 234 254', '--brand-400': '96 165 250', '--brand-500': '59 130 246', '--brand-600': '37 99 235', '--brand-700': '29 78 216', '--ember': '56 189 248' } },
  { id: 'violet', name: 'Violeta', swatch: '#8b5cf6', vars: { '--brand-50': '245 243 255', '--brand-100': '237 233 254', '--brand-400': '167 139 250', '--brand-500': '139 92 246', '--brand-600': '124 58 237', '--brand-700': '109 40 217', '--ember': '232 121 249' } },
  { id: 'rose', name: 'Rosa', swatch: '#f43f5e', vars: { '--brand-50': '255 241 242', '--brand-100': '255 228 230', '--brand-400': '251 113 133', '--brand-500': '244 63 94', '--brand-600': '225 29 72', '--brand-700': '190 18 60', '--ember': '253 164 175' } },
  { id: 'cyan', name: 'Cian', swatch: '#06b6d4', vars: { '--brand-50': '236 254 255', '--brand-100': '207 250 254', '--brand-400': '34 211 238', '--brand-500': '6 182 212', '--brand-600': '8 145 178', '--brand-700': '14 116 144', '--ember': '34 211 238' } },
  { id: 'crimson', name: 'Carmesí', swatch: '#ef4444', vars: { '--brand-50': '254 242 242', '--brand-100': '254 226 226', '--brand-400': '248 113 113', '--brand-500': '239 68 68', '--brand-600': '220 38 38', '--brand-700': '185 28 28', '--ember': '251 113 133' } },
  { id: 'lime', name: 'Lima', swatch: '#84cc16', vars: { '--brand-50': '247 254 231', '--brand-100': '236 252 203', '--brand-400': '163 230 53', '--brand-500': '132 204 22', '--brand-600': '101 163 13', '--brand-700': '77 124 15', '--ember': '190 242 100' } },
];

const KEY = 'renacer_theme';

export function applyTheme(id: string) {
  const t = THEMES.find((x) => x.id === id) ?? THEMES[0];
  Object.entries(t.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  try { localStorage.setItem(KEY, t.id); } catch { /* noop */ }
}

export function currentThemeId(): string {
  try { return localStorage.getItem(KEY) ?? 'amber'; } catch { return 'amber'; }
}

export function initTheme() {
  applyTheme(currentThemeId());
}
