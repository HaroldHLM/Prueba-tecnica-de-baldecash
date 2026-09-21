'use client';

import { useEffect, useState } from 'react';
import { EstadoSolicitud, Solicitud, listarSolicitudes } from '@/lib/api';

const LIMIT = 10;

const ESTADOS: { value: EstadoSolicitud | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'rechazada', label: 'Rechazada' },
];

const COLOR_ESTADO: Record<EstadoSolicitud, string> = {
  pendiente: 'bg-[#fff3d6] text-[#8a6416]',
  aprobada: 'bg-[#e0fbfa] text-[#029b93]',
  rechazada: 'bg-red-100 text-red-800',
};

export default function SolicitudesTable() {
  const [data, setData] = useState<Solicitud[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [estado, setEstado] = useState<EstadoSolicitud | ''>('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError('');

    listarSolicitudes({ page, limit: LIMIT, estado })
      .then((res) => {
        if (cancelado) return;
        setData(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelado) return;
        setError(err instanceof Error ? err.message : 'Error al cargar el listado');
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [page, estado]);

  const totalPaginas = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <select
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value as EstadoSolicitud | '');
            setPage(1);
          }}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#03dbd0] focus:outline-none focus:ring-1 focus:ring-[#03dbd0]"
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-600">{total} solicitudes en total</span>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <Th>Nombre</Th>
              <Th>DNI</Th>
              <Th>Monto</Th>
              <Th>Plazo</Th>
              <Th>Cuota</Th>
              <Th>Estado</Th>
              <Th>Fecha</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {cargando ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No hay solicitudes para este filtro.
                </td>
              </tr>
            ) : (
              data.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 text-slate-800">{s.nombreCompleto}</td>
                  <td className="px-4 py-3 text-slate-800">{s.dni}</td>
                  <td className="px-4 py-3 text-slate-800">S/ {s.monto.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-800">{s.plazoMeses} meses</td>
                  <td className="px-4 py-3 text-slate-800">S/ {s.cuotaMensual.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${COLOR_ESTADO[s.estado]}`}
                    >
                      {s.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(s.createdAt).toLocaleDateString('es-PE')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="rounded-md border border-slate-300 px-3 py-1.5 hover:border-[#03dbd0] disabled:opacity-40 disabled:hover:border-slate-300"
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPaginas}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPaginas, p + 1))}
          disabled={page >= totalPaginas}
          className="rounded-md border border-slate-300 px-3 py-1.5 hover:border-[#03dbd0] disabled:opacity-40 disabled:hover:border-slate-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-600">
      {children}
    </th>
  );
}
