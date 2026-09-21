import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { calcularCuotaMensual } from '../src/common/calcular-cuota.util.js';
import { TASA_INTERES_ANUAL } from '../src/common/config.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

const solicitudes = [
  {
    nombreCompleto: 'Ana Pérez',
    dni: '12345678',
    correo: 'ana.perez@example.com',
    telefono: '987654321',
    monto: 3000,
    plazoMeses: 12,
    estado: 'pendiente' as const,
  },
  {
    nombreCompleto: 'Luis García',
    dni: '87654321',
    correo: 'luis.garcia@example.com',
    telefono: '912345678',
    monto: 5000,
    plazoMeses: 18,
    estado: 'aprobada' as const,
  },
  {
    nombreCompleto: 'María Torres',
    dni: '11223344',
    correo: 'maria.torres@example.com',
    telefono: '998877665',
    monto: 1500,
    plazoMeses: 6,
    estado: 'rechazada' as const,
  },
];

async function main() {
  // Idempotente: si ya hay datos, no vuelve a insertar (importante para que el
  // seed se pueda correr varias veces sin duplicar, ej. al reiniciar el contenedor
  // de Docker).
  const existentes = await prisma.solicitud.count();
  if (existentes > 0) {
    console.log(`Ya existen ${existentes} solicitudes. Seed omitido.`);
    return;
  }

  for (const s of solicitudes) {
    await prisma.solicitud.create({
      data: { ...s, cuotaMensual: calcularCuotaMensual(s.monto, s.plazoMeses, TASA_INTERES_ANUAL) },
    });
  }
  console.log(`Seed completado: ${solicitudes.length} solicitudes creadas.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
