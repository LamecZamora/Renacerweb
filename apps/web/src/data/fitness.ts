export type Exercise = { id: string; name: string; detail: string };
export type DayPlan = { key: number; day: string; focus: string; icon: string; exercises: Exercise[] };

// key: día de la semana JS (1=Lunes ... 0=Domingo)
export const WEEK: DayPlan[] = [
  {
    key: 1, day: 'Lunes', focus: 'Pecho y Espalda', icon: '🫀',
    exercises: [
      { id: 'mon-1', name: 'Press de banca', detail: '4 × 10' },
      { id: 'mon-2', name: 'Press inclinado con mancuernas', detail: '3 × 12' },
      { id: 'mon-3', name: 'Dominadas (o jalón al pecho)', detail: '4 × 8' },
      { id: 'mon-4', name: 'Remo con barra', detail: '4 × 10' },
      { id: 'mon-5', name: 'Aperturas en polea', detail: '3 × 15' },
    ],
  },
  {
    key: 2, day: 'Martes', focus: 'Pierna', icon: '🦵',
    exercises: [
      { id: 'tue-1', name: 'Sentadilla con barra', detail: '4 × 8' },
      { id: 'tue-2', name: 'Prensa de pierna', detail: '4 × 12' },
      { id: 'tue-3', name: 'Peso muerto rumano', detail: '3 × 10' },
      { id: 'tue-4', name: 'Extensión de cuádriceps', detail: '3 × 15' },
      { id: 'tue-5', name: 'Elevación de gemelos', detail: '4 × 20' },
    ],
  },
  {
    key: 3, day: 'Miércoles', focus: 'Hombro y Brazos', icon: '💪',
    exercises: [
      { id: 'wed-1', name: 'Press militar', detail: '4 × 10' },
      { id: 'wed-2', name: 'Elevaciones laterales', detail: '4 × 15' },
      { id: 'wed-3', name: 'Curl de bíceps con barra', detail: '3 × 12' },
      { id: 'wed-4', name: 'Fondos de tríceps', detail: '3 × 12' },
      { id: 'wed-5', name: 'Curl martillo', detail: '3 × 12' },
    ],
  },
  {
    key: 4, day: 'Jueves', focus: 'Cardio y Abdomen', icon: '🔥',
    exercises: [
      { id: 'thu-1', name: 'Carrera continua', detail: '25 min' },
      { id: 'thu-2', name: 'Plancha', detail: '4 × 45 s' },
      { id: 'thu-3', name: 'Crunch abdominal', detail: '4 × 20' },
      { id: 'thu-4', name: 'Mountain climbers', detail: '4 × 30 s' },
      { id: 'thu-5', name: 'Elevación de piernas', detail: '3 × 15' },
    ],
  },
  {
    key: 5, day: 'Viernes', focus: 'Full Body', icon: '⚡',
    exercises: [
      { id: 'fri-1', name: 'Peso muerto', detail: '4 × 6' },
      { id: 'fri-2', name: 'Sentadilla goblet', detail: '3 × 12' },
      { id: 'fri-3', name: 'Press de banca', detail: '3 × 10' },
      { id: 'fri-4', name: 'Remo en máquina', detail: '3 × 12' },
      { id: 'fri-5', name: 'Burpees', detail: '3 × 12' },
    ],
  },
  {
    key: 6, day: 'Sábado', focus: 'Cardio adicional', icon: '🏃',
    exercises: [
      { id: 'sat-1', name: 'Bicicleta / elíptica', detail: '30 min' },
      { id: 'sat-2', name: 'Caminata inclinada', detail: '20 min' },
      { id: 'sat-3', name: 'Estiramientos', detail: '10 min' },
    ],
  },
  {
    key: 0, day: 'Domingo', focus: 'Seguimiento y descanso', icon: '📋',
    exercises: [
      { id: 'sun-1', name: 'Registrar peso y medidas', detail: '5 min' },
      { id: 'sun-2', name: 'Foto de progreso', detail: '—' },
      { id: 'sun-3', name: 'Movilidad / yoga ligero', detail: '15 min' },
    ],
  },
];

export const FITNESS_TOTAL = WEEK.reduce((n, d) => n + d.exercises.length, 0);
