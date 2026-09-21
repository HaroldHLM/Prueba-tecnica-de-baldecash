import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ESTADOS_VALIDOS } from '../estados.constant.js';
import type { EstadoSolicitud } from '../estados.constant.js';

export class QuerySolicitudesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page debe ser un número entero' })
  @Min(1, { message: 'page debe ser mayor o igual a 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit debe ser un número entero' })
  @Min(1, { message: 'limit debe ser mayor o igual a 1' })
  @Max(100, { message: 'limit no debe superar 100' })
  limit: number = 10;

  @IsOptional()
  @IsIn(ESTADOS_VALIDOS, {
    message: 'estado debe ser pendiente, aprobada o rechazada',
  })
  estado?: EstadoSolicitud;
}
