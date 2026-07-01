# RENACER · Sincronización en la nube (cuentas + sync)

**Fecha:** 2026-06-30
**Estado:** Diseño aprobado, pendiente de plan de implementación

## Objetivo

Permitir que una persona use RENACER en varios dispositivos (celular, laptop) y
vea el **mismo progreso sincronizado**, sin perder el modelo actual local-first.
Uso **personal/privado** (tú y quizá pocos más), no un producto público masivo.

Decisiones tomadas en brainstorming:
- **Objetivo:** sync personal multi-dispositivo.
- **Login:** Google (un toque, sin contraseñas).
- **Modelo:** login **opcional** — la app sigue funcionando sin cuenta (offline,
  al instante). Iniciar sesión activa la sincronización.

## Enfoque elegido

**A · Sincronizar la cuenta completa como un "blob".** Se aprovecha la capa de
storage existente (`exportAccount()` / `importAccount()` en `lib/storage.ts`),
que ya serializa toda la cuenta (`renacer_*`) como un objeto. La cuenta pesa
pocos KB, así que cabe de sobra en un solo documento de Firestore (límite 1 MB).

Descartados: **B** (sync clave-por-clave, demasiado código para uso personal —
YAGNI) y **C** (respaldo manual, no es sync real).

## Arquitectura

Dos piezas nuevas; **no se modifica la capa de storage** existente.

### `lib/cloud.ts` — motor de sincronización
- Inicializa Firebase de forma **lazy** (import dinámico de `firebase/app`,
  `firebase/auth`, `firebase/firestore`). Solo carga cuando el usuario inicia
  sesión o hay una sesión previa que restaurar, para no engordar el bundle
  inicial de quienes no usan sync.
- API:
  - `signInWithGoogle(): Promise<void>`
  - `signOutCloud(opts?: { wipeLocal?: boolean }): Promise<void>`
  - `onAuthChange(cb: (user: SyncUser | null) => void): () => void`
  - `pull(): Promise<PullResult>` — lee `users/{uid}`
  - `push(): Promise<void>` — escribe la cuenta (con debounce)
  - `getSyncStatus(): { state, lastSyncedAt, pending }`
- **Detección de cambios central:** al inicializar, parchea `localStorage.setItem`
  para detectar escrituras a claves `renacer_*`. Cada escritura (cuando hay
  sesión y ya se hizo el `pull` inicial) agenda un `push` con debounce (~3 s).
  Esto evita tener que instrumentar los ~25 puntos de escritura.
- **Guard `isSyncing`:** durante un `importAccount()` (al bajar de la nube) se
  activa un flag para que el parche de `setItem` **no dispare pushes en cascada**.

### `components/CloudSync.tsx` — UI en Ajustes
- Sin sesión: botón "Iniciar sesión con Google para sincronizar".
- Con sesión: "Sincronizado como *{email}* · última vez hace {X}", indicador de
  estado (sincronizado / pendiente / sin conexión), botón "Cerrar sesión" y un
  botón separado y explícito "Cerrar sesión y borrar datos de este dispositivo".

### Configuración de Firebase
- `firebaseConfig` del proyecto `renacer-55078` va en el código (la web API key
  de Firebase es **pública por diseño**, no es un secreto). Sin `.env`, sin
  secretos en el repo.
- Pasos en la consola de Firebase (los hace el usuario, con guía):
  1. Activar **Google** como proveedor de autenticación.
  2. Crear la base **Firestore** y pegar las reglas de seguridad (abajo).
  3. Verificar dominios autorizados: `localhost` y `renacer-55078.web.app`.

## Modelo de datos (Firestore)

Un documento por usuario:

```
users/{uid} = {
  data: { ...toda la cuenta renacer_* },   // salida de exportAccount()
  updatedAt: number,                        // ms epoch del último cambio
  device: string                            // etiqueta del dispositivo que subió
}
```

Marca local nueva: `renacer_updatedAt` (ms epoch) que se actualiza en cada
escritura `renacer_*`. Es lo que se compara contra `updatedAt` de la nube.

## Flujo de datos

1. **Primer login (dispositivo A con datos):** Google popup → `pull()` no
   encuentra doc → `push()` sube el progreso actual. Nube = A.
2. **Login en dispositivo B:**
   - `pull()` encuentra doc.
   - Si B **no tiene datos** (`renacer_updatedAt` ausente) → `importAccount(data)`
     + `location.reload()`.
   - Si B **tiene datos** → **preguntar una vez** al usuario: "Hay progreso en la
     nube (actualizado {fecha}) y en este dispositivo (actualizado {fecha}).
     ¿Cuál conservar?" → importar nube **o** subir local. Evita pérdida silenciosa.
3. **Operación normal:** cualquier escritura `renacer_*` → `push()` con debounce.
   Al abrir la app o al volver el foco a la pestaña → `pull()`; gana el más
   reciente por `updatedAt`.

### Decisión de sincronización (función pura, testeable)

`decideSync(local, cloud) → 'push' | 'pull' | 'ask' | 'noop'`

| local | cloud | resultado |
|---|---|---|
| sin datos | no existe | `noop` |
| con datos | no existe | `push` |
| sin datos | existe | `pull` |
| con datos | existe, cloud.updatedAt > local | `pull` |
| con datos | existe, local.updatedAt > cloud | `push` |
| con datos | existe, ambos cambiaron desde el último sync | `ask` |

"Ambos cambiaron desde el último sync" se detecta guardando `renacer_lastSyncedAt`
(el `updatedAt` de la última sincronización exitosa): si tanto local como cloud
tienen `updatedAt` mayores que `lastSyncedAt`, es conflicto real → `ask`.

## Manejo de errores y casos borde

- **Sin internet:** la app sigue funcionando (local-first). Si `push` falla, el
  estado queda "pendiente" y reintenta al reconectar o al volver el foco.
- **Popup de Google cancelado/bloqueado:** mensaje amable; la app sigue local.
- **`pull` falla:** se conserva lo local; no se pisa nada.
- **Cerrar sesión:** detiene la sincronización, **conserva** los datos locales.
  La opción "borrar de este dispositivo" es una acción separada y explícita.
- **Bucle de sync:** el flag `isSyncing` suprime la detección de escrituras
  mientras se importa desde la nube.
- **Reflejar cambios tras importar:** `location.reload()` para que todos los
  hooks vuelvan a leer `localStorage`.

## Seguridad

Reglas de Firestore (cada quien solo su documento):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Costo

Plan gratuito de Firebase (Spark): 50k lecturas / 20k escrituras / 1 GB por día.
Uso personal está muy por debajo del límite. **$0.**

## Impacto en el bundle

Firebase (`auth` + `firestore`) se carga con **import dinámico**, solo al iniciar
sesión. El bundle inicial de la app **no cambia** para quien no usa sync.

## Testing

- **TDD de `decideSync`** (función pura): cubrir los 6 escenarios de la tabla.
- El I/O de Firebase queda tras una interfaz delgada (`CloudStore`) para poder
  probar la lógica de sync con un *fake* en memoria.
- **E2E manual:** dos perfiles de navegador, iniciar sesión en ambos, verificar
  que el progreso viaja y que el caso "ambos con datos" pregunta correctamente.

## Fuera de alcance (YAGNI)

- Sync en tiempo real entre dispositivos abiertos a la vez (`onSnapshot`).
- Merge granular clave-por-clave.
- Registro público, recuperación de contraseña, roles/admin.
- Compartir datos entre usuarios, rankings sociales.
