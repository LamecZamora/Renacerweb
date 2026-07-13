// Biblioteca visual de ejercicios: miniatura (.png) + demostración en video (.mp4 / .avif).
// Los archivos viven en public/ejercicios/<slug>.<ext>.
export type ExGroup = 'Core' | 'Brazos' | 'Espalda' | 'Hombros' | 'Piernas' | 'Pecho';

export type Exercise = { slug: string; name: string; group: ExGroup; anim?: boolean };

export const EXERCISE_GROUPS: ExGroup[] = ['Core', 'Brazos', 'Espalda', 'Hombros', 'Piernas', 'Pecho'];

export const EXERCISES: Exercise[] = [
  { slug: 'abdomen', name: 'Abdomen', group: 'Core' },
  { slug: 'abdomen-laterales', name: 'Abdomen laterales (oblicuos)', group: 'Core' },
  { slug: 'biceps', name: 'Bíceps', group: 'Brazos', anim: true },
  { slug: 'triceps', name: 'Tríceps', group: 'Brazos' },
  { slug: 'antebrazo', name: 'Antebrazo', group: 'Brazos' },
  { slug: 'munecas', name: 'Muñecas', group: 'Brazos' },
  { slug: 'espalda-superior', name: 'Espalda media superior', group: 'Espalda' },
  { slug: 'espalda-inferior', name: 'Espalda media inferior', group: 'Espalda' },
  { slug: 'espalda-laterales', name: 'Espalda laterales (dorsales)', group: 'Espalda' },
  { slug: 'trapecios', name: 'Trapecios', group: 'Hombros' },
  { slug: 'hombro-frontal', name: 'Hombro frontal', group: 'Hombros' },
  { slug: 'hombro-trasero', name: 'Hombro trasero', group: 'Hombros' },
  { slug: 'pecho', name: 'Pecho', group: 'Pecho' },
  { slug: 'muslo-frontal', name: 'Muslo frontal (cuádriceps)', group: 'Piernas' },
  { slug: 'muslo-trasero', name: 'Muslo trasero (femoral)', group: 'Piernas' },
  { slug: 'gluteos', name: 'Glúteos', group: 'Piernas' },
  { slug: 'pantorrilla', name: 'Pantorrilla', group: 'Piernas' },
];

export const exImg = (slug: string) => `/ejercicios/${slug}.png`;
export const exMedia = (ex: Exercise) => `/ejercicios/${ex.slug}.${ex.anim ? 'avif' : 'mp4'}`;
