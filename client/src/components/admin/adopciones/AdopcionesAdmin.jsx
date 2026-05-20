import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSolicitudes, ESTATUS_SOLICITUD } from "./fetch";
import CrearSolicitud from "./CrearSolicitud";

const ESTATUS_COLORES = {
  pendiente: "bg-amber-100 text-amber-700",
  en_revision: "bg-blue-100 text-blue-700",
  aprobada: "bg-green-100 text-green-700",
  rechazada: "bg-red-100 text-red-700",
  cancelada: "bg-slate-200 text-slate-600",
};

export default function AdopcionesAdmin() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filtroEstatus, setFiltroEstatus] = useState("todos");

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  async function fetchSolicitudes() {
    setErrorMessage("");
    setLoading(true);
    const response = await getSolicitudes();
    setLoading(false);
    setErrorMessage(response.errorMessage);
    setSolicitudes(response.data);
  }

  const solicitudesFiltradas =
    filtroEstatus === "todos"
      ? solicitudes
      : solicitudes.filter((s) => s.estatus === filtroEstatus);

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
              Solicitudes de Adopción
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Gestiona las solicitudes y adopciones formalizadas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            + Nueva solicitud
          </button>
        </div>

        {!loading && !errorMessage && solicitudes.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {["todos", ...ESTATUS_SOLICITUD].map((estatus) => (
              <button
                key={estatus}
                type="button"
                onClick={() => setFiltroEstatus(estatus)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition ${
                  filtroEstatus === estatus
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {estatus === "todos" ? "Todos" : estatus.replace("_", " ")}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              Cargando solicitudes...
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
              <button
                type="button"
                onClick={fetchSolicitudes}
                className="mt-4 rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                Reintentar
              </button>
            </div>
          ) : solicitudesFiltradas.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              {filtroEstatus === "todos"
                ? "No hay solicitudes registradas todavía."
                : `No hay solicitudes con estatus "${filtroEstatus}".`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-black">Animal</th>
                    <th className="px-6 py-4 font-black">Adoptante</th>
                    <th className="px-6 py-4 font-black">Fecha</th>
                    <th className="px-6 py-4 font-black">Estatus</th>
                    <th className="px-6 py-4 font-black">Adopción</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {solicitudesFiltradas.map((solicitud) => {
                    const adopcionFormalizada = Array.isArray(solicitud.adopcion)
                      ? solicitud.adopcion[0]
                      : solicitud.adopcion;

                    return (
                      <tr
                        key={solicitud.id}
                        className="transition hover:bg-purple-50"
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/adopciones/${solicitud.id}`}
                            className="font-extrabold text-slate-800 hover:text-purple-700"
                          >
                            {solicitud.animal?.nombre || "Sin nombre"}
                          </Link>
                          <p className="mt-1 text-xs text-slate-400 capitalize">
                            {solicitud.animal?.raza?.especie?.nombre_especie || ""} -{" "}
                            {solicitud.animal?.raza?.nombre_raza || ""}
                          </p>
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-600">
                          {solicitud.adoptante?.contacto?.nombre || "Sin nombre"}
                          <p className="mt-1 text-xs font-normal text-slate-400">
                            {solicitud.adoptante?.contacto?.email || ""}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {solicitud.fecha_solicitud}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              ESTATUS_COLORES[solicitud.estatus] ??
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {solicitud.estatus.replace("_", " ")}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {adopcionFormalizada ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              Formalizada
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CrearSolicitud
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => fetchSolicitudes()}
      />
    </div>
  );
}
