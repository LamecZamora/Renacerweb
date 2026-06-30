import { useEffect, useRef, useState } from 'react';
import { m as M } from 'framer-motion';
import { Card, PageHeader, Badge } from '../components/ui';
import { useLocalList, uid, readList } from '../lib/storage';
import { chatWithCharacter, getKey, setKey, getModel, setModel, MODELS, hasKey, type ChatMsg } from '../lib/llm';
import { useSpeechRecognition, speak, stopSpeaking } from '../lib/speech';
import { PRESETS, type Character } from '../data/characters';

function Chat({ character, onBack }: { character: Character; onBack: () => void }) {
  const ns = `chat_${character.id}`;
  const lang = character.lang ?? 'es-ES';
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => {
    const saved = readList<ChatMsg>(ns);
    return saved.length ? saved : [{ role: 'assistant', content: character.greeting }];
  });
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { supported: micOk, listening, listen } = useSpeechRecognition(lang);

  useEffect(() => {
    localStorage.setItem(`renacer_list_${ns}`, JSON.stringify(msgs));
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, ns]);

  useEffect(() => () => stopSpeaking(), []); // detener voz al salir

  const send = async (textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!text || busy) return;
    const next: ChatMsg[] = [...msgs, { role: 'user', content: text }];
    setMsgs(next);
    setInput('');
    setBusy(true);
    const reply = await chatWithCharacter(character.persona, next);
    setMsgs((m) => [...m, { role: 'assistant', content: reply }]);
    if (voiceOn) speak(reply, lang);
    setBusy(false);
  };

  const dictate = () => listen((alts) => { const t = alts[0] ?? ''; if (t) void send(t); });

  const reset = () => { stopSpeaking(); setMsgs([{ role: 'assistant', content: character.greeting }]); };
  const back = () => { stopSpeaking(); onBack(); };

  return (
    <Card className="flex flex-col h-[70vh] p-0 overflow-hidden">
      <div className="flex items-center gap-3 border-b border-stone-200/70 dark:border-white/10 p-3" style={{ background: `${character.color}14` }}>
        <button onClick={back} className="text-stone-500 hover:text-stone-800 dark:hover:text-white">←</button>
        <span className="grid h-10 w-10 place-items-center rounded-xl text-2xl" style={{ background: `${character.color}22` }}>{character.emoji}</span>
        <div className="flex-1">
          <p className="font-bold leading-tight">{character.name}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">{character.tagline}</p>
        </div>
        <button
          onClick={() => { if (voiceOn) stopSpeaking(); setVoiceOn((v) => !v); }}
          className={`rounded-lg px-2 py-1 text-xs font-semibold ${voiceOn ? 'bg-brand-500/20 text-brand-700 dark:text-brand-400' : 'text-stone-400 hover:text-stone-700 dark:hover:text-white'}`}
          title="Leer respuestas en voz alta"
        >
          {voiceOn ? '🔊 Voz' : '🔈 Voz'}
        </button>
        <button onClick={reset} className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-white">↺</button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <M.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
              m.role === 'user' ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/70 dark:bg-white/10'
            }`}>
              {m.content}
              {m.role === 'assistant' && i > 0 && (
                <button onClick={() => speak(m.content, lang)} className="ml-2 text-xs opacity-60 hover:opacity-100" title="Escuchar">🔊</button>
              )}
            </div>
          </M.div>
        ))}
        {busy && <p className="text-xs text-stone-400">{character.name} está escribiendo…</p>}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 border-t border-stone-200/70 dark:border-white/10 p-3">
        <button
          onClick={dictate}
          disabled={!micOk || busy}
          title={micOk ? 'Hablar' : 'Tu navegador no soporta micrófono'}
          className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
            listening ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-200/70 dark:bg-white/10 hover:bg-stone-300/70'
          } disabled:opacity-40`}
        >
          {listening ? '🎙' : '🎤'}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={`Escríbele a ${character.name}…`}
          className="flex-1 rounded-xl border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button onClick={() => send()} disabled={busy} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95 disabled:opacity-50">Enviar</button>
      </div>
    </Card>
  );
}

export default function Characters() {
  const { items: custom, add, remove } = useLocalList<Character>('characters');
  const [openId, setOpenId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(!hasKey());
  const [keyInput, setKeyInput] = useState(getKey());
  const [model, setModelState] = useState(getModel());
  const [creating, setCreating] = useState(false);

  // form crear
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [tagline, setTagline] = useState('');
  const [persona, setPersona] = useState('');

  const all = [...PRESETS, ...custom].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const open = all.find((c) => c.id === openId);

  const create = () => {
    if (!name.trim() || !persona.trim()) return;
    add({
      id: uid(), name: name.trim(), emoji: emoji.trim() || '✨', tagline: tagline.trim() || 'Personaje propio', color: '#f59e0b',
      persona: persona.trim(),
      greeting: `Hola, soy ${name.trim()}. ¿De qué hablamos?`,
    });
    setName(''); setTagline(''); setPersona(''); setEmoji('✨'); setCreating(false);
  };

  if (open) return (
    <>
      <PageHeader title={open.name} subtitle={open.tagline} icon={open.emoji} />
      <Chat character={open} onBack={() => setOpenId(null)} />
    </>
  );

  return (
    <>
      <PageHeader title="Personajes" subtitle="Habla con quien quieras. Elige un personaje o crea el tuyo." icon="🎭" />

      {/* Configuración API key */}
      <Card className="mb-6">
        <button onClick={() => setShowSettings((s) => !s)} className="flex items-center justify-between w-full">
          <h3 className="font-bold">⚙️ Conexión con la IA</h3>
          <Badge tone={hasKey() ? 'green' : 'amber'}>{hasKey() ? 'Conectado' : 'Sin API key (modo demo)'}</Badge>
        </button>
        {showSettings && (
          <div className="mt-3 space-y-3">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Pega tu API key de Anthropic (<code>sk-ant-…</code>). Se guarda <b>solo en este navegador</b> y se usa para que los personajes respondan de verdad.
            </p>
            <div className="grid sm:grid-cols-3 gap-2">
              <input
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                type="password"
                placeholder="sk-ant-..."
                className="sm:col-span-2 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <select value={model} onChange={(e) => { setModelState(e.target.value); setModel(e.target.value); }}
                className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <button onClick={() => { setKey(keyInput.trim()); setShowSettings(false); }}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">Guardar</button>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-bold">Elige un personaje</h3>
        <button onClick={() => setCreating((c) => !c)} className="rounded-lg bg-brand-500/15 text-brand-700 dark:text-brand-400 px-3 py-1.5 text-sm font-semibold">
          {creating ? 'Cancelar' : '+ Crear personaje'}
        </button>
      </div>

      {creating && (
        <Card className="mb-4">
          <div className="grid sm:grid-cols-4 gap-2 mb-2">
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="Emoji" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Descripción corta" className="sm:col-span-2 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <textarea value={persona} onChange={(e) => setPersona(e.target.value)} placeholder="Personalidad: ¿quién es, cómo habla, qué hace? Ej: 'Eres un detective sarcástico que habla en español…'"
            className="w-full h-24 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <button onClick={create} className="mt-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">Crear y guardar</button>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {all.map((c) => (
          <button key={c.id} onClick={() => setOpenId(c.id)} className="text-left">
            <Card className={`h-full hover:ring-2 hover:ring-brand-500/40 transition ${c.featured ? 'ring-1 ring-brand-500/40' : ''}`}>
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl text-3xl" style={{ background: `${c.color}22` }}>{c.emoji}</span>
                {c.featured ? <Badge tone="brand">⭐ Recomendado</Badge> : !c.preset && (
                  <span onClick={(e) => { e.stopPropagation(); remove(c.id); }} className="text-xs text-stone-400 hover:text-red-500">✕</span>
                )}
              </div>
              <h4 className="font-bold mt-2">{c.name}</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">{c.tagline}</p>
              <p className="mt-3 text-xs font-semibold text-brand-600 dark:text-brand-400">Hablar →</p>
            </Card>
          </button>
        ))}
      </div>
    </>
  );
}
