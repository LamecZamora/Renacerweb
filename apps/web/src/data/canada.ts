// Calculadora CRS (Express Entry) simplificada para solicitante soltero ("sin cónyuge")
// y checklist de migración a Canadá. Es una ESTIMACIÓN educativa, no asesoría legal oficial.

export type CrsInput = {
  age: number;            // edad en años
  education: string;      // clave de EDUCATION
  clb: number;            // nivel CLB de inglés (4-10), asumido parejo en las 4 habilidades
  canExp: number;         // años de experiencia laboral EN Canadá (0-5)
  foreignExp: number;     // años de experiencia laboral fuera de Canadá (0-3)
  pnp: boolean;           // nominación provincial (BC PNP, etc.)
  jobOffer: boolean;      // oferta de trabajo válida
  canStudy: boolean;      // estudios en Canadá
  sibling: boolean;       // hermano/a ciudadano o residente en Canadá
  french: boolean;        // francés intermedio (NCLC 7+)
};

export const EDUCATION: { key: string; label: string; points: number }[] = [
  { key: 'none', label: 'Menos de secundaria', points: 0 },
  { key: 'secondary', label: 'Secundaria / preparatoria', points: 30 },
  { key: 'oneyear', label: 'Técnico / 1 año universidad', points: 90 },
  { key: 'twoyear', label: 'Carrera técnica 2 años', points: 98 },
  { key: 'bachelor', label: 'Licenciatura / 3+ años', points: 120 },
  { key: 'twomore', label: 'Dos títulos (uno de 3+ años)', points: 128 },
  { key: 'master', label: 'Maestría', points: 135 },
  { key: 'phd', label: 'Doctorado (PhD)', points: 150 },
];

// Puntos por edad (sin cónyuge).
function agePoints(age: number): number {
  if (age <= 17) return 0;
  if (age === 18) return 99;
  if (age === 19) return 105;
  if (age >= 20 && age <= 29) return 110;
  const table: Record<number, number> = { 30: 105, 31: 99, 32: 94, 33: 88, 34: 83, 35: 77, 36: 72, 37: 66, 38: 61, 39: 55, 40: 50, 41: 39, 42: 28, 43: 17, 44: 6 };
  return table[age] ?? 0; // 45+
}

// Puntos por habilidad de idioma según CLB (sin cónyuge); se multiplica por 4 habilidades.
function langPerAbility(clb: number): number {
  if (clb >= 10) return 34;
  if (clb === 9) return 31;
  if (clb === 8) return 23;
  if (clb === 7) return 17;
  if (clb === 6) return 9;
  if (clb >= 4) return 6;
  return 0;
}

function canExpPoints(years: number): number {
  return [0, 40, 53, 64, 72, 80][Math.min(5, Math.max(0, years))];
}

export type CrsBreakdown = { label: string; points: number }[];

export function computeCRS(input: CrsInput): { total: number; breakdown: CrsBreakdown } {
  const edu = EDUCATION.find((e) => e.key === input.education)?.points ?? 0;
  const lang = langPerAbility(input.clb) * 4;
  const age = agePoints(input.age);
  const canExp = canExpPoints(input.canExp);

  // Transferibilidad de habilidades (estimada, tope 100).
  let transfer = 0;
  if (edu >= 90) transfer += input.clb >= 9 ? 50 : input.clb >= 7 ? 25 : 0;       // educación + idioma
  if (input.foreignExp >= 1) transfer += input.clb >= 9 ? 50 : input.clb >= 7 ? 25 : 0; // exp. extranjera + idioma
  transfer = Math.min(100, transfer);

  // Puntos adicionales (tope 600).
  let extra = 0;
  if (input.pnp) extra += 600;
  if (input.jobOffer) extra += 50;
  if (input.canStudy) extra += 30;
  if (input.sibling) extra += 15;
  if (input.french) extra += 25;
  extra = Math.min(600, extra);

  const breakdown: CrsBreakdown = [
    { label: 'Edad', points: age },
    { label: 'Educación', points: edu },
    { label: 'Inglés (4 habilidades)', points: lang },
    { label: 'Experiencia en Canadá', points: canExp },
    { label: 'Transferibilidad (estimada)', points: transfer },
    { label: 'Puntos adicionales', points: extra },
  ];
  const total = breakdown.reduce((s, b) => s + b.points, 0);
  return { total: Math.min(1200, total), breakdown };
}

/** Referencia rápida de cortes recientes (orientativa). */
export function crsVerdict(total: number): { txt: string; tone: 'green' | 'amber' | 'slate' } {
  if (total >= 520) return { txt: 'Competitivo para sorteos generales ✅', tone: 'green' };
  if (total >= 470) return { txt: 'Cerca del corte: apunta a PNP/categorías', tone: 'amber' };
  return { txt: 'Sube tu inglés/PNP para ser competitivo', tone: 'slate' };
}

// ── Checklist de migración por fases ──
export type CheckItem = { id: string; label: string };
export type CheckPhase = { id: string; title: string; items: CheckItem[] };

export const MIGRATION_CHECKLIST: CheckPhase[] = [
  { id: 'prep', title: 'Fase 1 · Preparación (3-6 meses)', items: [
    { id: 'eng-clb7', label: 'Subir inglés a CLB 7+ (B2/C1)' },
    { id: 'cursos', label: 'Terminar la ruta de cursos clave (DSA, backend, framework)' },
    { id: 'portfolio', label: 'Portafolio en GitHub con 3-4 proyectos sólidos' },
    { id: 'cv-ca', label: 'CV en formato canadiense (1-2 páginas, sin foto)' },
    { id: 'linkedin', label: 'LinkedIn optimizado en inglés' },
  ] },
  { id: 'docs', title: 'Fase 2 · Exámenes y documentos', items: [
    { id: 'ielts', label: 'Tomar IELTS General o CELPIP' },
    { id: 'eca', label: 'Evaluación de credenciales (ECA con WES)' },
    { id: 'passport', label: 'Pasaporte vigente' },
    { id: 'funds', label: 'Fondos de asentamiento (~CAD $14,000 soltero)' },
  ] },
  { id: 'ee', title: 'Fase 3 · Express Entry', items: [
    { id: 'profile', label: 'Crear perfil en el pool de Express Entry' },
    { id: 'crs', label: 'Calcular tu CRS y planear cómo subirlo' },
    { id: 'pnp', label: 'Aplicar a un PNP (ej. BC PNP Tech)' },
    { id: 'ita', label: 'Recibir la invitación a aplicar (ITA)' },
  ] },
  { id: 'pr', title: 'Fase 4 · Residencia permanente', items: [
    { id: 'apply-pr', label: 'Enviar la aplicación de PR completa' },
    { id: 'medical', label: 'Examen médico' },
    { id: 'police', label: 'Certificado de antecedentes penales' },
    { id: 'biometrics', label: 'Datos biométricos' },
  ] },
  { id: 'move', title: 'Fase 5 · Mudanza a Vancouver', items: [
    { id: 'flight', label: 'Comprar el vuelo' },
    { id: 'housing', label: 'Alojamiento temporal' },
    { id: 'sin', label: 'Tramitar el SIN (Social Insurance Number)' },
    { id: 'bank', label: 'Abrir cuenta bancaria canadiense' },
    { id: 'job', label: '¡Conseguir tu primer empleo dev! 🍁' },
  ] },
];
