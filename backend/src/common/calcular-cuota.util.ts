/**
 * Calcula la cuota mensual fija usando el sistema de amortización francés.
 *
 * cuota = P * (i * (1 + i)^n) / ((1 + i)^n - 1)
 *
 * @param monto Monto financiado (P), en soles.
 * @param plazoMeses Número de cuotas (n).
 * @param tasaAnual Tasa de interés anual. Por defecto 24% (0.24).
 * @returns Cuota mensual redondeada a 2 decimales.
 */
export function calcularCuotaMensual(
  monto: number,
  plazoMeses: number,
  tasaAnual = 0.24,
): number {
  const i = tasaAnual / 12;
  const factor = Math.pow(1 + i, plazoMeses);
  const cuota = (monto * i * factor) / (factor - 1);
  return Math.round(cuota * 100) / 100;
}
