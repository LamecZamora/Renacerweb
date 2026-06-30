import { m } from 'framer-motion';

export function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`glass-card rounded-2xl border border-stone-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.035] backdrop-blur-md p-5 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-extrabold leading-none text-ink-900 dark:text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{sub}</p>}
    </Card>
  );
}

export function PageHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: string }) {
  return (
    <div className="mb-7 flex items-start gap-3.5">
      {icon && (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-400/25 to-brand-600/10 ring-1 ring-brand-500/25 text-2xl shadow-sm">
          {icon}
        </span>
      )}
      <div className="pt-0.5">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Progress({ value, max, className = '' }: { value: number; max: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`h-2 rounded-full bg-stone-200/80 dark:bg-white/[0.08] overflow-hidden ${className}`}>
      <m.div
        className="h-full rounded-full bg-gradient-to-r from-brand-400 via-ember to-brand-600 shadow-[0_0_12px_-2px_rgba(245,158,11,0.6)]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.3, 1] }}
      />
    </div>
  );
}

export function Badge({ children, tone = 'brand' }: { children: React.ReactNode; tone?: 'brand' | 'green' | 'amber' | 'slate' }) {
  const tones = {
    brand: 'bg-brand-500/15 text-brand-700 dark:text-brand-400 ring-brand-500/20',
    green: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
    amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-500 ring-amber-500/20',
    slate: 'bg-stone-500/15 text-stone-600 dark:text-stone-300 ring-stone-500/20',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

/** Bloque de carga con shimmer. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}
