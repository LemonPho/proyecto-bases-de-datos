import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRescates } from "./fetch";
import CrearRescate from "./CrearRescate";

export default function RescatesAdmin() {
  const [rescates, setRescates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchRescates();
  }, []);

  async function fetchRescates() {
    setErrorMessage("");
    setLoading(true);
    const response = await getRescates();
    setLoading(false);
    setErrorMessage(response.errorMessage);
    setRescates(response.data);
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
              Administración de Rescates
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Registra los rescates de animales realizados por los rescatistas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            + Nuevo rescate
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              Cargando rescates...
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
              <button
                type="button"
                onClick={fetchRescates}
                className="mt-4 rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                Reintentar
              </button>
            </div>
          ) : rescates.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              No hay rescates registrados todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-black">Animal</th>
                    <th className="px-6 py-4 font-black">Rescatista</th>
                    <th className="px-6 py-4 font-black">Fecha</th>
                    <th className="px-6 py-4 font-black">Lugar</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {rescates.map((rescate) => (
                    <tr key={rescate.id} className="transition hover:bg-red-50">
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/rescates/${rescate.id}`}
                          className="font-extrabold text-slate-800 hover:text-red-700"
                        >
                          {rescate.animal?.nombre || "Sin nombre"}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400 capitalize">
                          {rescate.animal?.raza?.especie?.nombre_especie || ""} -{" "}
                          {rescate.animal?.raza?.nombre_raza || ""}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-600">
                        {rescate.rescatista?.contacto?.nombre || "Sin nombre"}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {rescate.fecha_rescate || "Sin fecha"}
                      </td>

                      <td className="max-w-xs px-6 py-4 text-slate-500">
                        {rescate.lugar_rescate || "Sin lugar registrado"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CrearRescate
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => fetchRescates()}
      />
    </div>
  );
}
