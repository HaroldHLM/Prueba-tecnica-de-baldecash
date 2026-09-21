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
