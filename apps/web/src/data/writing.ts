// Ejercicios de escritura en inglés con revisión automática (heurística, sin IA).
export type WCheck = { label: string; ok: (t: string) => boolean };
export type WritingPrompt = { id: string; prompt: string; hint: string; example: string; checks: WCheck[] };

const words = (t: string) => t.trim().split(/\s+/).filter(Boolean);
const minWords = (n: number): WCheck => ({ label: `Al menos ${n} palabras`, ok: (t) => words(t).length >= n });
const startsCapital: WCheck = { label: 'Empieza con mayúscula', ok: (t) => /^[A-Z]/.test(t.trim()) };
const endsPunct: WCheck = { label: 'Termina con . ! o ?', ok: (t) => /[.!?]\s*$/.test(t.trim()) };
const containsAny = (label: string, res: RegExp[]): WCheck => ({ label, ok: (t) => res.some((r) => r.test(t)) });
// Detecta palabras muy comunes en español (señal de que NO escribió en inglés).
const SPANISH = /\b(que|pero|porque|muy|tengo|soy|estoy|hola|gracias|trabajo|quiero|hacer|tambien|también|para|como|esto)\b/i;
const inEnglish: WCheck = { label: 'Está en inglés (no español)', ok: (t) => !SPANISH.test(t) };

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'w-routine',
    prompt: 'Write 2-3 sentences about your daily routine (Present Simple).',
    hint: 'Usa el presente simple: "I wake up at...", "I usually...", "every day".',
    example: 'I wake up at seven every day. I usually study English and code in the morning. Then I work and go to the gym.',
    checks: [minWords(15), startsCapital, endsPunct, containsAny('Usa presente/rutina (I, every, usually, wake, work…)', [/\bI\b/, /\bevery\b/i, /\busually\b/i, /\bwake\b/i, /\bwork\b/i, /\bstudy\b/i]), inEnglish],
  },
  {
    id: 'w-dreamjob',
    prompt: 'Describe your dream job abroad (Canada, Japan…). Use "I want" or "I would like".',
    hint: 'Ej.: "I want to be a software developer in Vancouver because...".',
    example: 'I want to be a software developer in Vancouver. I would like to work with React and build great products. It is my dream.',
    checks: [minWords(15), startsCapital, endsPunct, containsAny('Incluye "I want" o "I would like"', [/\bI want\b/i, /\bI'?d like\b/i, /\bI would like\b/i]), containsAny('Menciona el trabajo (developer, engineer, job…)', [/developer/i, /engineer/i, /programmer/i, /\bjob\b/i, /\bwork\b/i]), inEnglish],
  },
  {
    id: 'w-yesterday',
    prompt: 'Write about something you did yesterday (Past Simple).',
    hint: 'Verbos en pasado: "I studied", "I went", "yesterday".',
    example: 'Yesterday I studied JavaScript for two hours. I went to the gym and then I watched a movie with my family.',
    checks: [minWords(12), startsCapital, endsPunct, containsAny('Usa pasado (yesterday, -ed, went, did, was…)', [/\byesterday\b/i, /\b\w+ed\b/i, /\bwent\b/i, /\bdid\b/i, /\bwas\b/i, /\bwere\b/i, /\bago\b/i]), inEnglish],
  },
  {
    id: 'w-intro',
    prompt: 'Introduce yourself for a job interview (2-3 sentences).',
    hint: 'Ej.: "My name is... I am a developer with... experience. I am looking for...".',
    example: "My name is Cemal and I am a software developer. I have experience with JavaScript and React. I am looking for a junior role in Canada.",
    checks: [minWords(15), startsCapital, endsPunct, containsAny('Te presentas ("My name is" / "I am")', [/\bMy name is\b/i, /\bI am\b/i, /\bI'?m\b/i]), containsAny('Mencionas perfil (developer, experience, role…)', [/developer/i, /experience/i, /\brole\b/i, /engineer/i]), inEnglish],
  },
  {
    id: 'w-weekend',
    prompt: 'Write about your plans for the weekend (use "going to" or "will").',
    hint: 'Ej.: "This weekend I am going to study and I will rest on Sunday."',
    example: 'This weekend I am going to study programming and practice English. On Sunday I will rest and watch a movie.',
    checks: [minWords(12), startsCapital, endsPunct, containsAny('Usa futuro ("going to" / "will")', [/going to/i, /\bwill\b/i]), inEnglish],
  },
  {
    id: 'w-opinion',
    prompt: 'Give your opinion: Is learning English important for a developer? Why?',
    hint: 'Ej.: "I think English is important because most documentation and jobs are in English."',
    example: 'I think learning English is very important because most documentation, interviews and remote jobs are in English. It opens many opportunities.',
    checks: [minWords(15), startsCapital, endsPunct, containsAny('Da tu opinión ("I think" / "because")', [/I think/i, /in my opinion/i, /\bbecause\b/i]), inEnglish],
  },
];
