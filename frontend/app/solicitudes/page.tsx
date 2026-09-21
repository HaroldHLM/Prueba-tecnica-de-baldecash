import SolicitudesTable from '@/components/SolicitudesTable';

export default function SolicitudesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Solicitudes</h1>
      <p className="mt-1 text-sm text-gray-500">
        Listado de solicitudes de financiamiento recibidas.
      </p>
      <div className="mt-6">
        <SolicitudesTable />
      </div>
    </main>
  );
}
