import type { Job } from './jobs';
import { SAMPLE_JOBS, JOB_SEARCH_LINKS } from './jobs';
import type { CheckPhase } from './canada';
import { MIGRATION_CHECKLIST } from './canada';

export type Destination = {
  id: string;
  city: string;
  country: string;
  flag: string;
  color: string;
  tagline: string;
  visa: string;              // contexto de reubicación / visa
  jobLinks: { name: string; url: string }[];
  jobs: Job[];
  checklist: CheckPhase[];
  checklistKey: string;      // clave localStorage del checklist
  pointsSystem?: 'canada-crs'; // si aplica calculadora de puntos
};

// ── Durango, México (mercado nacional: sin visa para mexicanos) ──
const DURANGO_JOBS: Job[] = [
  { id: 'd-local-fs', title: 'Programador Full Stack', company: 'Software local (Durango)', city: 'Durango', level: 'Junior', skills: ['PHP', 'SQL', 'HTML', 'CSS', 'JavaScript', 'Git'], salary: 'MXN 12-20k/mes' },
  { id: 'd-local-sup', title: 'Soporte / QA Jr', company: 'Empresa local (Durango)', city: 'Durango', level: 'Junior', skills: ['SQL', 'Git'], salary: 'MXN 10-16k/mes' },
  { id: 'd-kueski', title: 'Desarrollador Web Jr (Remoto)', company: 'Kueski', city: 'Remoto México', level: 'Junior', skills: ['JavaScript', 'React', 'SQL', 'Git'], salary: 'MXN 20-30k/mes' },
  { id: 'd-clip', title: 'Backend Developer Jr (Remoto)', company: 'Clip', city: 'Remoto México', level: 'Junior', skills: ['Java', 'SQL', 'REST', 'Git'], salary: 'MXN 25-35k/mes' },
  { id: 'd-konfio', title: 'Frontend Developer (Remoto)', company: 'Konfío', city: 'Remoto México', level: 'Junior', skills: ['JavaScript', 'React', 'TypeScript', 'Git'], salary: 'MXN 25-40k/mes' },
  { id: 'd-bitso', title: 'Junior Software Engineer (Remoto)', company: 'Bitso', city: 'Remoto México', level: 'Junior', skills: ['Python', 'SQL', 'Git', 'Inglés'], salary: 'MXN 30-45k/mes' },
];

const DURANGO_CHECKLIST: CheckPhase[] = [
  { id: 'dgo-prep', title: 'Fase 1 · Prepárate', items: [
    { id: 'dgo-cv', label: 'CV en español (y uno en inglés para vacantes remotas)' },
    { id: 'dgo-port', label: 'Portafolio en GitHub con 2-3 proyectos' },
    { id: 'dgo-linkedin', label: 'Perfil de LinkedIn al día' },
  ] },
  { id: 'dgo-apply', title: 'Fase 2 · Busca y aplica', items: [
    { id: 'dgo-occ', label: 'Crear perfil en OCC y Computrabajo' },
    { id: 'dgo-local', label: 'Aplicar a vacantes locales en Durango' },
    { id: 'dgo-remote', label: 'Aplicar a remoto-México (fintechs: Kueski, Clip, Bitso…)' },
    { id: 'dgo-alert', label: 'Activar alertas de empleo por correo' },
  ] },
  { id: 'dgo-close', title: 'Fase 3 · Entrevista y cierra', items: [
    { id: 'dgo-interview', label: 'Practicar entrevista técnica (módulo 🎤 Entrevista)' },
    { id: 'dgo-negotiate', label: 'Negociar sueldo y prestaciones' },
    { id: 'dgo-offer', label: '¡Aceptar tu primer empleo dev! 🎉' },
  ] },
];

// ── Tokyo, Japón (requiere visa de trabajo) ──
const TOKYO_JOBS: Job[] = [
  { id: 't-mercari', title: 'Software Engineer (English OK)', company: 'Mercari', city: 'Tokyo', level: 'Intermediate', skills: ['Go', 'React', 'Docker', 'SQL', 'Inglés'], salary: 'JPY 6-9M/año' },
  { id: 't-rakuten', title: 'Backend Engineer', company: 'Rakuten', city: 'Tokyo', level: 'Junior', skills: ['Java', 'SQL', 'Git', 'Inglés'], salary: 'JPY 5-7M/año' },
  { id: 't-line', title: 'Frontend Engineer', company: 'LINE Yahoo', city: 'Tokyo', level: 'Intermediate', skills: ['JavaScript', 'React', 'TypeScript', 'Inglés'], salary: 'JPY 6-8M/año' },
  { id: 't-woven', title: 'Software Engineer', company: 'Woven by Toyota', city: 'Tokyo', level: 'Intermediate', skills: ['C++', 'Python', 'Docker', 'Git', 'Inglés'], salary: 'JPY 7-10M/año' },
  { id: 't-paypay', title: 'Server Side Engineer', company: 'PayPay', city: 'Tokyo', level: 'Junior', skills: ['Java', 'SQL', 'Docker', 'Inglés'], salary: 'JPY 6-8M/año' },
  { id: 't-indeed', title: 'Software Engineer (English env.)', company: 'Indeed Japan', city: 'Tokyo', level: 'Junior', skills: ['Java', 'React', 'SQL', 'Git', 'Inglés'], salary: 'JPY 6-9M/año' },
];

const TOKYO_CHECKLIST: CheckPhase[] = [
  { id: 'tk-prep', title: 'Fase 1 · Prepárate (6-12 meses)', items: [
    { id: 'tk-eng', label: 'Inglés sólido (B2+): casi toda entrevista internacional es en inglés' },
    { id: 'tk-port', label: 'Portafolio fuerte en GitHub (3+ proyectos)' },
    { id: 'tk-cv', label: 'CV en inglés (y opcional 履歴書 "rirekisho")' },
    { id: 'tk-jp', label: 'Japonés básico (N5-N4) — suma mucho aunque trabajes en inglés' },
  ] },
  { id: 'tk-apply', title: 'Fase 2 · Aplica a empresas "English OK"', items: [
    { id: 'tk-boards', label: 'Buscar en Japan Dev, TokyoDev y LinkedIn' },
    { id: 'tk-target', label: 'Apuntar a Mercari, Rakuten, PayPay, LINE Yahoo…' },
    { id: 'tk-interview', label: 'Pasar entrevistas técnicas (a veces en inglés)' },
    { id: 'tk-offer', label: 'Conseguir una oferta de trabajo' },
  ] },
  { id: 'tk-visa', title: 'Fase 3 · Visa de trabajo', items: [
    { id: 'tk-coe', label: 'La empresa tramita el Certificate of Eligibility (CoE)' },
    { id: 'tk-visa-app', label: 'Con el CoE, solicitar la visa "Engineer/Specialist" en el consulado de Japón' },
    { id: 'tk-hsp', label: 'Revisar si calificas a la visa de Profesional Altamente Calificado (HSP, por puntos)' },
  ] },
  { id: 'tk-move', title: 'Fase 4 · Mudanza a Tokyo', items: [
    { id: 'tk-flight', label: 'Comprar el vuelo' },
    { id: 'tk-residence', label: 'Recoger la Residence Card al llegar' },
    { id: 'tk-ward', label: 'Registrarte en el ayuntamiento (ward office) + seguro de salud' },
    { id: 'tk-bank', label: 'Abrir cuenta bancaria y conseguir depto (a veces la empresa ayuda)' },
  ] },
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'vancouver', city: 'Vancouver', country: 'Canadá', flag: '🇨🇦', color: '#ef4444',
    tagline: 'Empleo de desarrollador y residencia en Canadá.',
    visa: 'Requiere residencia/visa de trabajo. Ruta común: Express Entry (puntos CRS) o nominación provincial (BC PNP Tech). Inglés alto es clave.',
    jobLinks: JOB_SEARCH_LINKS, jobs: SAMPLE_JOBS,
    checklist: MIGRATION_CHECKLIST, checklistKey: 'renacer_canada_checklist', pointsSystem: 'canada-crs',
  },
  {
    id: 'durango', city: 'Durango', country: 'México', flag: '🇲🇽', color: '#16a34a',
    tagline: 'Tu primer empleo dev en casa: local o remoto, sin trámites de visa.',
    visa: 'Sin visa: es tu país. Ventaja: bajo costo de vida y puedes combinar empleo local con remoto-México (mejor sueldo). El portafolio y el inglés te abren el remoto.',
    jobLinks: [
      { name: 'OCC', url: 'https://www.occ.com.mx/empleos/de-desarrollador/en-durango/' },
      { name: 'Computrabajo', url: 'https://mx.computrabajo.com/trabajo-de-programador-en-durango' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search/?keywords=desarrollador&location=Durango%2C%20M%C3%A9xico' },
      { name: 'Indeed MX', url: 'https://mx.indeed.com/jobs?q=desarrollador&l=Durango' },
      { name: 'Remoto (OCC)', url: 'https://www.occ.com.mx/empleos/de-desarrollador/?modalidad=home-office' },
    ],
    jobs: DURANGO_JOBS, checklist: DURANGO_CHECKLIST, checklistKey: 'renacer_durango_checklist',
  },
  {
    id: 'tokyo', city: 'Tokyo', country: 'Japón', flag: '🇯🇵', color: '#db2777',
    tagline: 'Ingeniero de software en Tokyo, en empresas que contratan extranjeros.',
    visa: 'Requiere visa de trabajo (Engineer/Specialist). La empresa que te contrata tramita tu CoE. Hay muchas empresas "English OK"; el japonés ayuda pero no siempre es obligatorio.',
    jobLinks: [
      { name: 'Japan Dev', url: 'https://japan-dev.com/jobs' },
      { name: 'TokyoDev', url: 'https://www.tokyodev.com/jobs' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search/?keywords=software%20engineer&location=Tokyo%2C%20Japan' },
      { name: 'Indeed JP', url: 'https://jp.indeed.com/jobs?q=software+engineer&l=Tokyo' },
      { name: 'Daijob', url: 'https://www.daijob.com/en/jobs/search?job_search_form%5Bkeyword%5D=software+engineer' },
    ],
    jobs: TOKYO_JOBS, checklist: TOKYO_CHECKLIST, checklistKey: 'renacer_tokyo_checklist',
  },
];
