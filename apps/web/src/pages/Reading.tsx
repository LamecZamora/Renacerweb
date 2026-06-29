import { useState } from 'react';
import { Card, Stat, PageHeader, Progress, Badge } from '../components/ui';
import { useLocalList, uid } from '../lib/storage';
import { GENRES, type BookRec } from '../data/books';
import { toast } from '../lib/toast';

type Book = { id: string; title: string; author: string; totalPages: number; pagesRead: number };

export default function Reading() {
  const { items, add, update, remove } = useLocalList<Book>('books');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [genre, setGenre] = useState(() => localStorage.getItem('renacer_book_genre') || 'desarrollo');

  const pickGenre = (id: string) => { setGenre(id); localStorage.setItem('renacer_book_genre', id); };
  const currentGenre = GENRES.find((g) => g.id === genre) ?? GENRES[0];
  const addBook = () => {
    if (!title.trim()) return;
    add({ id: uid(), title: title.trim(), author: author.trim(), totalPages: Number(pages) || 0, pagesRead: 0 });
    setTitle(''); setAuthor(''); setPages('');
  };
  const addRec = (b: BookRec) => {
    if (items.some((x) => x.title.toLowerCase() === b.title.toLowerCase())) { toast('Ya está en tu biblioteca'); return; }
    add({ id: uid(), title: b.title, author: b.author, totalPages: b.pages, pagesRead: 0 });
    toast(`📖 Añadido: ${b.title}`);
  };

  const logPages = (b: Book, n: number) => {
    const next = Math.max(0, Math.min(b.totalPages || Infinity, b.pagesRead + n));
    update(b.id, { pagesRead: next });
  };

  const totalRead = items.reduce((s, b) => s + b.pagesRead, 0);
  const finished = items.filter((b) => b.totalPages && b.pagesRead >= b.totalPages).length;

  return (
    <>
      <PageHeader title="Lectura" subtitle="Registra tus libros y el avance de páginas." icon="❖" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Páginas leídas" value={`${totalRead}`} />
        <Stat label="Libros activos" value={`${items.length - finished}`} />
        <Stat label="Terminados" value={`${finished}`} />
        <Stat label="En tu biblioteca" value={`${items.length}`} />
      </div>

      {/* Recomendaciones por género */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span>📚</span><h3 className="font-bold">¿Qué te gusta leer?</h3></div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Elige un género y te recomiendo 3 libros. Toca "+ Añadir" para mandarlos a tu biblioteca.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {GENRES.map((g) => (
            <button key={g.id} onClick={() => pickGenre(g.id)}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${genre === g.id ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
              {g.emoji} {g.name}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {currentGenre.books.map((b) => {
            const added = items.some((x) => x.title.toLowerCase() === b.title.toLowerCase());
            return (
              <div key={b.title} className="rounded-xl border border-stone-200/70 dark:border-white/10 p-3 flex flex-col">
                <h4 className="font-bold text-sm leading-tight">{b.title}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">{b.author} · {b.pages} pág.</p>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1.5 flex-1">{b.why}</p>
                {added
                  ? <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">✓ En tu biblioteca</p>
                  : <button onClick={() => addRec(b)} className="mt-2 rounded-lg bg-brand-500/15 text-brand-700 dark:text-brand-400 py-1.5 text-xs font-semibold">+ Añadir</button>}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="font-bold mb-3">Añadir libro manualmente</h3>
        <div className="grid sm:grid-cols-4 gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="sm:col-span-2 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Autor" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <input value={pages} onChange={(e) => setPages(e.target.value)} type="number" placeholder="Páginas" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <button onClick={addBook} className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">+ Añadir</button>
      </Card>

      {items.length === 0 ? (
        <Card><p className="text-sm text-stone-500">Tu biblioteca está vacía. Añade tu primer libro arriba.</p></Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {items.map((b) => {
            const pct = b.totalPages ? Math.round((b.pagesRead / b.totalPages) * 100) : 0;
            const done = b.totalPages > 0 && b.pagesRead >= b.totalPages;
            return (
              <Card key={b.id}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{b.title}</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{b.author || 'Autor desconocido'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {done ? <Badge tone="green">Terminado</Badge> : <Badge tone="amber">{pct}%</Badge>}
                    <button onClick={() => remove(b.id)} className="text-xs text-stone-400 hover:text-red-500">✕</button>
                  </div>
                </div>
                <Progress value={b.pagesRead} max={b.totalPages || 1} className="mb-2" />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-500">{b.pagesRead}{b.totalPages ? ` / ${b.totalPages}` : ''} páginas</p>
                  <div className="flex gap-1">
                    <button onClick={() => logPages(b, -10)} className="rounded-lg border border-stone-200 dark:border-white/10 px-2 py-1 text-xs">−10</button>
                    <button onClick={() => logPages(b, 10)} className="rounded-lg bg-brand-500/15 text-brand-700 dark:text-brand-400 px-2 py-1 text-xs font-semibold">+10</button>
                    <button onClick={() => logPages(b, 25)} className="rounded-lg bg-brand-500/15 text-brand-700 dark:text-brand-400 px-2 py-1 text-xs font-semibold">+25</button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
