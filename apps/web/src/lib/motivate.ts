import { randomQuote } from '../data/quotes';

// Lanza una frase motivacional (cuando el usuario falla o se estresa).
// Evita repetir frase seguida.
let last = '';

export function motivate() {
  let q = randomQuote();
  for (let i = 0; i < 4 && q.text === last; i++) q = randomQuote();
  last = q.text;
  window.dispatchEvent(new CustomEvent('motivate', { detail: q }));
}
