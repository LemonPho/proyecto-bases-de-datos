import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmpleados, ESTATUS_EMPLEADO } from "./fetch";
import CrearEmpleado from "./CrearEmpleado";

const ESTATUS_COLORES = {
  activo: "bg-green-100 text-green-700",
  inactivo: "bg-slate-200 text-slate-600",
  vacaciones: "bg-blue-100 text-blue-700",
  suspendido: "bg-amber-100 text-amber-700",
  baja: "bg-red-100 text-red-700",
};

function formatMonto(valor) {
  if (valor === null || valor === undefined) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(valor);
}

export default function RecursosAdmin() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filtroRefugio, setFiltroRefugio] = useState("todos");
  const [filtroEstatus, setFiltroEstatus] = useState("todos");

  useEffect(() => {
    fetchEmpleados();
  }, []);

  async function fetchEmpleados() {
    setErrorMessage("");
    setLoading(true);
    const response = await getEmpleados();
    setLoading(false);
    setErrorMessage(response.errorMessage);
    setEmpleados(response.data);
  }

  const refugiosUnicos = [
    "todos",
    ...new Set(empleados.map((e) => e.refugio?.nombre).filter(Boolean)),
  ];

  const empleadosFiltrados = empleados.filter((e) => {
    const matchRefugio =
      filtroRefugio === "todos" || e.refugio?.nombre === filtroRefugio;
    const matchEstatus =
      filtroEstatus === "todos" || e.estatus === filtroEstatus;
    return matchRefugio && matchEstatus;
  });

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
              Recursos Humanos
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Gestiona los empleados y su información laboral.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            + Nuevo empleado
          </button>
        </div>

        {!loading && !errorMessage && empleados.length > 0 && (
          <div className="mb-5 space-y-3">
            {refugiosUnicos.length > 2 && (
              <div className="flex flex-wrap gap-2">
                <span className="self-center text-xs font-black uppercase tracking-widest text-slate-400">
                  Refugio:
                </span>
                {refugiosUnicos.map((nombre) => (
                  <button
                    key={nombre}
                    type="button"
                    onClick={() => setFiltroRefugio(nombre)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      filtroRefugio === nombre
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {nombre === "todos" ? "Todos" : nombre}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="self-center text-xs font-black uppercase tracking-widest text-slate-400">
                Estatus:
              </span>
              {["todos", ...ESTATUS_EMPLEADO].map((estatus) => (
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
                  {estatus === "todos" ? "Todos" : estatus}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              Cargando empleados...
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
              <button
                type="button"
                onClick={fetchEmpleados}
                className="mt-4 rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                Reintentar
              </button>
            </div>
          ) : empleadosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              No hay empleados registrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-black">Nombre</th>
                    <th className="px-6 py-4 font-black">Cargo</th>
                    <th className="px-6 py-4 font-black">Refugio</th>
                    <th className="px-6 py-4 font-black">Estatus</th>
                    <th className="px-6 py-4 font-black">Sueldo</th>
                    <th className="px-6 py-4 font-black">Contacto</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {empleadosFiltrados.map((empleado) => {
                    const sueldo = Array.isArray(empleado.sueldos)
                      ? empleado.sueldos[0]
                      : empleado.sueldos;
                    return (
                      <tr
                        key={empleado.id}
                        className="transition hover:bg-pink-50"
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/recursos/${empleado.id}`}
                            className="font-extrabold text-slate-800 hover:text-pink-700"
                          >
                            {empleado.contacto?.nombre || "Sin nombre"}
                          </Link>
                          <p className="mt-1 text-xs text-slate-400">
                            ID: {empleado.id.slice(0, 8)}...
                          </p>
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-600">
                          {empleado.cargo?.nombre_cargo || "Sin cargo"}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {empleado.refugio?.nombre || "Sin refugio"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              ESTATUS_COLORES[empleado.estatus] ??
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {empleado.estatus || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-bold text-slate-700">
                          {sueldo ? formatMonto(sueldo.sueldo) : "—"}
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {empleado.contacto?.email || empleado.contacto?.telefono || "—"}
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

      <CrearEmpleado
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => fetchEmpleados()}
      />
    </div>
  );
}
