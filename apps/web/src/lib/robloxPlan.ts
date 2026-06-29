// Genera un plan paso a paso para crear un juego de Roblox a partir de la historia del usuario.
// Heurístico (sin IA): detecta elementos en el texto y arma secciones con comandos Lua + recomendaciones.
export type PlanSection = { title: string; steps: string[]; code?: string };

export type Scope = { size: 'pequeño' | 'mediano' | 'extenso'; advice: string; milestones: string[] };
export type GamePlan = { detected: string[]; sections: PlanSection[]; recommendations: string[]; scope: Scope };

export function analyzeStory(text: string): GamePlan {
  const t = (text || '').toLowerCase();
  const detected: string[] = [];
  const sections: PlanSection[] = [];

  // 0) Tipo de juego detectado (plantilla base)
  let gameType = '';
  if (/obby|obst[aá]cul|plataform|parkour|saltar/.test(t)) gameType = 'Obby (carrera de obstáculos): enfócate en partes que matan, checkpoints y una meta.';
  else if (/simulador|simulator|farmear|click|mejora|upgrade/.test(t)) gameType = 'Simulator: el jugador repite una acción, gana monedas y compra mejoras. Clave: tienda y leaderstats.';
  else if (/tycoon|fábrica|negocio|construir base/.test(t)) gameType = 'Tycoon: compras partes que generan dinero. Clave: botones de compra y un generador pasivo de monedas.';
  else if (/pelea|combate|fighting|batalla|arena|pvp/.test(t)) gameType = 'Juego de combate: enfócate en daño (TakeDamage), vida y un sistema de equipos o arena.';
  else if (/carrera|racing|veloc|circuito/.test(t)) gameType = 'Carreras: enfócate en vehículos, un circuito con checkpoints y un cronómetro.';
  if (gameType) {
    detected.push('Tipo de juego');
    sections.push({ title: '🎯 Tipo de juego', steps: [gameType, 'Empieza por la mecánica central de este tipo y luego añade el resto.'] });
  }

  // 1) Setup (siempre)
  sections.push({
    title: '1. Prepara Roblox Studio',
    steps: [
      'Descarga e instala Roblox Studio (gratis).',
      'Crea un lugar nuevo: plantilla "Baseplate" (un piso vacío para empezar).',
      'Familiarízate con: Explorer (objetos), Properties (propiedades) y Toolbox (assets).',
      'Los scripts del servidor van en ServerScriptService; los del jugador en StarterPlayer.',
    ],
  });

  // 2) Movimiento/spawn (siempre, base de cualquier juego)
  sections.push({
    title: '2. Jugador y punto de aparición',
    steps: [
      'Agrega un SpawnLocation donde aparezca el jugador.',
      'Ejecuta código cuando entra un jugador con PlayerAdded.',
    ],
    code: `game.Players.PlayerAdded:Connect(function(player)
  print(player.Name .. " entró al juego!")
  player.CharacterAdded:Connect(function(char)
    -- aquí preparas al personaje (velocidad, salud, etc.)
  end)
end)`,
  });

  // Detección de elementos
  if (/enemig|monstruo|jefe|boss|villano|zombie|criatura/.test(t)) {
    detected.push('Enemigos');
    sections.push({
      title: 'Enemigos / NPCs',
      steps: ['Crea un modelo enemigo (o usa uno del Toolbox).', 'Haz que dañe al jugador al tocarlo.'],
      code: `local enemigo = workspace.Enemigo
enemigo.Touched:Connect(function(hit)
  local hum = hit.Parent:FindFirstChildOfClass("Humanoid")
  if hum then
    hum:TakeDamage(20)
  end
end)`,
    });
  }

  if (/nivel|mundo|mapa|escenario|level|obby|obst[aá]cul|plataform|laberinto/.test(t)) {
    detected.push('Niveles / Mapa');
    sections.push({
      title: 'Niveles, mapa y obstáculos',
      steps: [
        'Construye el mapa con Parts (mueve, escala y pinta).',
        'Crea "partes mortales" que reinician al jugador al tocarlas.',
        'Para varios niveles, usa checkpoints o teletransporta al jugador.',
      ],
      code: `-- Parte que mata al tocarla (lava/trampa)
local lava = workspace.Lava
lava.Touched:Connect(function(hit)
  local hum = hit.Parent:FindFirstChildOfClass("Humanoid")
  if hum then hum.Health = 0 end
end)`,
    });
  }

  if (/objeto|item|arma|moneda|coin|poci[oó]n|llave|tesoro|recoge|power/.test(t)) {
    detected.push('Objetos / Items');
    sections.push({
      title: 'Objetos y recolectables',
      steps: ['Crea una Part como objeto (moneda, llave…).', 'Al tocarla, dásela al jugador y elimínala.'],
      code: `local moneda = workspace.Moneda
moneda.Touched:Connect(function(hit)
  local plr = game.Players:GetPlayerFromCharacter(hit.Parent)
  if plr then
    plr.leaderstats.Monedas.Value += 1
    moneda:Destroy()
  end
end)`,
    });
  }

  if (/punto|puntaje|score|vida|salud|health|monedas|experiencia|nivel de exp/.test(t) || detected.includes('Objetos / Items')) {
    detected.push('Puntos / Vida');
    sections.push({
      title: 'Sistema de puntos / vida (leaderstats)',
      steps: ['Crea leaderstats para mostrar puntos en la tabla de clasificación.'],
      code: `game.Players.PlayerAdded:Connect(function(player)
  local stats = Instance.new("Folder")
  stats.Name = "leaderstats"
  stats.Parent = player

  local monedas = Instance.new("IntValue")
  monedas.Name = "Monedas"
  monedas.Value = 0
  monedas.Parent = stats
end)`,
    });
  }

  if (/menu|interfaz|bot[oó]n|gui|pantalla|hud|men[uú]|t[ií]tulo/.test(t)) {
    detected.push('Interfaz / GUI');
    sections.push({
      title: 'Interfaz (menús y HUD)',
      steps: ['Crea un ScreenGui en StarterGui.', 'Agrega TextLabel/TextButton y dales lógica con un LocalScript.'],
      code: `-- LocalScript dentro de un TextButton
script.Parent.MouseButton1Click:Connect(function()
  print("¡Botón presionado!")
  -- abrir/cerrar menú, empezar partida, etc.
end)`,
    });
  }

  if (/guardar|progreso|datos|save|datastore|r[eé]cord|ranking/.test(t)) {
    detected.push('Guardado de progreso');
    sections.push({
      title: 'Guardar el progreso (DataStore)',
      steps: ['Activa "Studio Access to API Services" en Game Settings.', 'Guarda y carga datos con DataStoreService.'],
      code: `local DSS = game:GetService("DataStoreService")
local store = DSS:GetDataStore("Progreso")

game.Players.PlayerAdded:Connect(function(plr)
  local data = store:GetAsync(plr.UserId) or 0
  -- usar 'data' para restaurar monedas/nivel
end)

game.Players.PlayerRemoving:Connect(function(plr)
  store:SetAsync(plr.UserId, plr.leaderstats.Monedas.Value)
end)`,
    });
  }

  if (/multijugador|jugadores|equipo|team|pvp|cooperativo|versus/.test(t)) {
    detected.push('Multijugador / Equipos');
    sections.push({
      title: 'Multijugador y equipos',
      steps: ['Crea Teams en el servicio Teams.', 'Asigna al jugador a un equipo al entrar.'],
      code: `local Teams = game:GetService("Teams")
game.Players.PlayerAdded:Connect(function(plr)
  plr.Team = Teams.Rojos -- crea los Teams antes en el Explorer
end)`,
    });
  }

  if (/jefe|boss|villano principal|jefe final/.test(t)) {
    detected.push('Jefe / Boss');
    sections.push({
      title: 'Jefe (Boss) con barra de vida',
      steps: ['Crea un modelo grande con Humanoid.', 'Dale mucha vida y un ataque; muestra su vida en una GUI.'],
      code: `local boss = workspace.Boss.Humanoid
boss.MaxHealth = 500
boss.Health = 500
boss.HealthChanged:Connect(function(vida)
  print("Vida del jefe: " .. vida)
end)`,
    });
  }

  if (/tienda|shop|comprar|vender|mercado/.test(t)) {
    detected.push('Tienda / Shop');
    sections.push({
      title: 'Tienda (comprar con monedas)',
      steps: ['Haz una GUI con botones de productos.', 'Al comprar, resta monedas y entrega el item.'],
      code: `-- En un script: al pulsar comprar
local precio = 50
if plr.leaderstats.Monedas.Value >= precio then
  plr.leaderstats.Monedas.Value -= precio
  -- darle el item / habilidad
end`,
    });
  }

  if (/checkpoint|punto de control|revivir|reaparec/.test(t)) {
    detected.push('Checkpoints');
    sections.push({
      title: 'Checkpoints (puntos de control)',
      steps: ['Coloca partes "checkpoint" a lo largo del nivel.', 'Al tocarlas, guarda dónde reaparece el jugador.'],
      code: `checkpoint.Touched:Connect(function(hit)
  local plr = game.Players:GetPlayerFromCharacter(hit.Parent)
  if plr then plr.RespawnLocation = checkpoint end
end)`,
    });
  }

  if (/tiempo|cron[oó]metro|reloj|contrarreloj|timer|segundos/.test(t)) {
    detected.push('Tiempo / Timer');
    sections.push({
      title: 'Cronómetro / cuenta regresiva',
      steps: ['Usa un bucle con task.wait(1) para descontar segundos.', 'Muestra el tiempo en una GUI.'],
      code: `local tiempo = 60
while tiempo > 0 do
  task.wait(1)
  tiempo -= 1
  print("Tiempo: " .. tiempo)
end
print("¡Se acabó el tiempo!")`,
    });
  }

  if (/teletransport|portal|teleport|viajar entre|otra zona/.test(t)) {
    detected.push('Teletransporte / Portales');
    sections.push({
      title: 'Portales y teletransporte',
      steps: ['Crea una parte "portal".', 'Al tocarla, mueve al personaje a otra posición.'],
      code: `portal.Touched:Connect(function(hit)
  local root = hit.Parent:FindFirstChild("HumanoidRootPart")
  if root then root.CFrame = CFrame.new(100, 5, 0) end
end)`,
    });
  }

  if (/puerta|llave|cerradura|desbloque/.test(t)) {
    detected.push('Puertas y llaves');
    sections.push({
      title: 'Puerta que se abre con una llave',
      steps: ['Da una llave al jugador (atributo o valor).', 'La puerta se abre solo si tiene la llave.'],
      code: `puerta.Touched:Connect(function(hit)
  local plr = game.Players:GetPlayerFromCharacter(hit.Parent)
  if plr and plr:GetAttribute("TieneLlave") then
    puerta.CanCollide = false
    puerta.Transparency = 0.5
  end
end)`,
    });
  }

  if (/veh[ií]culo|coche|carro|auto|moto|nave|barco/.test(t)) {
    detected.push('Vehículos');
    sections.push({
      title: 'Vehículos',
      steps: ['Usa un VehicleSeat para que el jugador conduzca.', 'Ajusta su velocidad (MaxSpeed) y torque.'],
      code: `local asiento = workspace.Coche.VehicleSeat
asiento.MaxSpeed = 60
asiento.Torque = 10000
-- el jugador conduce al sentarse en el VehicleSeat`,
    });
  }

  if (/mascota|pet|compañero|companion/.test(t)) {
    detected.push('Mascotas / Pets');
    sections.push({
      title: 'Mascota que sigue al jugador',
      steps: ['Crea un modelo pequeño (la mascota).', 'Haz que siga al jugador cada frame.'],
      code: `local RunService = game:GetService("RunService")
RunService.Heartbeat:Connect(function()
  local root = personaje:FindFirstChild("HumanoidRootPart")
  if root then
    mascota.Position = root.Position + Vector3.new(3, 0, 0)
  end
end)`,
    });
  }

  if (/mercader|vendedor|comerciante|npc|aldeano|tendero|posad/.test(t)) {
    detected.push('Mercaderes / NPCs');
    sections.push({
      title: 'Mercaderes y NPCs interactivos',
      steps: ['Coloca un modelo NPC.', 'Usa un ProximityPrompt para que el jugador interactúe (E).', 'Al activarlo, abre la tienda o un diálogo.'],
      code: `local prompt = npc.PrimaryPart.ProximityPrompt
prompt.ActionText = "Hablar"
prompt.Triggered:Connect(function(player)
  print(player.Name .. " habló con el mercader")
  -- abrir GUI de tienda / diálogo
end)`,
    });
  }

  if (/inventario|mochila|backpack|objetos del jugador|items/.test(t)) {
    detected.push('Inventario');
    sections.push({
      title: 'Inventario del jugador',
      steps: ['Guarda los items en una Folder dentro del jugador.', 'Muéstralos en una GUI de inventario.'],
      code: `local function darItem(player, nombre)
  local inv = player:FindFirstChild("Inventario") or Instance.new("Folder")
  inv.Name = "Inventario"; inv.Parent = player
  local item = Instance.new("StringValue")
  item.Name = nombre
  item.Parent = inv
end`,
    });
  }

  if (/misi[oó]n|quest|objetivo|tarea|encargo|recompensa por/.test(t)) {
    detected.push('Misiones / Quests');
    sections.push({
      title: 'Sistema de misiones (quests)',
      steps: ['Lleva el progreso de cada misión con atributos.', 'Al cumplir el objetivo, da la recompensa.'],
      code: `player:SetAttribute("Mision_Monedas", 0)
-- cada vez que recoge una moneda:
local n = player:GetAttribute("Mision_Monedas") + 1
player:SetAttribute("Mision_Monedas", n)
if n >= 10 then
  print("¡Misión completada! Recompensa entregada")
end`,
    });
  }

  if (/di[aá]logo|conversaci|hablar con|narrativa|texto del personaje/.test(t)) {
    detected.push('Diálogos');
    sections.push({
      title: 'Diálogos con personajes',
      steps: ['Crea una GUI con el texto.', 'Muestra las líneas una por una con botones de continuar.'],
      code: `local lineas = {"¡Hola, aventurero!", "Necesito tu ayuda.", "Trae 10 monedas."}
local i = 1
boton.MouseButton1Click:Connect(function()
  label.Text = lineas[i]
  i = math.min(i + 1, #lineas)
end)`,
    });
  }

  if (/gr[aá]fic|visual|iluminaci|skybox|material|textura|sombra|ambiente|escenografia|escenografía/.test(t)) {
    detected.push('Gráficos / Visuales');
    sections.push({
      title: 'Gráficos y ambiente',
      steps: [
        'Lighting: ajusta el color, la hora del día y activa sombras (Technology = Future).',
        'Skybox: pon un cielo (busca uno en el Toolbox).',
        'Materials: usa materiales (Neon, Wood, Metal) y colores para dar estilo.',
        'Añade Atmosphere y un poco de Bloom/SunRays (efectos de PostProcessing) para que se vea pro.',
      ],
      code: `local Lighting = game:GetService("Lighting")
Lighting.ClockTime = 14        -- hora del día
Lighting.Brightness = 2
Lighting.Technology = Enum.Technology.Future -- sombras realistas`,
    });
  }

  // Para juegos GRANDES: organización y arquitectura
  const palabras = t.split(/\s+/).filter(Boolean).length;
  if (palabras > 120 || detected.length >= 6) {
    sections.push({
      title: '🏗️ Organiza un proyecto grande',
      steps: [
        'Separa la lógica en ModuleScripts reutilizables (un módulo por sistema: tienda, misiones, datos…).',
        'Servidor vs cliente: la lógica importante va en el servidor; la GUI en el cliente (LocalScript).',
        'Comunica cliente↔servidor con RemoteEvents/RemoteFunctions (nunca confíes en el cliente).',
        'Estructura clara: ServerScriptService (lógica), ReplicatedStorage (módulos compartidos), StarterGui (interfaz).',
        'Optimiza: reutiliza partes, evita bucles pesados cada frame y usa task.wait en vez de wait.',
        'Haz commits frecuentes / guarda versiones para no perder el avance.',
      ],
      code: `-- ReplicatedStorage > ModuleScript "Economia"
local Economia = {}
function Economia.darMonedas(player, n)
  player.leaderstats.Monedas.Value += n
end
return Economia

-- Desde un Script del servidor:
local Economia = require(game.ReplicatedStorage.Economia)
Economia.darMonedas(jugador, 50)`,
    });
  }

  // Sonido / efectos (siempre como "darle sazón")
  sections.push({
    title: 'Dale vida: sonido y efectos',
    steps: [
      'Agrega un Sound a una parte y reprodúcelo en eventos (moneda, victoria).',
      'Usa ParticleEmitter para chispas/explosiones.',
    ],
    code: `local sonido = workspace.Moneda.Sound
sonido:Play() -- cuando recoge la moneda`,
  });

  // Publicar (siempre)
  sections.push({
    title: 'Publica y comparte tu juego',
    steps: [
      'File → Publish to Roblox: ponle nombre, ícono y descripción.',
      'En la página del juego, actívalo como público.',
      'Comparte el link con amigos y pide feedback para mejorarlo.',
    ],
  });

  // Recomendaciones para mejorarlo / animarlo
  const recommendations: string[] = [
    '🎯 Empieza pequeño: haz que UNA mecánica funcione bien antes de añadir más.',
    '🧪 Prueba seguido con el botón Play de Studio; arregla un bug a la vez.',
    '🎨 El "juice" engancha: sonidos, partículas y animaciones simples hacen que se sienta vivo.',
    '⚖️ Balancea la dificultad: ni imposible ni aburrido. Pruébalo con un amigo.',
    '💾 Guarda el progreso (DataStore): que el jugador quiera volver.',
  ];
  if (!detected.includes('Interfaz / GUI')) recommendations.push('🖥️ Agrega un menú/HUD: hace que tu juego se vea profesional.');
  if (!detected.includes('Guardado de progreso')) recommendations.push('🏆 Añade récords/ranking: la competencia retiene jugadores.');
  recommendations.push('🚀 Publícalo aunque no esté perfecto: el feedback real te dirá qué mejorar. ¡Tú puedes, campeón!');

  // ── Alcance del proyecto y plan por hitos (para no abrumarte en un juego extenso) ──
  const det = new Set(detected);
  const words = t.split(/\s+/).filter(Boolean).length;
  const size: Scope['size'] = det.size >= 8 || words > 220 ? 'extenso' : det.size >= 4 || words > 80 ? 'mediano' : 'pequeño';

  const milestones: string[] = ['Hito 1 · MVP jugable: el jugador se mueve y la mecánica central funciona (aunque se vea feo).'];
  if (det.has('Objetos / Items') || det.has('Puntos / Vida') || det.has('Tienda / Shop')) milestones.push('Hito 2 · Economía: monedas/leaderstats, objetos recolectables y/o tienda.');
  if (det.has('Enemigos') || det.has('Jefe / Boss')) milestones.push('Hito 3 · Conflicto: enemigos, daño/vida y el jefe.');
  if (det.has('Niveles / Mapa') || det.has('Misiones / Quests') || det.has('Inventario') || det.has('Mascotas / Pets')) milestones.push('Hito 4 · Mundo y progresión: niveles, misiones, inventario, mascotas.');
  if (det.has('Guardado de progreso') || det.has('Interfaz / GUI') || det.has('Mercaderes / NPCs') || det.has('Diálogos')) milestones.push('Hito 5 · Persistencia e interfaz: DataStore, menús, NPCs y diálogos.');
  milestones.push('Hito 6 · Pulido: gráficos, sonido, efectos y balance.');
  milestones.push('Hito 7 · Lanzar: publica el MVP, consigue feedback real e itera.');

  const advice = size === 'extenso'
    ? 'Es un proyecto GRANDE. No lo hagas todo de golpe: construye un MVP jugable y suma un sistema por hito, probando después de cada uno. Así no te abrumas ni te trabas.'
    : size === 'mediano'
      ? 'Proyecto de tamaño medio. Sigue los hitos en orden y prueba seguido.'
      : 'Proyecto pequeño y manejable. ¡Empieza por el MVP y publícalo pronto!';

  return { detected: [...det], sections, recommendations, scope: { size, advice, milestones } };
}
