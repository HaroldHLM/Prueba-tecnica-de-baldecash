export const ESTADOS_VALIDOS = ['pendiente', 'aprobada', 'rechazada'] as const;

export type EstadoSolicitud = (typeof ESTADOS_VALIDOS)[number];
