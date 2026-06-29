import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Profile } from '../lib/storage';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.7, 0.3, 1] } } };

export default function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('Convertirme en desarrollador y emigrar a Canadá');
  const [startWeight, setStartWeight] = useState('');
  const [height, setHeight] = useState('');

  const submit = () => {
    if (!name.trim()) return;
    onDone({
      name: name.trim(),
      goal: goal.trim(),
      startWeight: startWeight ? Number(startWeight) : undefined,
      heightCm: height ? Number(height) : undefined,
      createdAt: new Date().toISOString(),
    });
  };

  const field = 'mt-1 w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition';

  return (
    <div className="app-atmosphere relative min-h-screen grid place-items-center bg-stone-50 dark:bg-ink-950 text-ink-900 dark:text-stone-100 font-sans p-6 overflow-hidden">
      {/* Blobs decorativos */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-ember/15 blur-3xl" />

      <motion.div
        variants={container} initial="hidden" animate="show"
        className="glass-card relative w-full max-w-md rounded-3xl border border-stone-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.045] backdrop-blur-xl p-8 shadow-glow"
      >
        <motion.div variants={item} className="mb-7 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-ink-950 font-display text-xl font-extrabold shadow-glow">
            R
          </span>
          <div className="leading-none">
            <p className="font-display text-2xl font-extrabold tracking-tight">RENACER</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-brand-600 dark:text-brand-400">De cero a Vancouver 🍁</p>
          </div>
        </motion.div>

        <motion.h1 variants={item} className="font-display text-[26px] font-extrabold leading-tight mb-1">
          Tu nueva vida<br />empieza hoy.
        </motion.h1>
        <motion.p variants={item} className="text-sm text-stone-500 dark:text-stone-400 mb-6">
          Crea tu cuenta. Tu progreso arranca en blanco y se construye contigo, día a día.
        </motion.p>

        <motion.label variants={item} className="block text-sm mb-3">
          <span className="text-stone-500 dark:text-stone-400 text-xs">¿Cómo te llamas?</span>
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Tu nombre" autoFocus className={field} />
        </motion.label>

        <motion.label variants={item} className="block text-sm mb-3">
          <span className="text-stone-500 dark:text-stone-400 text-xs">Tu objetivo principal</span>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} className={field} />
        </motion.label>

        <motion.div variants={item} className="grid grid-cols-2 gap-3 mb-6">
          <label className="block text-sm">
            <span className="text-stone-500 dark:text-stone-400 text-xs">Peso inicial (kg)</span>
            <input value={startWeight} onChange={(e) => setStartWeight(e.target.value)} type="number" placeholder="Ej. 82" className={field} />
          </label>
          <label className="block text-sm">
            <span className="text-stone-500 dark:text-stone-400 text-xs">Altura (cm)</span>
            <input value={height} onChange={(e) => setHeight(e.target.value)} type="number" placeholder="Ej. 178" className={field} />
          </label>
        </motion.div>

        <motion.button
          variants={item}
          onClick={submit}
          disabled={!name.trim()}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 text-sm font-bold text-ink-950 shadow-glow hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Empezar mi camino →
        </motion.button>
        <motion.p variants={item} className="mt-3 text-center text-[11px] text-stone-400">
          100% local y privado · tus datos viven solo en tu dispositivo
        </motion.p>
      </motion.div>
    </div>
  );
}
