import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

const PLAZOS_VALIDOS = [6, 12, 18, 24] as const;

export class CreateSolicitudDto {
  @IsString({ message: 'El nombre completo debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  nombreCompleto!: string;

  @Matches(/^\d{8}$/, { message: 'El DNI debe tener exactamente 8 dígitos numéricos' })
  dni!: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  correo!: string;

  @Matches(/^9\d{8}$/, {
    message: 'El teléfono debe tener 9 dígitos y empezar en 9',
  })
  telefono!: string;

  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(1000, { message: 'El monto mínimo es S/ 1,000' })
  @Max(10000, { message: 'El monto máximo es S/ 10,000' })
  monto!: number;

  @IsIn(PLAZOS_VALIDOS, { message: 'El plazo debe ser 6, 12, 18 o 24 meses' })
  plazoMeses!: number;
}
