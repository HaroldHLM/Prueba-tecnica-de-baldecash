import { IsIn } from 'class-validator';
import { ESTADOS_VALIDOS } from '../estados.constant.js';
import type { EstadoSolicitud } from '../estados.constant.js';

export class UpdateEstadoDto {
  @IsIn(ESTADOS_VALIDOS, {
    message: 'estado debe ser pendiente, aprobada o rechazada',
  })
  estado!: EstadoSolicitud;
}
