// Mapa de músculos para el avatar corporal. Detecta qué músculos entrena cada día
// de la rutina (por el foco + nombres de ejercicios) y los enlaza a su video guía.
import type { DayPlan } from './fitness';

export type MuscleId =
  | 'pecho' | 'hombros' | 'biceps' | 'triceps' | 'antebrazo'
  | 'abdomen' | 'oblicuos' | 'trapecios' | 'dorsales' | 'lumbar'
  | 'cuadriceps' | 'femoral' | 'gluteos' | 'pantorrilla';

export type MuscleInfo = { id: MuscleId; label: string; slug: string; anim?: boolean };

export const MUSCLES: Record<MuscleId, MuscleInfo> = {
  pecho:      { id: 'pecho', label: 'Pecho', slug: 'pecho' },
  hombros:    { id: 'hombros', label: 'Hombros', slug: 'hombro-frontal' },
  biceps:     { id: 'biceps', label: 'Bíceps', slug: 'biceps', anim: true },
  triceps:    { id: 'triceps', label: 'Tríceps', slug: 'triceps' },
  antebrazo:  { id: 'antebrazo', label: 'Antebrazo', slug: 'antebrazo' },
  abdomen:    { id: 'abdomen', label: 'Abdomen', slug: 'abdomen' },
  oblicuos:   { id: 'oblicuos', label: 'Oblicuos', slug: 'abdomen-laterales' },
  trapecios:  { id: 'trapecios', label: 'Trapecios', slug: 'trapecios' },
  dorsales:   { id: 'dorsales', label: 'Espalda', slug: 'espalda-laterales' },
  lumbar:     { id: 'lumbar', label: 'Espalda baja', slug: 'espalda-inferior' },
  cuadriceps: { id: 'cuadriceps', label: 'Cuádriceps', slug: 'muslo-frontal' },
  femoral:    { id: 'femoral', label: 'Femoral', slug: 'muslo-trasero' },
  gluteos:    { id: 'gluteos', label: 'Glúteos', slug: 'gluteos' },
  pantorrilla:{ id: 'pantorrilla', label: 'Pantorrilla', slug: 'pantorrilla' },
};

// Palabras clave (en foco + ejercicios) que activan cada músculo.
const KEYWORDS: Record<MuscleId, RegExp> = {
  pecho:      /pecho|banca|apertura|press inclinado/,
  hombros:    /hombro|press militar|elevaci[oó]n(es)? lateral|press de hombro/,
  biceps:     /b[ií]ceps|curl|domin|jal[oó]n|remo/,
  triceps:    /tr[ií]ceps|fondos|banca|press inclinado/,
  antebrazo:  /antebrazo|mu[ñn]eca/,
  abdomen:    /abdomen|crunch|plancha|core|mountain|elevaci[oó]n de piernas|burpee/,
  oblicuos:   /oblicu|lateral.*abdom|abdom.*lateral/,
  trapecios:  /trapecio|encogimiento|remo/,
  dorsales:   /espalda|domin|jal[oó]n|remo|torso/,
  lumbar:     /peso muerto|lumbar|espalda baja/,
  cuadriceps: /sentadilla|prensa|zancada|pierna|cu[aá]driceps|goblet/,
  femoral:    /peso muerto rumano|femoral|isquio|zancada/,
  gluteos:    /gl[uú]teo|puente|sentadilla|zancada|peso muerto/,
  pantorrilla:/gemelo|tal[oó]n|pantorrilla/,
};

/** Músculos que entrena un día concreto de la rutina. */
export function musclesForDay(day: DayPlan): MuscleId[] {
  const text = (day.focus + ' ' + day.exercises.map((e) => e.name).join(' ')).toLowerCase();
  return (Object.keys(KEYWORDS) as MuscleId[]).filter((id) => KEYWORDS[id].test(text));
}
