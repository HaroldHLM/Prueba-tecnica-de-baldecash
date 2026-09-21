const tasaDesdeEnv = Number(process.env.TASA_INTERES_ANUAL);

export const TASA_INTERES_ANUAL =
  Number.isFinite(tasaDesdeEnv) && tasaDesdeEnv > 0 ? tasaDesdeEnv : 0.24;
