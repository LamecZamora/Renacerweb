import type { DayPlan } from './fitness';

// Plan de entrenamiento por fases según el IMC. La ESTRUCTURA del split es la misma
// (Lun/Jue espalda+tríceps · Mar/Vie trapecios/pecho/bíceps/antebrazo · Mié pierna+glúteo ·
// Sáb cardio · Dom descanso); lo que cambia con el peso es la intensidad y los ejercicios:
// bajo impacto (obesidad) → peso libre pesado (definición).
export type FitPhase = {
  id: string;
  name: string;
  range: string;
  color: string;
  focus: string;
  frequency: string;
  days: DayPlan[];
  tips: string[];
};

// Focos fijos del split (los lee el mapa muscular para resaltar los músculos del día).
const F = {
  pull: 'Espalda y Tríceps',
  push: 'Trapecios, Pecho, Bíceps y Antebrazo',
  legs: 'Pierna y Glúteo',
  cardio: 'Cardio',
  rest: 'Descanso',
};

// Construye la semana con el split fijo a partir de los ejercicios de cada grupo.
function week(p: string, ex: { pull: DayPlan['exercises']; push: DayPlan['exercises']; legs: DayPlan['exercises']; cardio: DayPlan['exercises'] }): DayPlan[] {
  const tag = (arr: DayPlan['exercises'], d: number) => arr.map((e, i) => ({ ...e, id: `f-${p}-${d}-${i + 1}` }));
  return [
    { key: 1, day: 'Lunes', focus: F.pull, icon: '🔙', exercises: tag(ex.pull, 1) },
    { key: 2, day: 'Martes', focus: F.push, icon: '💪', exercises: tag(ex.push, 2) },
    { key: 3, day: 'Miércoles', focus: F.legs, icon: '🦵', exercises: tag(ex.legs, 3) },
    { key: 4, day: 'Jueves', focus: F.pull, icon: '🔙', exercises: tag(ex.pull, 4) },
    { key: 5, day: 'Viernes', focus: F.push, icon: '💪', exercises: tag(ex.push, 5) },
    { key: 6, day: 'Sábado', focus: F.cardio, icon: '🏃', exercises: tag(ex.cardio, 6) },
    { key: 0, day: 'Domingo', focus: F.rest, icon: '📋', exercises: tag([{ id: '', name: 'Registrar peso y estirar', detail: '10 min' }], 0) },
  ];
}

const ARRANQUE: FitPhase = {
  id: 'arranque', name: 'Fase 1 · Arranque seguro', range: 'Obesidad II (IMC ≥ 35)', color: '#ef4444',
  focus: 'Mismo split, pero en máquinas/bandas y bajo impacto: cuida articulaciones y crea el hábito.',
  frequency: 'Lun-Vie (fuerza guiada) + Sáb cardio',
  days: week('arr', {
    pull: [
      { id: '', name: 'Jalón dorsal (máquina)', detail: '2 × 12' },
      { id: '', name: 'Remo en máquina', detail: '2 × 12' },
      { id: '', name: 'Extensión de tríceps con banda', detail: '2 × 15' },
    ],
    push: [
      { id: '', name: 'Press de pecho en máquina', detail: '2 × 12' },
      { id: '', name: 'Encogimiento de hombros ligero (trapecios)', detail: '2 × 15' },
      { id: '', name: 'Curl de bíceps con banda', detail: '2 × 12' },
      { id: '', name: 'Curl de muñeca (antebrazo)', detail: '2 × 15' },
    ],
    legs: [
      { id: '', name: 'Prensa de pierna ligera', detail: '2 × 12' },
      { id: '', name: 'Puente de glúteo', detail: '2 × 15' },
      { id: '', name: 'Sentadilla a la silla', detail: '2 × 10' },
      { id: '', name: 'Elevación de talones (pantorrilla)', detail: '2 × 15' },
    ],
    cardio: [{ id: '', name: 'Caminata o bici cómoda', detail: '45-60 min' }],
  }),
  tips: ['Empieza despacio: la constancia pesa más que la intensidad.', 'Camina todo lo que puedas y usa escaleras.', 'Si una articulación duele, baja el impacto.', 'Mucha agua, proteína y verduras; menos azúcar.'],
};

const BASE: FitPhase = {
  id: 'base', name: 'Fase 2 · Construyendo base', range: 'Obesidad I (IMC 30-35)', color: '#f59e0b',
  focus: 'Mismo split con algo más de carga (máquinas + mancuernas). Vas agarrando condición.',
  frequency: 'Lun-Vie (fuerza) + Sáb cardio',
  days: week('bas', {
    pull: [
      { id: '', name: 'Jalón dorsal', detail: '3 × 12' },
      { id: '', name: 'Remo en máquina', detail: '3 × 12' },
      { id: '', name: 'Fondos de tríceps asistidos', detail: '3 × 10' },
    ],
    push: [
      { id: '', name: 'Press de pecho (máquina o mancuerna)', detail: '3 × 12' },
      { id: '', name: 'Encogimiento de hombros (trapecios)', detail: '3 × 12' },
      { id: '', name: 'Curl de bíceps con mancuerna', detail: '3 × 12' },
      { id: '', name: 'Curl de muñeca (antebrazo)', detail: '3 × 15' },
    ],
    legs: [
      { id: '', name: 'Prensa de pierna', detail: '3 × 12' },
      { id: '', name: 'Peso muerto rumano ligero (femoral)', detail: '3 × 10' },
      { id: '', name: 'Puente de glúteo', detail: '3 × 12' },
      { id: '', name: 'Elevación de talones (pantorrilla)', detail: '3 × 15' },
    ],
    cardio: [{ id: '', name: 'Caminata rápida o bici', detail: '50 min' }],
  }),
  tips: ['Sube el peso cuando 12 reps se sientan fáciles.', 'Cuida la técnica antes que la carga.', 'Proteína en cada comida para no perder músculo.', 'Duerme 7-8 h: ahí crece el músculo.'],
};

const QUEMA: FitPhase = {
  id: 'quema', name: 'Fase 3 · Quema y fuerza', range: 'Sobrepeso (IMC 25-30)', color: '#22c55e',
  focus: 'Mismo split con peso libre y más intensidad para acelerar la pérdida de grasa.',
  frequency: 'Lun-Vie (fuerza) + Sáb cardio',
  days: week('que', {
    pull: [
      { id: '', name: 'Dominadas asistidas o jalón', detail: '4 × 10' },
      { id: '', name: 'Remo con barra', detail: '4 × 10' },
      { id: '', name: 'Fondos de tríceps', detail: '3 × 12' },
    ],
    push: [
      { id: '', name: 'Press de banca', detail: '4 × 10' },
      { id: '', name: 'Encogimiento con mancuernas (trapecios)', detail: '3 × 15' },
      { id: '', name: 'Curl con barra', detail: '3 × 12' },
      { id: '', name: 'Curl martillo (antebrazo)', detail: '3 × 12' },
    ],
    legs: [
      { id: '', name: 'Sentadilla', detail: '4 × 10' },
      { id: '', name: 'Peso muerto rumano (femoral)', detail: '3 × 10' },
      { id: '', name: 'Zancadas (glúteo)', detail: '3 × 12' },
      { id: '', name: 'Elevación de gemelos (pantorrilla)', detail: '3 × 20' },
    ],
    cardio: [{ id: '', name: 'Trote o bici', detail: '1 hora' }],
  }),
  tips: ['Déficit calórico moderado (sin pasar hambre extrema).', 'El peso libre quema más y activa más músculo.', 'No bajes la proteína aunque comas menos.', 'Duerme bien: es clave para perder grasa.'],
};

const DEFINICION: FitPhase = {
  id: 'definicion', name: 'Fase 4 · Definición', range: 'Peso normal (IMC < 25)', color: '#3b82f6',
  focus: 'Mismo split en modo hipertrofia: peso libre pesado para marcar músculo.',
  frequency: 'Lun-Vie (fuerza) + Sáb cardio ligero',
  days: week('def', {
    pull: [
      { id: '', name: 'Dominadas', detail: '4 × 8' },
      { id: '', name: 'Remo con barra', detail: '4 × 10' },
      { id: '', name: 'Jalón dorsal', detail: '3 × 12' },
      { id: '', name: 'Fondos de tríceps', detail: '4 × 10' },
      { id: '', name: 'Extensión de tríceps en polea', detail: '3 × 12' },
    ],
    push: [
      { id: '', name: 'Press de banca', detail: '4 × 8' },
      { id: '', name: 'Press inclinado', detail: '3 × 10' },
      { id: '', name: 'Encogimiento con barra (trapecios)', detail: '4 × 15' },
      { id: '', name: 'Curl con barra', detail: '4 × 10' },
      { id: '', name: 'Curl martillo (antebrazo)', detail: '3 × 12' },
    ],
    legs: [
      { id: '', name: 'Sentadilla', detail: '4 × 8' },
      { id: '', name: 'Peso muerto rumano (femoral)', detail: '4 × 10' },
      { id: '', name: 'Prensa de pierna', detail: '3 × 12' },
      { id: '', name: 'Hip thrust (glúteo)', detail: '3 × 12' },
      { id: '', name: 'Elevación de gemelos (pantorrilla)', detail: '4 × 20' },
    ],
    cardio: [{ id: '', name: 'Cardio ligero (bici o caminata)', detail: '45-60 min' }],
  }),
  tips: ['Prioriza técnica y sobrecarga progresiva.', 'Proteína alta (1.8-2 g/kg) para conservar músculo.', 'Combina fuerza + algo de cardio para definir.', 'El descanso es cuando crece el músculo.'],
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
