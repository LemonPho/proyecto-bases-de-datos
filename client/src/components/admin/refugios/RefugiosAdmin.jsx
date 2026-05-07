import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRefugios } from "./fetch";

import CrearRefugio from "./CrearRefugio";

export default function RefugiosAdmin() {
  const [refugios, setRefugios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  useEffect(() => {
    fetchRefugios();
  }, []);

  async function fetchRefugios() {
    setErrorMessage("");
    setLoading(true);
    const response = await getRefugios();
    setLoading(false);
    setErrorMessage(response.errorMessage);
    setRefugios(response.data);
  }

  function formatDireccion(direccion) {
    if (!direccion) return "Sin dirección";

    const calle = `${direccion.calle} ${direccion.no_ext}${direccion.no_int ? ` Int. ${direccion.no_int}` : ""
      }`;

    return `${calle}, ${direccion.colonia}, ${direccion.ciudad}, ${direccion.estado}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver al dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              Administración de Refugios
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Visualiza los refugios registrados en el sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            + Nuevo refugio
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              Cargando refugios...
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-red-500">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={fetchRefugios}
                className="mt-4 rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                Reintentar
              </button>
            </div>
          ) : refugios.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              No hay refugios registrados todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-black">Refugio</th>
                    <th className="px-6 py-4 font-black">Contacto</th>
                    <th className="px-6 py-4 font-black">Teléfono</th>
                    <th className="px-6 py-4 font-black">Email</th>
                    <th className="px-6 py-4 font-black">Dirección</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {refugios.map((refugio) => (
                    <tr
                      key={refugio.id}
                      className="transition hover:bg-green-50"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/refugio/${refugio.id}`}
                          className="font-extrabold text-slate-800 hover:text-green-700"
                        >
                          {refugio.nombre}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400">
                          ID: {refugio.id.slice(0, 8)}...
                        </p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-600">
                        {refugio.contacto?.nombre || "Sin contacto"}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {refugio.contacto?.telefono || "Sin teléfono"}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {refugio.contacto?.email || "Sin email"}
                      </td>

                      <td className="max-w-xs px-6 py-4 text-slate-500">
                        {formatDireccion(refugio.contacto?.direccion)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CrearRefugio
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => fetchRefugios()}
      />
    </div>
  );
}