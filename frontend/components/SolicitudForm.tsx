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
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-sm font-medium text-green-800">
          Solicitud enviada correctamente
        </p>
        <p className="mt-2 text-3xl font-bold text-green-900">
          S/ {solicitudCreada.cuotaMensual.toFixed(2)}
          <span className="text-base font-normal text-green-700"> / mes</span>
        </p>
        <p className="mt-1 text-sm text-green-700">
          {solicitudCreada.plazoMeses} cuotas · Estado: {solicitudCreada.estado}
        </p>
        <button
          onClick={enviarOtraSolicitud}
          className="mt-4 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
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
        <label className="block text-sm font-medium text-gray-700">Plazo</label>
        <select
          value={form.plazoMeses}
          onChange={(e) => actualizarCampo('plazoMeses', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
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
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
