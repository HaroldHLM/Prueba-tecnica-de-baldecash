import { describe, expect, it } from 'vitest';
import { calcularCuotaMensual } from './calcular-cuota.util.js';

describe('calcularCuotaMensual', () => {
  it('calcula la cuota del ejemplo del enunciado: P=3000, n=12 -> S/ 283.68', () => {
    expect(calcularCuotaMensual(3000, 12)).toBe(283.68);
  });

  it('calcula correctamente para el plazo mínimo (6 meses)', () => {
    expect(calcularCuotaMensual(1000, 6)).toBe(178.53);
  });

  it('calcula correctamente para el plazo máximo (24 meses)', () => {
    expect(calcularCuotaMensual(10000, 24)).toBe(528.71);
  });

  it('redondea siempre a 2 decimales', () => {
    const cuota = calcularCuotaMensual(4500, 18);
    const decimales = cuota.toString().split('.')[1]?.length ?? 0;
    expect(decimales).toBeLessThanOrEqual(2);
  });

  it('a mayor plazo, la cuota mensual es menor (para el mismo monto)', () => {
    const cuota12 = calcularCuotaMensual(5000, 12);
    const cuota24 = calcularCuotaMensual(5000, 24);
    expect(cuota24).toBeLessThan(cuota12);
  });
});
