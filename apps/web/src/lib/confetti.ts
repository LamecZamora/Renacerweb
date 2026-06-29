// Confetti ligero sin dependencias (Web Animations API).
export function confetti(count = 70) {
  if (typeof document === 'undefined') return;
  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#eab308', '#ec4899'];
  const root = document.createElement('div');
  root.className = 'no-print';
  root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden';
  document.body.appendChild(root);

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = 6 + Math.random() * 7;
    const color = colors[i % colors.length];
    p.style.cssText = `position:absolute;top:-12px;left:${Math.random() * 100}%;width:${size}px;height:${size * 0.55}px;background:${color};border-radius:2px;`;
    root.appendChild(p);
    const driftX = (Math.random() - 0.5) * 260;
    const rot = Math.random() * 900 - 450;
    const dur = 1800 + Math.random() * 1500;
    const delay = Math.random() * 250;
    p.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${driftX}px, ${window.innerHeight + 40}px) rotate(${rot}deg)`, opacity: 1, offset: 0.85 },
        { transform: `translate(${driftX}px, ${window.innerHeight + 80}px) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: dur, delay, easing: 'cubic-bezier(.18,.6,.38,1)', fill: 'forwards' },
    );
  }
  setTimeout(() => root.remove(), 3600);
}
