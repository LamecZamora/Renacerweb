import type { DayPlan } from './fitness';

// Plan de entrenamiento por fases según el IMC. Conforme bajas de peso y tu IMC mejora,
// avanzas de fase y los ejercicios cambian (de bajo impacto → fuerza → definición).
export type FitPhase = {
  id: string;
  name: string;
  range: string;       // categoría IMC a la que aplica
  color: string;
  focus: string;
  frequency: string;
  days: DayPlan[];
  tips: string[];
};

const ARRANQUE: FitPhase = {
  id: 'arranque', name: 'Fase 1 · Arranque seguro', range: 'Obesidad II (IMC ≥ 35)', color: '#ef4444',
  focus: 'Bajo impacto: cuida tus articulaciones y crea el hábito. El objetivo es NO fallar ni un día.',
  frequency: '3-4 días + caminar a diario',
  days: [
    { key: 1, day: 'Lunes', focus: 'Caminata + movilidad', icon: '🚶', exercises: [
      { id: 'f-arr-1-1', name: 'Caminar (ritmo cómodo)', detail: '20-30 min' },
      { id: 'f-arr-1-2', name: 'Movilidad de cuello y hombros', detail: '5 min' },
      { id: 'f-arr-1-3', name: 'Sentadilla a la silla', detail: '2 × 8' },
      { id: 'f-arr-1-4', name: 'Elevación de talones', detail: '2 × 12' },
    ] },
    { key: 2, day: 'Martes', focus: 'Descanso activo', icon: '🧘', exercises: [
      { id: 'f-arr-2-1', name: 'Caminar suave', detail: '15 min' },
      { id: 'f-arr-2-2', name: 'Estiramientos suaves', detail: '10 min' },
    ] },
    { key: 3, day: 'Miércoles', focus: 'Fuerza guiada (máquinas/banda)', icon: '💪', exercises: [
      { id: 'f-arr-3-1', name: 'Press de pecho en máquina', detail: '2 × 12' },
      { id: 'f-arr-3-2', name: 'Remo en máquina', detail: '2 × 12' },
      { id: 'f-arr-3-3', name: 'Curl con banda elástica', detail: '2 × 12' },
    ] },
    { key: 4, day: 'Jueves', focus: 'Caminata', icon: '🚶', exercises: [
      { id: 'f-arr-4-1', name: 'Caminar (puedes subir el ritmo)', detail: '25 min' },
    ] },
    { key: 5, day: 'Viernes', focus: 'Core suave + glúteo', icon: '🔥', exercises: [
      { id: 'f-arr-5-1', name: 'Puente de glúteo', detail: '2 × 12' },
      { id: 'f-arr-5-2', name: 'Plancha de rodillas', detail: '3 × 20 s' },
      { id: 'f-arr-5-3', name: 'Sentadilla a la silla', detail: '2 × 10' },
    ] },
    { key: 6, day: 'Sábado', focus: 'Cardio cómodo', icon: '🚲', exercises: [
      { id: 'f-arr-6-1', name: 'Bici fija o caminata', detail: '25 min' },
    ] },
    { key: 0, day: 'Domingo', focus: 'Descanso y registro', icon: '📋', exercises: [
      { id: 'f-arr-0-1', name: 'Registrar tu peso', detail: '2 min' },
      { id: 'f-arr-0-2', name: 'Estiramiento + hidratación', detail: '10 min' },
    ] },
  ],
  tips: ['Empieza despacio: lo importante es la constancia, no la intensidad.', 'Camina todo lo que puedas y usa escaleras.', 'Si algo te duele en una articulación, baja el impacto.', 'Mucha agua, proteína y verduras; reduce azúcar y refrescos.'],
};

const BASE: FitPhase = {
  id: 'base', name: 'Fase 2 · Construyendo base', range: 'Obesidad I (IMC 30-35)', color: '#f59e0b',
  focus: 'Sumamos fuerza de cuerpo completo y un poco más de cardio. Vas agarrando condición.',
  frequency: '4 días + caminar',
  days: [
    { key: 1, day: 'Lunes', focus: 'Full-body A', icon: '💪', exercises: [
      { id: 'f-bas-1-1', name: 'Sentadilla goblet', detail: '3 × 10' },
      { id: 'f-bas-1-2', name: 'Press en máquina', detail: '3 × 12' },
      { id: 'f-bas-1-3', name: 'Remo en máquina', detail: '3 × 12' },
      { id: 'f-bas-1-4', name: 'Plancha', detail: '3 × 20 s' },
    ] },
    { key: 2, day: 'Martes', focus: 'Cardio + core', icon: '🔥', exercises: [
      { id: 'f-bas-2-1', name: 'Caminata rápida o bici', detail: '25 min' },
      { id: 'f-bas-2-2', name: 'Crunch abdominal', detail: '3 × 15' },
      { id: 'f-bas-2-3', name: 'Puente de glúteo', detail: '3 × 12' },
    ] },
    { key: 3, day: 'Miércoles', focus: 'Descanso activo', icon: '🧘', exercises: [
      { id: 'f-bas-3-1', name: 'Caminar', detail: '20 min' },
      { id: 'f-bas-3-2', name: 'Movilidad', detail: '10 min' },
    ] },
    { key: 4, day: 'Jueves', focus: 'Full-body B', icon: '🦵', exercises: [
      { id: 'f-bas-4-1', name: 'Prensa de pierna', detail: '3 × 12' },
      { id: 'f-bas-4-2', name: 'Jalón al pecho', detail: '3 × 12' },
      { id: 'f-bas-4-3', name: 'Press de hombro con mancuerna', detail: '3 × 12' },
      { id: 'f-bas-4-4', name: 'Elevación de talones', detail: '3 × 15' },
    ] },
    { key: 5, day: 'Viernes', focus: 'Cardio', icon: '🚲', exercises: [
      { id: 'f-bas-5-1', name: 'Bici o elíptica', detail: '30 min' },
    ] },
    { key: 6, day: 'Sábado', focus: 'Movilidad + caminata', icon: '🚶', exercises: [
      { id: 'f-bas-6-1', name: 'Caminar', detail: '30 min' },
      { id: 'f-bas-6-2', name: 'Estiramientos', detail: '10 min' },
    ] },
    { key: 0, day: 'Domingo', focus: 'Descanso y registro', icon: '📋', exercises: [
      { id: 'f-bas-0-1', name: 'Registrar peso y foto de progreso', detail: '5 min' },
    ] },
  ],
  tips: ['La constancia pesa más que la intensidad.', 'Sube el peso poco a poco cuando 12 reps se sientan fáciles.', 'Cardio cómodo: deberías poder hablar mientras lo haces.', 'Proteína en cada comida para no perder músculo.'],
};

const QUEMA: FitPhase = {
  id: 'quema', name: 'Fase 3 · Quema y fuerza', range: 'Sobrepeso (IMC 25-30)', color: '#22c55e',
  focus: 'Más fuerza y cardio para acelerar la pérdida de grasa. Ya estás fuerte para esto.',
  frequency: '4-5 días',
  days: [
    { key: 1, day: 'Lunes', focus: 'Torso', icon: '💪', exercises: [
      { id: 'f-que-1-1', name: 'Press de banca', detail: '4 × 10' },
      { id: 'f-que-1-2', name: 'Remo con barra', detail: '4 × 10' },
      { id: 'f-que-1-3', name: 'Press de hombro', detail: '3 × 12' },
      { id: 'f-que-1-4', name: 'Plancha', detail: '3 × 40 s' },
    ] },
    { key: 2, day: 'Martes', focus: 'Pierna', icon: '🦵', exercises: [
      { id: 'f-que-2-1', name: 'Sentadilla', detail: '4 × 10' },
      { id: 'f-que-2-2', name: 'Peso muerto rumano', detail: '3 × 10' },
      { id: 'f-que-2-3', name: 'Prensa', detail: '3 × 12' },
      { id: 'f-que-2-4', name: 'Elevación de gemelos', detail: '3 × 20' },
    ] },
    { key: 3, day: 'Miércoles', focus: 'HIIT + core', icon: '🔥', exercises: [
      { id: 'f-que-3-1', name: 'HIIT (30s fuerte / 30s suave)', detail: '15 min' },
      { id: 'f-que-3-2', name: 'Mountain climbers', detail: '4 × 30 s' },
      { id: 'f-que-3-3', name: 'Crunch', detail: '4 × 20' },
    ] },
    { key: 4, day: 'Jueves', focus: 'Torso/Pierna', icon: '⚡', exercises: [
      { id: 'f-que-4-1', name: 'Jalón al pecho', detail: '4 × 10' },
      { id: 'f-que-4-2', name: 'Zancadas', detail: '3 × 12' },
      { id: 'f-que-4-3', name: 'Curl de bíceps', detail: '3 × 12' },
      { id: 'f-que-4-4', name: 'Fondos de tríceps', detail: '3 × 12' },
    ] },
    { key: 5, day: 'Viernes', focus: 'Cardio moderado', icon: '🏃', exercises: [
      { id: 'f-que-5-1', name: 'Trote o bici', detail: '30 min' },
    ] },
    { key: 6, day: 'Sábado', focus: 'Caminata larga', icon: '🚶', exercises: [
      { id: 'f-que-6-1', name: 'Caminar', detail: '40 min' },
    ] },
    { key: 0, day: 'Domingo', focus: 'Descanso y registro', icon: '📋', exercises: [
      { id: 'f-que-0-1', name: 'Registrar peso', detail: '2 min' },
    ] },
  ],
  tips: ['Mantén un déficit calórico moderado (no pases hambre extrema).', 'El HIIT quema mucho en poco tiempo.', 'Duerme 7-8 h: es clave para perder grasa.', 'No bajes la proteína aunque comas menos.'],
};

const DEFINICION: FitPhase = {
  id: 'definicion', name: 'Fase 4 · Definición', range: 'Peso normal (IMC < 25)', color: '#3b82f6',
  focus: 'Marcar músculo y bajar el % de grasa. ¡Ya llegaste a un peso sano, ahora a definir!',
  frequency: '5 días',
  days: [
    { key: 1, day: 'Lunes', focus: 'Pecho / Tríceps', icon: '💪', exercises: [
      { id: 'f-def-1-1', name: 'Press de banca', detail: '4 × 8' },
      { id: 'f-def-1-2', name: 'Press inclinado', detail: '3 × 10' },
      { id: 'f-def-1-3', name: 'Aperturas', detail: '3 × 15' },
      { id: 'f-def-1-4', name: 'Fondos de tríceps', detail: '3 × 12' },
    ] },
    { key: 2, day: 'Martes', focus: 'Espalda / Bíceps', icon: '🏋️', exercises: [
      { id: 'f-def-2-1', name: 'Dominadas o jalón', detail: '4 × 8' },
      { id: 'f-def-2-2', name: 'Remo con barra', detail: '4 × 10' },
      { id: 'f-def-2-3', name: 'Curl con barra', detail: '3 × 12' },
      { id: 'f-def-2-4', name: 'Curl martillo', detail: '3 × 12' },
    ] },
    { key: 3, day: 'Miércoles', focus: 'Pierna', icon: '🦵', exercises: [
      { id: 'f-def-3-1', name: 'Sentadilla', detail: '4 × 8' },
      { id: 'f-def-3-2', name: 'Peso muerto rumano', detail: '4 × 10' },
      { id: 'f-def-3-3', name: 'Prensa', detail: '3 × 12' },
      { id: 'f-def-3-4', name: 'Gemelos', detail: '4 × 20' },
    ] },
    { key: 4, day: 'Jueves', focus: 'Hombro + HIIT', icon: '🔥', exercises: [
      { id: 'f-def-4-1', name: 'Press militar', detail: '4 × 10' },
      { id: 'f-def-4-2', name: 'Elevaciones laterales', detail: '4 × 15' },
      { id: 'f-def-4-3', name: 'HIIT', detail: '12 min' },
    ] },
    { key: 5, day: 'Viernes', focus: 'Full body + core', icon: '⚡', exercises: [
      { id: 'f-def-5-1', name: 'Peso muerto', detail: '4 × 6' },
      { id: 'f-def-5-2', name: 'Burpees', detail: '3 × 12' },
      { id: 'f-def-5-3', name: 'Plancha', detail: '4 × 45 s' },
      { id: 'f-def-5-4', name: 'Elevación de piernas', detail: '3 × 15' },
    ] },
    { key: 6, day: 'Sábado', focus: 'Cardio ligero', icon: '🚲', exercises: [
      { id: 'f-def-6-1', name: 'Bici o caminata', detail: '30 min' },
    ] },
    { key: 0, day: 'Domingo', focus: 'Descanso y registro', icon: '📋', exercises: [
      { id: 'f-def-0-1', name: 'Registrar peso y foto', detail: '5 min' },
    ] },
  ],
  tips: ['Prioriza la técnica y la sobrecarga progresiva.', 'Proteína alta (1.8-2 g/kg) para conservar músculo.', 'Combina fuerza + algo de HIIT para definir.', 'El descanso es cuando crece el músculo.'],
};

export const FIT_PHASES: FitPhase[] = [ARRANQUE, BASE, QUEMA, DEFINICION];

/** Elige la fase según el IMC. Sin datos → fase base (segura). */
export function phaseForBMI(imc?: number): FitPhase {
  if (imc == null || Number.isNaN(imc)) return BASE;
  if (imc >= 35) return ARRANQUE;
  if (imc >= 30) return BASE;
  if (imc >= 25) return QUEMA;
  return DEFINICION;
}
