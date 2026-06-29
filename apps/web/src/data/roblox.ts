// Contenido del módulo Roblox: plantillas por tipo de juego, recetario de comandos Lua y guía.

// ── Plantillas por tipo de juego (roadmap completo por género) ──
export type GameTemplate = {
  id: string; name: string; emoji: string; difficulty: number; desc: string;
  phases: { title: string; steps: string[] }[];
  monetize: string[];
};

export const TEMPLATES: GameTemplate[] = [
  {
    id: 'obby', name: 'Obby (obstáculos)', emoji: '🏃', difficulty: 1,
    desc: 'Carrera de obstáculos: salta plataformas, esquiva trampas y llega a la meta. Ideal para empezar.',
    phases: [
      { title: '1. Mapa', steps: ['Construye plataformas con Parts.', 'Pon un SpawnLocation al inicio.', 'Crea "lava" (partes que matan al tocarlas).'] },
      { title: '2. Checkpoints', steps: ['Coloca checkpoints cada cierto tramo.', 'Al tocarlos, guarda dónde reaparece el jugador.'] },
      { title: '3. Meta y etapas', steps: ['Pon una meta que dé puntos/etapas.', 'Muestra la etapa actual en una GUI (leaderstats "Stage").'] },
      { title: '4. Pulido', steps: ['Añade partes móviles y trampas.', 'Sonidos al avanzar y música de fondo.', 'Publica y comparte.'] },
    ],
    monetize: ['Game Pass de "saltar etapa" (skip stage).', 'Dev Product de "revivir en el último checkpoint".'],
  },
  {
    id: 'simulator', name: 'Simulator', emoji: '⛏️', difficulty: 2,
    desc: 'El jugador repite una acción (minar, recolectar), gana monedas y compra mejoras. Muy popular.',
    phases: [
      { title: '1. Mecánica central', steps: ['Define la acción (clic, golpear, recolectar).', 'Cada acción da monedas (leaderstats).'] },
      { title: '2. Mejoras (upgrades)', steps: ['Tienda con mejoras que aumentan monedas por acción o velocidad.', 'Guarda el nivel de cada mejora.'] },
      { title: '3. Rebirth / prestigio', steps: ['Sistema de "rebirth": reinicias monedas a cambio de un multiplicador permanente.'] },
      { title: '4. Retención', steps: ['Mascotas que dan bonus.', 'Zonas desbloqueables.', 'Guardado con DataStore.', 'Recompensa diaria.'] },
    ],
    monetize: ['Game Pass de x2 monedas.', 'Dev Products de paquetes de monedas.', 'Mascotas premium.'],
  },
  {
    id: 'tycoon', name: 'Tycoon', emoji: '🏭', difficulty: 3,
    desc: 'Compras partes que generan dinero pasivo y vas construyendo tu base/fábrica.',
    phases: [
      { title: '1. Base del jugador', steps: ['Asigna una plataforma a cada jugador al entrar.', 'Pon botones de compra (con precio).'] },
      { title: '2. Generador de dinero', steps: ['Un "dropper" genera objetos que dan dinero al llegar a un colector.', 'El dinero se acumula en leaderstats.'] },
      { title: '3. Expansión', steps: ['Más botones desbloquean nuevas partes/máquinas.', 'Cada compra mejora la producción.'] },
      { title: '4. Pulido', steps: ['Guardado de la base con DataStore.', 'Efectos y sonidos de compra.', 'Tabla de ricos (leaderboard).'] },
    ],
    monetize: ['Game Pass VIP (x2 producción).', 'Dev Products de dinero.', 'Skins de la base.'],
  },
  {
    id: 'fighting', name: 'Combate / Battle', emoji: '⚔️', difficulty: 3,
    desc: 'Pelea entre jugadores o contra enemigos: daño, vida, armas y habilidades.',
    phases: [
      { title: '1. Combate', steps: ['Da una herramienta (Tool) como arma.', 'Al golpear, aplica daño con TakeDamage.'] },
      { title: '2. Vida y respawn', steps: ['Barra de vida en GUI.', 'Al morir, reaparece y suma una muerte/kill.'] },
      { title: '3. Equipos / arena', steps: ['Crea equipos (Teams) o una arena.', 'Marcador de kills (leaderstats).'] },
      { title: '4. Progresión', steps: ['Armas y habilidades desbloqueables.', 'Niveles del jugador con XP.', 'Guardado.'] },
    ],
    monetize: ['Game Pass de armas/habilidades.', 'Skins de armas.', 'Dev Product para subir de rango.'],
  },
  {
    id: 'rpg', name: 'RPG / Aventura', emoji: '🗺️', difficulty: 4,
    desc: 'Mundo abierto con misiones, NPCs, inventario, niveles y jefes. El más completo.',
    phases: [
      { title: '1. Mundo y jugador', steps: ['Construye el mapa por zonas.', 'Stats del personaje: vida, nivel, XP (leaderstats + atributos).'] },
      { title: '2. NPCs y misiones', steps: ['NPCs con ProximityPrompt para hablar.', 'Sistema de misiones con objetivos y recompensas.'] },
      { title: '3. Inventario y economía', steps: ['Inventario de items.', 'Tienda de mercaderes.', 'Crafteo opcional.'] },
      { title: '4. Combate y jefes', steps: ['Enemigos y un jefe con barra de vida.', 'Subir de nivel al derrotarlos.'] },
      { title: '5. Persistencia y pulido', steps: ['DataStore (todo se guarda).', 'Gráficos: iluminación, skybox.', 'Música por zona.', 'Diálogos.'] },
    ],
    monetize: ['Game Pass de zonas premium.', 'Mascotas/monturas.', 'Dev Products de oro y XP boost.'],
  },
  {
    id: 'tower', name: 'Tower Defense', emoji: '🗼', difficulty: 3,
    desc: 'Coloca torres para detener oleadas de enemigos que avanzan por un camino.',
    phases: [
      { title: '1. Camino y oleadas', steps: ['Define el camino (waypoints).', 'Genera enemigos que lo recorren con Tween.'] },
      { title: '2. Torres', steps: ['El jugador coloca torres que disparan a los enemigos cercanos.', 'Cada torre tiene daño y alcance.'] },
      { title: '3. Economía', steps: ['Ganas dinero por matar enemigos.', 'Compras y mejoras torres.'] },
      { title: '4. Dificultad', steps: ['Oleadas cada vez más difíciles.', 'Jefes cada X oleadas.', 'Guardado y leaderboard.'] },
    ],
    monetize: ['Torres premium (Game Pass).', 'Dev Product de dinero inicial.', 'x2 recompensa.'],
  },
  {
    id: 'horror', name: 'Horror / Survival', emoji: '👻', difficulty: 3,
    desc: 'Sobrevive en un escenario oscuro mientras algo te persigue. La atmósfera lo es todo.',
    phases: [
      { title: '1. Atmósfera', steps: ['Mapa oscuro y cerrado.', 'Baja la iluminación (Lighting) y añade niebla (Atmosphere).', 'Sonidos de tensión y sustos.'] },
      { title: '2. Amenaza', steps: ['Un enemigo/monstruo que persigue al jugador.', 'Al atraparlo, lo elimina o le quita vida.'] },
      { title: '3. Objetivo', steps: ['Recolecta objetos (llaves, pistas) para escapar.', 'Una salida que se abre al completar el objetivo.'] },
      { title: '4. Pulido', steps: ['Linterna con batería limitada.', 'Jumpscares con sonido.', 'Multijugador cooperativo.', 'Guardado de récords.'] },
    ],
    monetize: ['Skins/linternas premium.', 'Game Pass de personaje especial.', 'Dev Product para revivir.'],
  },
  {
    id: 'racing', name: 'Carreras / Racing', emoji: '🏎️', difficulty: 3,
    desc: 'Conduce vehículos por un circuito, compite contra otros y mejora tu auto.',
    phases: [
      { title: '1. Circuito y vehículo', steps: ['Construye una pista con checkpoints.', 'Da un VehicleSeat para conducir.'] },
      { title: '2. Carrera', steps: ['Cuenta vueltas con los checkpoints.', 'Cronómetro y posición en pantalla (GUI).'] },
      { title: '3. Competencia', steps: ['Varios jugadores corren a la vez.', 'Tabla de mejores tiempos (leaderboard).'] },
      { title: '4. Progresión', steps: ['Compra y mejora vehículos.', 'Desbloquea pistas.', 'Guardado con DataStore.'] },
    ],
    monetize: ['Vehículos premium (Game Pass).', 'Skins/colores.', 'Dev Product de boost.'],
  },
];

// ── Recetario de comandos Lua (copia y pega) ──
export type Snippet = { cat: string; title: string; desc: string; code: string };

export const SNIPPET_CATS = ['Básico', 'Jugador', 'Partes y eventos', 'Economía', 'Interfaz (GUI)', 'NPC y tienda', 'Datos (guardar)', 'Efectos', 'Avanzado'];

export const SNIPPETS: Snippet[] = [
  { cat: 'Básico', title: 'Imprimir y variables', desc: 'Lo más básico.', code: 'local nombre = "Cemal"\nlocal puntos = 0\nprint("Hola, " .. nombre)' },
  { cat: 'Básico', title: 'Condicionales y bucles', desc: 'if, for, while.', code: 'for i = 1, 5 do\n  if i % 2 == 0 then\n    print(i .. " es par")\n  end\nend' },
  { cat: 'Básico', title: 'Función', desc: 'Define y llama una función.', code: 'local function sumar(a, b)\n  return a + b\nend\nprint(sumar(2, 3))' },

  { cat: 'Jugador', title: 'Cuando entra un jugador', desc: 'PlayerAdded.', code: 'game.Players.PlayerAdded:Connect(function(player)\n  print(player.Name .. " entró")\nend)' },
  { cat: 'Jugador', title: 'Velocidad y salto', desc: 'Cambia atributos del personaje.', code: 'player.CharacterAdded:Connect(function(char)\n  local hum = char:WaitForChild("Humanoid")\n  hum.WalkSpeed = 24\n  hum.JumpPower = 60\nend)' },
  { cat: 'Jugador', title: 'Dañar / curar', desc: 'TakeDamage y Health.', code: 'humanoid:TakeDamage(20) -- quita 20 de vida\nhumanoid.Health = humanoid.MaxHealth -- curar al máximo' },

  { cat: 'Partes y eventos', title: 'Crear una parte', desc: 'Instance.new("Part").', code: 'local p = Instance.new("Part")\np.Size = Vector3.new(4, 1, 4)\np.Position = Vector3.new(0, 5, 0)\np.Anchored = true\np.Parent = workspace' },
  { cat: 'Partes y eventos', title: 'Detectar contacto (Touched)', desc: 'Cuando algo toca una parte.', code: 'parte.Touched:Connect(function(hit)\n  local plr = game.Players:GetPlayerFromCharacter(hit.Parent)\n  if plr then print(plr.Name .. " tocó la parte") end\nend)' },
  { cat: 'Partes y eventos', title: 'Botón con clic (ClickDetector)', desc: 'Clic con el mouse.', code: 'local cd = Instance.new("ClickDetector")\ncd.Parent = parte\ncd.MouseClick:Connect(function(player)\n  print(player.Name .. " hizo clic")\nend)' },
  { cat: 'Partes y eventos', title: 'Interactuar con E (ProximityPrompt)', desc: 'Para NPCs/objetos.', code: 'local prompt = Instance.new("ProximityPrompt")\nprompt.ActionText = "Usar"\nprompt.Parent = parte\nprompt.Triggered:Connect(function(player)\n  print(player.Name .. " presionó E")\nend)' },

  { cat: 'Economía', title: 'Crear leaderstats (monedas)', desc: 'Aparecen en la tabla de jugadores.', code: 'game.Players.PlayerAdded:Connect(function(player)\n  local stats = Instance.new("Folder")\n  stats.Name = "leaderstats"\n  stats.Parent = player\n  local monedas = Instance.new("IntValue")\n  monedas.Name = "Monedas"\n  monedas.Parent = stats\nend)' },
  { cat: 'Economía', title: 'Moneda recolectable', desc: 'Suma monedas y se destruye.', code: 'moneda.Touched:Connect(function(hit)\n  local plr = game.Players:GetPlayerFromCharacter(hit.Parent)\n  if plr then\n    plr.leaderstats.Monedas.Value += 1\n    moneda:Destroy()\n  end\nend)' },
  { cat: 'Economía', title: 'Parte que mata (kill brick)', desc: 'Trampa de obby.', code: 'lava.Touched:Connect(function(hit)\n  local hum = hit.Parent:FindFirstChildOfClass("Humanoid")\n  if hum then hum.Health = 0 end\nend)' },

  { cat: 'Interfaz (GUI)', title: 'Botón que hace algo', desc: 'LocalScript dentro de un TextButton.', code: 'script.Parent.MouseButton1Click:Connect(function()\n  print("¡Botón presionado!")\nend)' },
  { cat: 'Interfaz (GUI)', title: 'Mostrar / ocultar un menú', desc: 'Cambia Visible.', code: 'frame.Visible = not frame.Visible' },
  { cat: 'Interfaz (GUI)', title: 'Actualizar texto en pantalla', desc: 'Refleja las monedas en la GUI.', code: 'monedas.Changed:Connect(function(valor)\n  label.Text = "Monedas: " .. valor\nend)' },

  { cat: 'NPC y tienda', title: 'Diálogo simple', desc: 'Líneas una por una.', code: 'local lineas = {"¡Hola!", "Bienvenido al pueblo.", "¿Buscas aventura?"}\nlocal i = 1\nboton.MouseButton1Click:Connect(function()\n  label.Text = lineas[i]\n  i = math.min(i + 1, #lineas)\nend)' },
  { cat: 'NPC y tienda', title: 'Comprar un item', desc: 'Resta monedas si alcanza.', code: 'local precio = 50\nif plr.leaderstats.Monedas.Value >= precio then\n  plr.leaderstats.Monedas.Value -= precio\n  -- entrega el item / habilidad\nend' },

  { cat: 'Datos (guardar)', title: 'Guardar y cargar (DataStore)', desc: 'Activa API Services en Game Settings.', code: 'local DSS = game:GetService("DataStoreService")\nlocal store = DSS:GetDataStore("Datos")\n\ngame.Players.PlayerAdded:Connect(function(plr)\n  local data = store:GetAsync(plr.UserId) or 0\n  -- restaurar monedas con \'data\'\nend)\ngame.Players.PlayerRemoving:Connect(function(plr)\n  store:SetAsync(plr.UserId, plr.leaderstats.Monedas.Value)\nend)' },

  { cat: 'Efectos', title: 'Mover suave (Tween)', desc: 'Animaciones fluidas.', code: 'local TS = game:GetService("TweenService")\nlocal info = TweenInfo.new(1)\nTS:Create(parte, info, {Position = Vector3.new(0, 20, 0)}):Play()' },
  { cat: 'Efectos', title: 'Reproducir un sonido', desc: 'Pon un Sound en la parte.', code: 'local s = parte:FindFirstChild("Sound")\nif s then s:Play() end' },
  { cat: 'Efectos', title: 'Hora del día e iluminación', desc: 'Ambiente visual.', code: 'local Lighting = game:GetService("Lighting")\nLighting.ClockTime = 18 -- atardecer\nLighting.Brightness = 2' },

  { cat: 'Avanzado', title: 'Cliente → Servidor (RemoteEvent)', desc: 'Nunca confíes en el cliente.', code: '-- Servidor (Script): escucha\nremote.OnServerEvent:Connect(function(player, datos)\n  print(player.Name .. " envió:", datos)\nend)\n\n-- Cliente (LocalScript): envía\nremote:FireServer("comprar espada")' },
  { cat: 'Avanzado', title: 'Módulo reutilizable (ModuleScript)', desc: 'Organiza tu código.', code: '-- ReplicatedStorage > ModuleScript "Economia"\nlocal Economia = {}\nfunction Economia.dar(plr, n)\n  plr.leaderstats.Monedas.Value += n\nend\nreturn Economia\n\n-- Uso: local Economia = require(game.ReplicatedStorage.Economia)' },
  { cat: 'Avanzado', title: 'Esperar a algo (WaitForChild)', desc: 'Evita errores de "nil".', code: 'local parte = workspace:WaitForChild("MiParte")\nlocal hum = char:WaitForChild("Humanoid")' },
  { cat: 'Avanzado', title: 'Repetir cada cierto tiempo', desc: 'Un bucle con task.wait.', code: 'while true do\n  task.wait(5) -- cada 5 segundos\n  print("¡Tick!")\nend' },

  { cat: 'Jugador', title: 'Teletransportar al personaje', desc: 'Mueve al jugador a una posición.', code: 'local root = char:FindFirstChild("HumanoidRootPart")\nif root then\n  root.CFrame = CFrame.new(50, 10, 0)\nend' },
  { cat: 'Jugador', title: 'Dar una herramienta (Tool)', desc: 'Mete un arma a la mochila.', code: 'local tool = game.ReplicatedStorage.Espada:Clone()\ntool.Parent = player.Backpack' },

  { cat: 'Economía', title: 'Recompensa diaria', desc: 'Da monedas una vez al día (con DataStore).', code: '-- guarda el último día reclamado y compáralo con os.date("%j")\nlocal hoy = os.date("%j")\nif ultimoDia ~= hoy then\n  plr.leaderstats.Monedas.Value += 100\n  ultimoDia = hoy\nend' },

  { cat: 'Partes y eventos', title: 'Cambiar color y material', desc: 'Personaliza una parte.', code: 'parte.BrickColor = BrickColor.new("Bright red")\nparte.Material = Enum.Material.Neon' },

  { cat: 'Efectos', title: 'Partículas (chispas/explosión)', desc: 'Emite partículas.', code: 'local fuego = Instance.new("ParticleEmitter")\nfuego.Rate = 20\nfuego.Lifetime = NumberRange.new(1, 2)\nfuego.Parent = parte' },
];

// ── Guía de Roblox (referencia) ──
export type GuideSection = { title: string; items: string[] };

export const GUIDE: GuideSection[] = [
  { title: '🛠️ Roblox Studio en 1 minuto', items: [
    'Explorer: el árbol de todos los objetos del juego.',
    'Properties: las propiedades del objeto seleccionado (tamaño, color, posición…).',
    'Toolbox: assets gratis (modelos, sonidos, imágenes) que puedes arrastrar.',
    'Botón Play (F5): prueba tu juego al instante. Stop para parar.',
    'Dónde van los scripts: lógica del servidor → ServerScriptService; interfaz/cliente → StarterPlayer / StarterGui; módulos compartidos → ReplicatedStorage.',
  ] },
  { title: '🐞 Errores comunes y cómo arreglarlos', items: [
    '"attempt to index nil": el objeto no existe todavía → usa :WaitForChild("Nombre").',
    'Tu LocalScript no corre en el servidor (y viceversa): revisa dónde lo pusiste.',
    'Olvidaste :Connect() al suscribir un evento.',
    'Usa print() para ver qué pasa, y revisa la pestaña Output (errores en rojo).',
    'DataStore no guarda: activa "Studio Access to API Services" en Game Settings → Security.',
  ] },
  { title: '🎨 Que se vea pro', items: [
    'Iluminación: ClockTime, Brightness y Technology = Future (sombras).',
    'Skybox y Atmosphere para el cielo y la niebla.',
    'Materiales (Neon, Wood, Metal) y una paleta de colores coherente.',
    'Efectos PostProcessing: Bloom y SunRays con medida.',
    'Sonido y música: hacen que el juego se sienta vivo.',
  ] },
  { title: '💰 Monetización (ganar Robux)', items: [
    'Game Passes: compras de una sola vez (VIP, x2 monedas, arma especial).',
    'Developer Products: compras repetibles (paquetes de monedas, revivir).',
    'Vende cosméticos (skins) que no rompan el balance del juego.',
    'No hagas "pay to win" agresivo: ahuyenta jugadores.',
  ] },
  { title: '🚀 Publicar y conseguir jugadores', items: [
    'File → Publish to Roblox: nombre, descripción y género.',
    'Crea un ícono y un thumbnail atractivos (la primera impresión lo es todo).',
    'Pon el juego en público en la configuración del juego.',
    'Comparte el link, pide feedback y actualiza seguido.',
    'Los primeros jugadores son amigos: invítalos a probar y a opinar.',
  ] },
];
