// Recomendaciones de libros por género (para sugerir según los gustos del usuario).
export type BookRec = { title: string; author: string; pages: number; why: string };
export type Genre = { id: string; name: string; emoji: string; books: BookRec[] };

export const GENRES: Genre[] = [
  { id: 'comedia', name: 'Comedia', emoji: '😂', books: [
    { title: 'Buenos presagios', author: 'T. Pratchett & N. Gaiman', pages: 400, why: 'El fin del mundo… con un ángel y un demonio que no quieren que pase. Genial.' },
    { title: 'La conjura de los necios', author: 'John Kennedy Toole', pages: 400, why: 'Un personaje absurdo e inolvidable; comedia de culto.' },
    { title: 'Tres hombres en una barca', author: 'Jerome K. Jerome', pages: 200, why: 'Humor inglés clásico, ligero y divertidísimo.' },
  ] },
  { id: 'accion', name: 'Acción / Aventura', emoji: '⚔️', books: [
    { title: 'El conde de Montecristo', author: 'Alexandre Dumas', pages: 1200, why: 'Venganza, fugas y giros: la aventura definitiva.' },
    { title: 'La isla del tesoro', author: 'R. L. Stevenson', pages: 250, why: 'Piratas, mapas y tesoros. Corto y adictivo.' },
    { title: 'Los juegos del hambre', author: 'Suzanne Collins', pages: 380, why: 'Acción sin parar y difícil de soltar.' },
  ] },
  { id: 'scifi', name: 'Ciencia ficción', emoji: '🚀', books: [
    { title: 'Fundación', author: 'Isaac Asimov', pages: 250, why: 'La caída de un imperio galáctico. Un clásico imprescindible.' },
    { title: 'El problema de los tres cuerpos', author: 'Liu Cixin', pages: 400, why: 'Ciencia dura y misterio cósmico que te vuela la cabeza.' },
    { title: 'Dune', author: 'Frank Herbert', pages: 700, why: 'Política, desierto y poder. La obra maestra del género.' },
  ] },
  { id: 'desarrollo', name: 'Desarrollo personal', emoji: '🌱', books: [
    { title: 'Hábitos atómicos', author: 'James Clear', pages: 320, why: 'Cómo construir hábitos 1% mejores cada día. Perfecto para RENACER.' },
    { title: 'Los 7 hábitos de la gente altamente efectiva', author: 'Stephen Covey', pages: 380, why: 'Principios atemporales de efectividad personal.' },
    { title: 'El poder del ahora', author: 'Eckhart Tolle', pages: 240, why: 'Para la estabilidad emocional y vivir el presente.' },
  ] },
  { id: 'negocios', name: 'Negocios / Finanzas', emoji: '💼', books: [
    { title: 'Padre rico, padre pobre', author: 'Robert Kiyosaki', pages: 240, why: 'Cambia tu forma de pensar sobre el dinero.' },
    { title: 'El hombre más rico de Babilonia', author: 'George S. Clason', pages: 150, why: 'Finanzas personales en parábolas simples. Corto y poderoso.' },
    { title: 'Piense y hágase rico', author: 'Napoleon Hill', pages: 250, why: 'Mentalidad de éxito, un clásico de motivación.' },
  ] },
  { id: 'tech', name: 'Programación / Tech', emoji: '💻', books: [
    { title: 'El programador pragmático', author: 'Hunt & Thomas', pages: 350, why: 'El libro que todo dev debería leer. Te hace mejor profesional.' },
    { title: 'Clean Code', author: 'Robert C. Martin', pages: 460, why: 'Escribe código limpio y mantenible. Imprescindible para tu carrera.' },
    { title: 'Cracking the Coding Interview', author: 'Gayle L. McDowell', pages: 700, why: 'La biblia para pasar entrevistas técnicas (Vancouver/Tokyo).' },
  ] },
  { id: 'misterio', name: 'Misterio / Thriller', emoji: '🕵️', books: [
    { title: 'Y no quedó ninguno', author: 'Agatha Christie', pages: 250, why: 'El misterio perfecto. No lo sueltas hasta el final.' },
    { title: 'El código Da Vinci', author: 'Dan Brown', pages: 600, why: 'Acertijos, arte y conspiración a ritmo trepidante.' },
    { title: 'La chica del tren', author: 'Paula Hawkins', pages: 400, why: 'Thriller psicológico lleno de giros.' },
  ] },
  { id: 'fantasia', name: 'Fantasía', emoji: '🐉', books: [
    { title: 'El Hobbit', author: 'J. R. R. Tolkien', pages: 310, why: 'La puerta de entrada a la fantasía. Aventura encantadora.' },
    { title: 'El nombre del viento', author: 'Patrick Rothfuss', pages: 660, why: 'Prosa hermosa y un héroe inolvidable.' },
    { title: 'Harry Potter y la piedra filosofal', author: 'J. K. Rowling', pages: 250, why: 'Magia para empezar a leer con ganas.' },
  ] },
];
