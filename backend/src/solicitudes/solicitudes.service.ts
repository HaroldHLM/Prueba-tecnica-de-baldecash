import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { calcularCuotaMensual } from '../common/calcular-cuota.util.js';
import { CreateSolicitudDto } from './dto/create-solicitud.dto.js';
import { QuerySolicitudesDto } from './dto/query-solicitudes.dto.js';

/**
 * Prisma devuelve `monto` y `cuotaMensual` como Decimal (para no perder precisión
 * en la base de datos). Los convertimos a `number` solo al salir por la API,
 * que es la forma en que el frontend los espera.
 */
function serializar(solicitud: {
  monto: { toNumber(): number };
  cuotaMensual: { toNumber(): number };
  [key: string]: unknown;
}) {
  return {
    ...solicitud,
    monto: solicitud.monto.toNumber(),
    cuotaMensual: solicitud.cuotaMensual.toNumber(),
  };
}

@Injectable()
export class SolicitudesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSolicitudDto) {
    const cuotaMensual = calcularCuotaMensual(dto.monto, dto.plazoMeses);

    const solicitud = await this.prisma.solicitud.create({
      data: { ...dto, cuotaMensual },
    });

    return serializar(solicitud);
  }

  async findAll(query: QuerySolicitudesDto) {
    const { page, limit, estado } = query;

    const where = estado ? { estado } : {};

    const [data, total] = await Promise.all([
      this.prisma.solicitud.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.solicitud.count({ where }),
    ]);

    return {
      data: data.map(serializar),
      total,
      page,
      limit,
    };
  }
}
