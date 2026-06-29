import type { Stats } from '../lib/stats';

export type Achievement = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  goal: number;
  get: (s: Stats) => number;
  rank: 'bronce' | 'plata' | 'oro' | 'platino' | 'diamante';
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-step', icon: '👣', title: 'Primer paso', desc: 'Completa tu primer ejercicio', goal: 1, get: (s) => s.exercises, rank: 'bronce' },
  { id: 'ex-10', icon: '🔟', title: 'Tomando ritmo', desc: '10 ejercicios completados', goal: 10, get: (s) => s.exercises, rank: 'bronce' },
  { id: 'ex-50', icon: '⚡', title: 'Imparable', desc: '50 ejercicios completados', goal: 50, get: (s) => s.exercises, rank: 'plata' },
  { id: 'ex-100', icon: '🌟', title: 'Centurión', desc: '100 ejercicios completados', goal: 100, get: (s) => s.exercises, rank: 'oro' },
  { id: 'eng-10', icon: '🇬🇧', title: 'Hello world', desc: '10 ejercicios de inglés', goal: 10, get: (s) => s.english, rank: 'bronce' },
  { id: 'eng-30', icon: '🗣️', title: 'Fluido', desc: '30 ejercicios de inglés', goal: 30, get: (s) => s.english, rank: 'plata' },
  { id: 'code-10', icon: '💻', title: 'Coder', desc: '10 retos de programación', goal: 10, get: (s) => s.code, rank: 'bronce' },
  { id: 'code-25', icon: '🧠', title: 'Algoritmo vivo', desc: '25 retos de programación', goal: 25, get: (s) => s.code, rank: 'plata' },
  { id: 'fit-15', icon: '🏋️', title: 'Constante', desc: '15 ejercicios de fitness', goal: 15, get: (s) => s.fitness, rank: 'bronce' },
  { id: 'journal-1', icon: '📓', title: 'Querido diario', desc: 'Escribe tu primera entrada', goal: 1, get: (s) => s.journal, rank: 'bronce' },
  { id: 'journal-7', icon: '🗓️', title: 'Reflexivo', desc: '7 entradas de diario', goal: 7, get: (s) => s.journal, rank: 'plata' },
  { id: 'book-1', icon: '📖', title: 'Lector', desc: 'Termina tu primer libro', goal: 1, get: (s) => s.booksFinished, rank: 'bronce' },
  { id: 'pages-100', icon: '📚', title: 'Devorador', desc: '100 páginas leídas', goal: 100, get: (s) => s.pages, rank: 'plata' },
  { id: 'project-1', icon: '🚀', title: 'Creador', desc: 'Crea tu primer proyecto', goal: 1, get: (s) => s.projects, rank: 'bronce' },
  { id: 'tasks-10', icon: '✅', title: 'Ejecutor', desc: '10 tareas de proyectos hechas', goal: 10, get: (s) => s.tasksDone, rank: 'plata' },
  { id: 'save-1000', icon: '💰', title: 'Ahorrador', desc: 'Balance positivo de $1000', goal: 1000, get: (s) => Math.max(0, s.net), rank: 'plata' },
  { id: 'weight-2', icon: '⚖️', title: 'En forma', desc: 'Baja 2 kg desde el inicio', goal: 2, get: (s) => Math.max(0, s.weightDelta), rank: 'plata' },
  { id: 'streak-3', icon: '🔥', title: 'Racha x3', desc: '3 días seguidos activo', goal: 3, get: (s) => s.streak, rank: 'bronce' },
  { id: 'streak-7', icon: '🔥', title: 'Racha x7', desc: '7 días seguidos activo', goal: 7, get: (s) => s.streak, rank: 'oro' },
  { id: 'level-5', icon: '🏆', title: 'Nivel 5', desc: 'Alcanza el nivel 5', goal: 5, get: (s) => s.level, rank: 'plata' },
  { id: 'level-10', icon: '👑', title: 'Nivel 10', desc: 'Alcanza el nivel 10', goal: 10, get: (s) => s.level, rank: 'oro' },

  // ── Más logros ──
  { id: 'ex-250', icon: '💎', title: 'Maestro del hábito', desc: '250 ejercicios completados', goal: 250, get: (s) => s.exercises, rank: 'oro' },
  { id: 'eng-50', icon: '🎓', title: 'Bilingüe en camino', desc: '50 ejercicios de inglés', goal: 50, get: (s) => s.english, rank: 'oro' },
  { id: 'code-40', icon: '🦾', title: 'Ingeniero', desc: '40 retos de programación', goal: 40, get: (s) => s.code, rank: 'oro' },
  { id: 'fit-30', icon: '🥇', title: 'Atleta', desc: '30 ejercicios de fitness', goal: 30, get: (s) => s.fitness, rank: 'plata' },
  { id: 'journal-30', icon: '✍️', title: 'Escritor diario', desc: '30 entradas de diario', goal: 30, get: (s) => s.journal, rank: 'oro' },
  { id: 'book-3', icon: '🏛️', title: 'Bibliófilo', desc: 'Termina 3 libros', goal: 3, get: (s) => s.booksFinished, rank: 'plata' },
  { id: 'pages-500', icon: '📜', title: 'Erudito', desc: '500 páginas leídas', goal: 500, get: (s) => s.pages, rank: 'oro' },
  { id: 'project-3', icon: '🏗️', title: 'Arquitecto', desc: 'Crea 3 proyectos', goal: 3, get: (s) => s.projects, rank: 'plata' },
  { id: 'tasks-30', icon: '🧩', title: 'Resolutivo', desc: '30 tareas de proyectos', goal: 30, get: (s) => s.tasksDone, rank: 'oro' },
  { id: 'save-5000', icon: '🏦', title: 'Inversor', desc: 'Balance positivo de $5000', goal: 5000, get: (s) => Math.max(0, s.net), rank: 'oro' },
  { id: 'weight-5', icon: '🔥', title: 'Transformación', desc: 'Baja 5 kg desde el inicio', goal: 5, get: (s) => Math.max(0, s.weightDelta), rank: 'oro' },
  { id: 'metrics-10', icon: '📏', title: 'Medido', desc: 'Registra tus métricas 10 veces', goal: 10, get: (s) => s.metrics, rank: 'bronce' },
  { id: 'active-15', icon: '📆', title: 'Comprometido', desc: '15 días activos en total', goal: 15, get: (s) => s.activeDays, rank: 'plata' },
  { id: 'active-30', icon: '🗓️', title: 'Disciplina de acero', desc: '30 días activos en total', goal: 30, get: (s) => s.activeDays, rank: 'oro' },
  { id: 'streak-14', icon: '🌋', title: 'Racha x14', desc: '14 días seguidos activo', goal: 14, get: (s) => s.streak, rank: 'oro' },
  { id: 'level-20', icon: '🌌', title: 'Leyenda', desc: 'Alcanza el nivel 20', goal: 20, get: (s) => s.level, rank: 'oro' },

  // ── Cursos completados (certificados) ──
  { id: 'course-1', icon: '🎓', title: 'Primer certificado', desc: 'Completa tu primer curso al 100%', goal: 1, get: (s) => s.coursesCompleted, rank: 'bronce' },
  { id: 'course-3', icon: '📜', title: 'Coleccionista', desc: 'Completa 3 cursos al 100%', goal: 3, get: (s) => s.coursesCompleted, rank: 'plata' },
  { id: 'course-5', icon: '🏅', title: 'Graduado', desc: 'Completa 5 cursos al 100%', goal: 5, get: (s) => s.coursesCompleted, rank: 'oro' },
  { id: 'course-10', icon: '🧑‍🎓', title: 'Maestro', desc: 'Completa 10 cursos al 100%', goal: 10, get: (s) => s.coursesCompleted, rank: 'oro' },

  // ════════ FASE PLATINO (muy difícil) ════════
  { id: 'ex-500', icon: '🛡️', title: 'Inquebrantable', desc: '500 ejercicios completados', goal: 500, get: (s) => s.exercises, rank: 'platino' },
  { id: 'course-15', icon: '📚', title: 'Erudito del código', desc: 'Completa 15 cursos al 100%', goal: 15, get: (s) => s.coursesCompleted, rank: 'platino' },
  { id: 'eng-100', icon: '🌐', title: 'Casi nativo', desc: '100 ejercicios de inglés', goal: 100, get: (s) => s.english, rank: 'platino' },
  { id: 'eng-exam-3', icon: '📑', title: 'Examinado (inglés)', desc: 'Aprueba 3 exámenes de nivel de inglés', goal: 3, get: (s) => s.englishExamsPassed, rank: 'platino' },
  { id: 'cexam-15', icon: '✍️', title: 'Aprobado x15', desc: 'Aprueba 15 exámenes de nivel de cursos', goal: 15, get: (s) => s.courseExamsPassed, rank: 'platino' },
  { id: 'final-3', icon: '🏅', title: 'Triple distinción', desc: 'Supera 3 exámenes finales de curso', goal: 3, get: (s) => s.finalExamsPassed, rank: 'platino' },
  { id: 'proj-done-3', icon: '📦', title: 'Entregador', desc: 'Termina 3 proyectos (todas sus tareas)', goal: 3, get: (s) => s.projectsCompleted, rank: 'platino' },
  { id: 'proj-5', icon: '🏗️', title: 'Constructor serial', desc: 'Crea 5 proyectos', goal: 5, get: (s) => s.projects, rank: 'platino' },
  { id: 'tasks-50', icon: '🧰', title: 'Productividad pura', desc: '50 tareas de proyectos hechas', goal: 50, get: (s) => s.tasksDone, rank: 'platino' },
  { id: 'journal-50', icon: '📔', title: 'Cronista', desc: '50 entradas de diario', goal: 50, get: (s) => s.journal, rank: 'platino' },
  { id: 'pages-1000', icon: '📚', title: 'Ratón de biblioteca', desc: '1000 páginas leídas', goal: 1000, get: (s) => s.pages, rank: 'platino' },
  { id: 'book-5', icon: '📖', title: 'Devoralibros', desc: 'Termina 5 libros', goal: 5, get: (s) => s.booksFinished, rank: 'platino' },
  { id: 'fit-50', icon: '🏋️', title: 'Disciplina física', desc: '50 ejercicios de fitness', goal: 50, get: (s) => s.fitness, rank: 'platino' },
  { id: 'active-60', icon: '📅', title: 'Dos meses firme', desc: '60 días activos en total', goal: 60, get: (s) => s.activeDays, rank: 'platino' },
  { id: 'streak-30', icon: '🌋', title: 'Racha x30', desc: '30 días seguidos activo', goal: 30, get: (s) => s.streak, rank: 'platino' },
  { id: 'level-30', icon: '⭐', title: 'Nivel 30', desc: 'Alcanza el nivel 30', goal: 30, get: (s) => s.level, rank: 'platino' },
  { id: 'save-10000', icon: '💰', title: 'Capitalista', desc: 'Balance positivo de $10,000', goal: 10000, get: (s) => Math.max(0, s.net), rank: 'platino' },
  { id: 'weight-8', icon: '⚖️', title: 'Gran cambio', desc: 'Baja 8 kg desde el inicio', goal: 8, get: (s) => Math.max(0, s.weightDelta), rank: 'platino' },
  { id: 'code-60', icon: '🦾', title: 'Competidor', desc: '60 retos de programación', goal: 60, get: (s) => s.code, rank: 'platino' },

  // ════════ FASE DIAMANTE (élite) ════════
  { id: 'ex-1000', icon: '💠', title: 'Leyenda viva', desc: '1000 ejercicios completados', goal: 1000, get: (s) => s.exercises, rank: 'diamante' },
  { id: 'course-20', icon: '🎓', title: 'Políglota total', desc: 'Completa 20 cursos al 100%', goal: 20, get: (s) => s.coursesCompleted, rank: 'diamante' },
  { id: 'course-all', icon: '👑', title: 'Lo completaste TODO', desc: 'Completa los 25 cursos al 100%', goal: 25, get: (s) => s.coursesCompleted, rank: 'diamante' },
  { id: 'eng-c2', icon: '🇬🇧', title: 'Nivel C2', desc: 'Completa todos los ejercicios de inglés (118)', goal: 118, get: (s) => s.english, rank: 'diamante' },
  { id: 'eng-exam-5', icon: '🏆', title: 'Maestría en inglés', desc: 'Aprueba los 5 exámenes de nivel de inglés', goal: 5, get: (s) => s.englishExamsPassed, rank: 'diamante' },
  { id: 'cexam-30', icon: '📜', title: 'Sin reprobar', desc: 'Aprueba 30 exámenes de nivel de cursos', goal: 30, get: (s) => s.courseExamsPassed, rank: 'diamante' },
  { id: 'final-10', icon: '🥇', title: 'Diez distinciones', desc: 'Supera 10 exámenes finales con distinción', goal: 10, get: (s) => s.finalExamsPassed, rank: 'diamante' },
  { id: 'proj-done-10', icon: '🚀', title: 'Portafolio sólido', desc: 'Termina 10 proyectos completos', goal: 10, get: (s) => s.projectsCompleted, rank: 'diamante' },
  { id: 'tasks-150', icon: '🧩', title: 'Imparable total', desc: '150 tareas de proyectos', goal: 150, get: (s) => s.tasksDone, rank: 'diamante' },
  { id: 'journal-100', icon: '✍️', title: 'Escritor de tu vida', desc: '100 entradas de diario', goal: 100, get: (s) => s.journal, rank: 'diamante' },
  { id: 'pages-3000', icon: '📜', title: 'Sabio', desc: '3000 páginas leídas', goal: 3000, get: (s) => s.pages, rank: 'diamante' },
  { id: 'book-12', icon: '🏛️', title: 'Biblioteca andante', desc: 'Termina 12 libros', goal: 12, get: (s) => s.booksFinished, rank: 'diamante' },
  { id: 'fit-100', icon: '🥇', title: 'Máquina', desc: '100 ejercicios de fitness', goal: 100, get: (s) => s.fitness, rank: 'diamante' },
  { id: 'active-180', icon: '🗓️', title: 'Medio año de fuego', desc: '180 días activos en total', goal: 180, get: (s) => s.activeDays, rank: 'diamante' },
  { id: 'streak-60', icon: '🔥', title: 'Racha x60', desc: '60 días seguidos activo', goal: 60, get: (s) => s.streak, rank: 'diamante' },
  { id: 'streak-100', icon: '☄️', title: 'Racha x100', desc: '100 días seguidos: élite mundial', goal: 100, get: (s) => s.streak, rank: 'diamante' },
  { id: 'level-50', icon: '🌌', title: 'Nivel 50', desc: 'Alcanza el nivel 50', goal: 50, get: (s) => s.level, rank: 'diamante' },
  { id: 'level-75', icon: '💫', title: 'Trascendente', desc: 'Alcanza el nivel 75', goal: 75, get: (s) => s.level, rank: 'diamante' },
  { id: 'save-25000', icon: '🏦', title: 'Para la mudanza', desc: 'Balance positivo de $25,000', goal: 25000, get: (s) => Math.max(0, s.net), rank: 'diamante' },
  { id: 'code-all', icon: '🧠', title: 'Algoritmo perfecto', desc: '80 retos de programación', goal: 80, get: (s) => s.code, rank: 'diamante' },

  // ════════ Hitos intermedios extra ════════
  { id: 'ex-150', icon: '⚙️', title: 'En marcha', desc: '150 ejercicios completados', goal: 150, get: (s) => s.exercises, rank: 'plata' },
  { id: 'ex-750', icon: '🛡️', title: 'Fortaleza', desc: '750 ejercicios completados', goal: 750, get: (s) => s.exercises, rank: 'platino' },
  { id: 'course-2', icon: '🎓', title: 'Dos al hilo', desc: 'Completa 2 cursos al 100%', goal: 2, get: (s) => s.coursesCompleted, rank: 'bronce' },
  { id: 'course-7', icon: '📘', title: 'Siete saberes', desc: 'Completa 7 cursos al 100%', goal: 7, get: (s) => s.coursesCompleted, rank: 'plata' },
  { id: 'eng-20', icon: '🔤', title: 'Calentando', desc: '20 ejercicios de inglés', goal: 20, get: (s) => s.english, rank: 'bronce' },
  { id: 'eng-70', icon: '🗨️', title: 'Conversador', desc: '70 ejercicios de inglés', goal: 70, get: (s) => s.english, rank: 'oro' },
  { id: 'eng-90', icon: '🎙️', title: 'Casi fluido', desc: '90 ejercicios de inglés', goal: 90, get: (s) => s.english, rank: 'platino' },
  { id: 'cexam-3', icon: '📝', title: 'Primeros exámenes', desc: 'Aprueba 3 exámenes de nivel de cursos', goal: 3, get: (s) => s.courseExamsPassed, rank: 'bronce' },
  { id: 'cexam-8', icon: '🖊️', title: 'Examinado', desc: 'Aprueba 8 exámenes de nivel de cursos', goal: 8, get: (s) => s.courseExamsPassed, rank: 'plata' },
  { id: 'final-1', icon: '🏅', title: 'Primera distinción', desc: 'Supera tu primer examen final', goal: 1, get: (s) => s.finalExamsPassed, rank: 'plata' },
  { id: 'proj-done-1', icon: '📦', title: 'Primer entregable', desc: 'Termina tu primer proyecto completo', goal: 1, get: (s) => s.projectsCompleted, rank: 'bronce' },
  { id: 'journal-3', icon: '🖋️', title: 'Tomando el hábito', desc: '3 entradas de diario', goal: 3, get: (s) => s.journal, rank: 'bronce' },
  { id: 'journal-15', icon: '📓', title: 'Constante al escribir', desc: '15 entradas de diario', goal: 15, get: (s) => s.journal, rank: 'plata' },
  { id: 'pages-250', icon: '📕', title: 'Lector activo', desc: '250 páginas leídas', goal: 250, get: (s) => s.pages, rank: 'plata' },
  { id: 'pages-2000', icon: '📚', title: 'Insaciable', desc: '2000 páginas leídas', goal: 2000, get: (s) => s.pages, rank: 'platino' },
  { id: 'book-2', icon: '📗', title: 'Segundo libro', desc: 'Termina 2 libros', goal: 2, get: (s) => s.booksFinished, rank: 'bronce' },
  { id: 'fit-5', icon: '🤸', title: 'Arrancando', desc: '5 ejercicios de fitness', goal: 5, get: (s) => s.fitness, rank: 'bronce' },
  { id: 'fit-45', icon: '🏃', title: 'En forma', desc: '45 ejercicios de fitness', goal: 45, get: (s) => s.fitness, rank: 'oro' },
  { id: 'active-7', icon: '📆', title: 'Primera semana', desc: '7 días activos en total', goal: 7, get: (s) => s.activeDays, rank: 'bronce' },
  { id: 'active-45', icon: '🗓️', title: 'Mes y medio', desc: '45 días activos en total', goal: 45, get: (s) => s.activeDays, rank: 'oro' },
  { id: 'active-100', icon: '💯', title: 'Cien días', desc: '100 días activos en total', goal: 100, get: (s) => s.activeDays, rank: 'diamante' },
  { id: 'streak-21', icon: '🔥', title: 'Racha x21', desc: '21 días seguidos activo', goal: 21, get: (s) => s.streak, rank: 'oro' },
  { id: 'level-15', icon: '🏆', title: 'Nivel 15', desc: 'Alcanza el nivel 15', goal: 15, get: (s) => s.level, rank: 'plata' },
  { id: 'level-40', icon: '🌠', title: 'Nivel 40', desc: 'Alcanza el nivel 40', goal: 40, get: (s) => s.level, rank: 'diamante' },
  { id: 'metrics-30', icon: '📏', title: 'Medido al detalle', desc: 'Registra tus métricas 30 veces', goal: 30, get: (s) => s.metrics, rank: 'plata' },
  { id: 'save-2500', icon: '💵', title: 'Ahorrando en serio', desc: 'Balance positivo de $2,500', goal: 2500, get: (s) => Math.max(0, s.net), rank: 'plata' },
  { id: 'tasks-20', icon: '✅', title: 'Ejecutor constante', desc: '20 tareas de proyectos', goal: 20, get: (s) => s.tasksDone, rank: 'plata' },
];

export const RANK_COLOR = { bronce: '#b45309', plata: '#94a3b8', oro: '#f59e0b', platino: '#22d3ee', diamante: '#a78bfa' } as const;
