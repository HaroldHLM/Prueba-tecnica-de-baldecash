import SolicitudForm from '@/components/SolicitudForm';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Solicitud de financiamiento</h1>
      <p className="mt-1 text-sm text-slate-600">
        Completa tus datos para conocer tu cuota mensual.
      </p>
      <div className="mt-6">
        <SolicitudForm />
      </div>
    </main>
  );
}
