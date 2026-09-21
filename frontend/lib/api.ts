const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada';

export interface Solicitud {
  id: number;
  nombreCompleto: string;
  dni: string;
  correo: string;
  telefono: string;
  monto: number;
  plazoMeses: number;
  cuotaMensual: number;
  estado: EstadoSolicitud;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSolicitudInput {
  nombreCompleto: string;
  dni: string;
  correo: string;
  telefono: string;
  monto: number;
  plazoMeses: number;
}

export interface ErrorDeCampo {
  campo: string;
  motivo: string;
}

/** Error de validación (422): trae el detalle campo por campo que devuelve el backend. */
export class ApiValidationError extends Error {
  errores: ErrorDeCampo[];

  constructor(errores: ErrorDeCampo[]) {
    super('Error de validación');
    this.name = 'ApiValidationError';
    this.errores = errores;
  }
}

export async function crearSolicitud(
  input: CreateSolicitudInput,
): Promise<Solicitud> {
  const res = await fetch(`${API_URL}/solicitudes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const body = await res.json();

  if (!res.ok) {
    if (res.status === 422 && Array.isArray(body.errores)) {
      throw new ApiValidationError(body.errores);
    }
    throw new Error(body.message ?? 'Ocurrió un error al enviar la solicitud');
  }

  return body as Solicitud;
}

export interface ListaSolicitudes {
  data: Solicitud[];
  total: number;
  page: number;
  limit: number;
}

export async function listarSolicitudes(params: {
  page: number;
  limit: number;
  estado?: EstadoSolicitud | '';
}): Promise<ListaSolicitudes> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.estado) query.set('estado', params.estado);

  const res = await fetch(`${API_URL}/solicitudes?${query.toString()}`);

  if (!res.ok) {
    throw new Error('No se pudo cargar el listado de solicitudes');
  }

  return res.json() as Promise<ListaSolicitudes>;
}
