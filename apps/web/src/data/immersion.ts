// Inmersión: aprender inglés viendo, jugando y escuchando. Recomendaciones curadas por nivel,
// con POR QUÉ ayuda cada una. La inmersión es lo que de verdad hace fluido el oído.
export type ImKind = 'Juego' | 'Serie' | 'Película' | 'YouTube' | 'Podcast';

export type ImItem = { title: string; kind: ImKind; level: string; emoji: string; why: string };

export const IM_KINDS: ImKind[] = ['Juego', 'Serie', 'Película', 'YouTube', 'Podcast'];

export const IMMERSION: ImItem[] = [
  // 🎮 Videojuegos — interactivos, contexto visual, aprendes sin darte cuenta
  { title: 'Roblox (chat en inglés)', kind: 'Juego', level: 'A1-B1', emoji: '🎮', why: 'Juegas y CHATEAS con gente real en inglés. Como ya te gusta Roblox, cambia el idioma a inglés y lee todo.' },
  { title: 'Minecraft', kind: 'Juego', level: 'A1-A2', emoji: '⛏️', why: 'Vocabulario básico de objetos y acciones. Ponlo en inglés y sigue tutoriales en inglés de YouTube.' },
  { title: 'Stardew Valley', kind: 'Juego', level: 'A2-B1', emoji: '🌱', why: 'Texto sencillo y a tu ritmo: lees los diálogos sin prisa ni presión.' },
  { title: 'The Sims 4', kind: 'Juego', level: 'A2', emoji: '🏠', why: 'Vocabulario de la vida diaria (casa, trabajo, relaciones) en contexto.' },
  { title: 'Portal 2', kind: 'Juego', level: 'B1', emoji: '🧪', why: 'Voces MUY claras y con humor; ideal para entrenar el oído.' },
  { title: 'Life is Strange', kind: 'Juego', level: 'B1-B2', emoji: '📸', why: 'Diálogos naturales de adolescentes/adultos; decisiones que te enganchan a escuchar.' },

  // 📺 Series — inglés cotidiano; estrategia de subtítulos abajo
  { title: 'Extra English', kind: 'Serie', level: 'A1-A2', emoji: '🎬', why: 'Sitcom HECHA para estudiantes: hablan lento y claro. El mejor arranque.' },
  { title: 'Friends', kind: 'Serie', level: 'A2-B1', emoji: '☕', why: 'La clásica para aprender: inglés cotidiano, frases hechas, episodios cortos.' },
  { title: 'Stranger Things', kind: 'Serie', level: 'B1', emoji: '🚲', why: 'Inglés natural y adictiva: querrás ver "un capítulo más" (y escuchar más).' },
  { title: 'Brooklyn Nine-Nine', kind: 'Serie', level: 'B1-B2', emoji: '🚓', why: 'Humor rápido pero claro; frases muy usadas en el día a día.' },
  { title: 'The Office (US)', kind: 'Serie', level: 'B2', emoji: '📎', why: 'Inglés de oficina + sarcasmo real; perfecta para el mundo laboral dev.' },

  // 🍿 Películas
  { title: 'Pixar / Disney (Coco, Up, Toy Story)', kind: 'Película', level: 'A2-B1', emoji: '🍿', why: 'Inglés claro y limpio, historia fácil de seguir aunque pierdas palabras.' },
  { title: 'The Social Network', kind: 'Película', level: 'B2', emoji: '💻', why: 'Inglés técnico/startup rapidísimo; reto ideal cuando ya estés en B2.' },

  // ▶️ YouTube — canales para aprender
  { title: 'BBC Learning English', kind: 'YouTube', level: 'A1-C1', emoji: '🇬🇧', why: 'Lecciones cortas por nivel, pronunciación británica clara. Oro puro y gratis.' },
  { title: 'English with Lucy', kind: 'YouTube', level: 'A2-B2', emoji: '📚', why: 'Gramática, vocabulario y pronunciación explicados clarísimo.' },
  { title: "Rachel's English", kind: 'YouTube', level: 'B1-C1', emoji: '🗣️', why: 'La mejor para PRONUNCIACIÓN americana (sonidos, acento, ritmo).' },
  { title: 'Canales de gaming en inglés', kind: 'YouTube', level: 'B1-C1', emoji: '🎧', why: 'Ve let\'s-plays de tus juegos favoritos en inglés: inmersión que ni sientes.' },

  // 🎧 Podcasts — para el oído en movimiento
  { title: 'BBC · 6 Minute English', kind: 'Podcast', level: 'A2-B1', emoji: '⏱️', why: '6 minutos por tema, con transcripción. Perfecto para el camión o el gym.' },
  { title: 'BBC · The English We Speak', kind: 'Podcast', level: 'B1', emoji: '💬', why: 'Modismos y frases reales que los nativos SÍ usan.' },
  { title: 'All Ears English', kind: 'Podcast', level: 'B1-B2', emoji: '👂', why: 'Inglés conversacional americano; entrena el oído a velocidad real.' },
];

// Estrategia (la clave: cómo consumir el contenido para que SÍ funcione).
export const IMMERSION_STRATEGY: string[] = [
  '🔤 Subtítulos EN INGLÉS, no en español: tu oído conecta lo que oyes con lo que ves escrito.',
  '🔁 Shadowing: pausa y repite la frase en voz alta imitando el acento y el ritmo.',
  '🎮 Cambia tu celular, consola y juegos a inglés: inmersión pasiva todo el día.',
  '📆 20 min diarios > 3 horas el domingo. La constancia manda.',
  '✍️ Anota 3-5 palabras nuevas por sesión y úsalas en el módulo de Escritura.',
  '🚫 No traduzcas cada palabra: entiende la idea general, el resto llega solo.',
];
