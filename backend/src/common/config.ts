/**
 * Tasa de interés anual usada para calcular la cuota mensual.
 * Configurable vía la variable de entorno TASA_INTERES_ANUAL (ej. "0.24" = 24%).
 * Si no está definida, o no es un número válido, se usa 24% por defecto.
 */
const tasaDesdeEnv = Number(process.env.TASA_INTERES_ANUAL);

export const TASA_INTERES_ANUAL =
  Number.isFinite(tasaDesdeEnv) && tasaDesdeEnv > 0 ? tasaDesdeEnv : 0.24;
