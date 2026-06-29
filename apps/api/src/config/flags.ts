// Feature flags — permiten activar/desactivar RENACER AI sin afectar la app actual.
// Por defecto: Core IA encendido, tiempo real y Control de PC apagados (riesgo).
export const flags = {
  coreIA: process.env.FEATURE_CORE_IA !== 'false',
  realtime: process.env.FEATURE_REALTIME === 'true',
  controlPc: process.env.FEATURE_CONTROL_PC === 'true',
};
