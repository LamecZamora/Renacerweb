// Ejecuta código Lua real en el navegador (Lua 5.4 vía wasmoon, cargado bajo demanda).
// Sirve para practicar la LÓGICA de Lua (variables, tablas, funciones, bucles, print).
// Las APIs de Roblox (workspace, Instance, game…) solo existen en Roblox Studio.

function fmt(a: unknown): string {
  if (a === null || a === undefined) return 'nil';
  if (typeof a === 'object') { try { return JSON.stringify(a); } catch { return String(a); } }
  return String(a);
}

// Cacheamos la fábrica (carga del WASM) una sola vez: las ejecuciones siguientes son rápidas,
// clave para un proyecto extenso donde corres código muchas veces.
let _factory: Promise<import('wasmoon').LuaFactory> | null = null;
function getFactory() {
  if (!_factory) {
    _factory = (async () => {
      const { LuaFactory } = await import('wasmoon');
      // @ts-expect-error: import del .wasm como URL (resuelto por Vite)
      const wasmUrl = (await import('wasmoon/dist/glue.wasm?url')).default as string;
      return new LuaFactory(wasmUrl);
    })();
  }
  return _factory;
}

export async function runLua(code: string): Promise<string> {
  const factory = await getFactory();
  const lua = await factory.createEngine();

  const logs: string[] = [];
  lua.global.set('print', (...args: unknown[]) => { logs.push(args.map((a) => fmt(a)).join('\t')); });
  lua.global.set('warn', (...args: unknown[]) => { logs.push('⚠ ' + args.map((a) => fmt(a)).join('\t')); });
  lua.global.set('wait', () => {});

  let err = '';
  try {
    // Stubs útiles para que más ejemplos corran (task.wait no hace nada aquí).
    await lua.doString('task = task or {}; function task.wait() end');
    await lua.doString(code);
  } catch (e) {
    err = (e instanceof Error ? e.message : String(e)).replace(/^\[string "[^"]*"\]:/, 'línea ');
  } finally {
    try { lua.global.close(); } catch { /* noop */ }
  }

  const out = logs.join('\n');
  if (err) return (out ? out + '\n' : '') + '⚠ ' + err;
  return out || '(sin salida — usa print() para mostrar resultados)';
}
