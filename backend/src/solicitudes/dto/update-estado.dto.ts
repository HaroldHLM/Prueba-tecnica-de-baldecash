import { IsIn } from 'class-validator';

const ESTADOS_VALIDOS = ['pendiente', 'aprobada', 'rechazada'] as const;

export class UpdateEstadoDto {
  @IsIn(ESTADOS_VALIDOS, {
    message: 'estado debe ser pendiente, aprobada o rechazada',
  })
  estado!: (typeof ESTADOS_VALIDOS)[number];
}
