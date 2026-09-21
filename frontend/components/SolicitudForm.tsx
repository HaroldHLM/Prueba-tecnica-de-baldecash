'use client';

import { FormEvent, useState } from 'react';
import {
  ApiValidationError,
  CreateSolicitudInput,
  Solicitud,
  crearSolicitud,
} from '@/lib/api';

const PLAZOS_DISPONIBLES = [6, 12, 18, 24];

const FORM_INICIAL = {
  nombreCompleto: '',
  dni: '',
  correo: '',
  telefono: '',
  monto: '',
  plazoMeses: '12',
};

type Estado = 'idle' | 'cargando' | 'error' | 'exito';

export default function SolicitudForm() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [estado, setEstado] = useState<Estado>('idle');
  const [erroresPorCampo, setErroresPorCampo] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [solicitudCreada, setSolicitudCreada] = useState<Solicitud | null>(null);

  function actualizarCampo(campo: keyof typeof form, valor: string) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEstado('cargando');
    setErroresPorCampo({});
    setErrorGeneral('');

    const input: CreateSolicitudInput = {
      nombreCompleto: form.nombreCompleto,
      dni: form.dni,
      correo: form.correo,
      telefono: form.telefono,
      monto: Number(form.monto),
      plazoMeses: Number(form.plazoMeses),
    };

    try {
      const creada = await crearSolicitud(input);
      setSolicitudCreada(creada);
      setEstado('exito');
    } catch (err) {
      setEstado('error');
      if (err instanceof ApiValidationError) {
        const mapa: Record<string, string> = {};
        for (const e of err.errores) mapa[e.campo] = e.motivo;
        setErroresPorCampo(mapa);
      } else {
        setErrorGeneral(
          err instanceof Error
            ? err.message
            : 'Ocurrió un error inesperado. Intenta de nuevo.',
        );
      }
    }
  }

  function enviarOtraSolicitud() {
    setForm(FORM_INICIAL);
    setSolicitudCreada(null);
    setEstado('idle');
  }

  if (estado === 'exito' && solicitudCreada) {
    return (
      <div className="rounded-lg border border-[#03dbd0]/40 bg-[#e0fbfa] p-6 text-center">
        <p className="text-sm font-medium text-[#029b93]">
          Solicitud enviada correctamente
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          S/ {solicitudCreada.cuotaMensual.toFixed(2)}
          <span className="text-base font-normal text-slate-600"> / mes</span>
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {solicitudCreada.plazoMeses} cuotas · Estado: {solicitudCreada.estado}
        </p>
        <button
          onClick={enviarOtraSolicitud}
          className="mt-4 rounded-md bg-[#029b93] px-4 py-2 text-sm font-medium text-white hover:bg-[#027d76]"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Campo
        label="Nombre completo"
        value={form.nombreCompleto}
        onChange={(v) => actualizarCampo('nombreCompleto', v)}
        error={erroresPorCampo.nombreCompleto}
      />
      <Campo
        label="DNI"
        value={form.dni}
        onChange={(v) => actualizarCampo('dni', v)}
        error={erroresPorCampo.dni}
        placeholder="8 dígitos"
      />
      <Campo
        label="Correo electrónico"
        type="email"
        value={form.correo}
        onChange={(v) => actualizarCampo('correo', v)}
        error={erroresPorCampo.correo}
      />
      <Campo
        label="Teléfono"
        value={form.telefono}
        onChange={(v) => actualizarCampo('telefono', v)}
        error={erroresPorCampo.telefono}
        placeholder="9 dígitos, empieza en 9"
      />
      <Campo
        label="Monto a financiar (S/)"
        type="number"
        value={form.monto}
        onChange={(v) => actualizarCampo('monto', v)}
        error={erroresPorCampo.monto}
        placeholder="Entre 1,000 y 10,000"
      />

      <div>
        <label className="block text-sm font-medium text-slate-800">Plazo</label>
        <select
          value={form.plazoMeses}
          onChange={(e) => actualizarCampo('plazoMeses', e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#03dbd0] focus:outline-none focus:ring-1 focus:ring-[#03dbd0]"
        >
          {PLAZOS_DISPONIBLES.map((p) => (
            <option key={p} value={p}>
              {p} meses
            </option>
          ))}
        </select>
        {erroresPorCampo.plazoMeses && (
          <p className="mt-1 text-sm text-red-600">{erroresPorCampo.plazoMeses}</p>
        )}
      </div>

      {errorGeneral && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorGeneral}</p>
      )}

      <button
        type="submit"
        disabled={estado === 'cargando'}
        className="w-full rounded-md bg-[#029b93] px-4 py-2 text-sm font-medium text-white hover:bg-[#027d76] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {estado === 'cargando' ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}

function Campo({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
            : 'border-slate-300 focus:border-[#03dbd0] focus:ring-[#03dbd0]'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
