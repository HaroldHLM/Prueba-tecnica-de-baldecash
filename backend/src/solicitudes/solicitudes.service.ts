import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { calcularCuotaMensual } from '../common/calcular-cuota.util.js';
import { TASA_INTERES_ANUAL } from '../common/config.js';
import { CreateSolicitudDto } from './dto/create-solicitud.dto.js';
import { QuerySolicitudesDto } from './dto/query-solicitudes.dto.js';
import { UpdateEstadoDto } from './dto/update-estado.dto.js';
import { Prisma } from '../generated/prisma/client.js';

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
    const cuotaMensual = calcularCuotaMensual(
      dto.monto,
      dto.plazoMeses,
      TASA_INTERES_ANUAL,
    );

    const solicitud = await this.prisma.solicitud.create({
      data: { ...dto, cuotaMensual },
    });

    return serializar(solicitud);
  }

  async updateEstado(id: number, dto: UpdateEstadoDto) {
    try {
      const solicitud = await this.prisma.solicitud.update({
        where: { id },
        data: { estado: dto.estado },
      });
      return serializar(solicitud);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`No existe una solicitud con id ${id}`);
      }
      throw error;
    }
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
