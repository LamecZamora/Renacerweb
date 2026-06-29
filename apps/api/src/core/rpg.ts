// Core IA — Motor RPG.
// NO reimplementa nada: re-exporta el motor existente (modules/rpg) para que el
// resto de Core IA lo consuma desde un único punto, sin mover ni modificar el original.
export { awardXp, getStats, levelFromXp, xpForLevel } from '../modules/rpg/rpg.service.js';
