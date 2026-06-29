// Frases motivacionales cortas para cuando el usuario falla o se estresa.
export type Quote = { text: string; source: string };

export const QUOTES: Quote[] = [
  { text: 'No se trata de qué tan fuerte pegas, sino de cuánto aguantas sin dejar de avanzar.', source: 'Rocky Balboa' },
  { text: 'El éxito es ir de fracaso en fracaso sin perder el entusiasmo.', source: 'Winston Churchill' },
  { text: 'He fallado una y otra vez en mi vida, por eso he tenido éxito.', source: 'Michael Jordan' },
  { text: 'No he fracasado. Encontré 10,000 formas que no funcionan.', source: 'Thomas Edison' },
  { text: 'El que se cae siete veces, se levanta ocho.', source: 'Proverbio japonés' },
  { text: 'Lo que no te mata, te hace más fuerte.', source: 'Nietzsche' },
  { text: 'No cuentes los días; haz que los días cuenten.', source: 'Muhammad Ali' },
  { text: 'Hazlo o no lo hagas, pero no lo intentes.', source: 'Yoda' },
  { text: 'El fracaso es la oportunidad de empezar otra vez, con más inteligencia.', source: 'Henry Ford' },
  { text: 'Si puedes soñarlo, puedes lograrlo.', source: 'Walt Disney' },
  { text: 'Cada gran éxito tuvo muchos errores antes. Este es uno de los tuyos.', source: 'RENACER' },
  { text: 'Caer está permitido. Levantarse es obligatorio.', source: 'Anónimo' },
  { text: 'El dolor es temporal; rendirse es para siempre.', source: 'Lance Armstrong' },
  { text: 'Un error no te define. Lo que haces después, sí.', source: 'RENACER' },
  { text: 'Errar es de humanos; insistir, de campeones.', source: 'RENACER' },
  { text: 'Roma no se construyó en un día, pero trabajaron en ella cada día.', source: 'Proverbio' },
  { text: 'El que persevera, alcanza.', source: 'Refrán' },
  { text: 'Tú puedes con esto. Respira hondo y vuelve a intentarlo.', source: 'RENACER' },
  { text: 'La grandeza no se mide en victorias, sino en cuántas veces te levantas.', source: 'RENACER' },
  { text: 'Hoy te equivocaste; mañana sabes más que ayer.', source: 'RENACER' },
  { text: 'El único modo de fracasar de verdad es dejar de intentarlo.', source: 'Anónimo' },
  { text: 'Aunque sea despacio, sigue avanzando. Lo lento también llega.', source: 'RENACER' },
  { text: 'Los expertos también fueron principiantes que no se rindieron.', source: 'RENACER' },
  { text: 'No fallaste: descubriste una forma de mejorar. Otra vez.', source: 'RENACER' },
];

export function randomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
