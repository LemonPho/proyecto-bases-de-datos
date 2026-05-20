import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnimales, ESTADOS_ANIMAL } from "./fetch";
import CrearAnimal from "./CrearAnimal";

const ESTADO_COLORES = {
  sano: "bg-green-100 text-green-700",
  enfermo: "bg-red-100 text-red-700",
  en_tratamiento: "bg-amber-100 text-amber-700",
  recuperacion: "bg-blue-100 text-blue-700",
  adoptado: "bg-purple-100 text-purple-700",
  resguardado: "bg-slate-100 text-slate-700",
  fallecido: "bg-zinc-200 text-zinc-700",
};

export default function AnimalesAdmin() {
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    fetchAnimales();
  }, []);

  async function fetchAnimales() {
    setErrorMessage("");
    setLoading(true);
    const response = await getAnimales();
    setLoading(false);
    setErrorMessage(response.errorMessage);
    setAnimales(response.data);
  }

  const animalesFiltrados =
    filtroEstado === "todos"
      ? animales
      : animales.filter((a) => a.estado === filtroEstado);

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
              Administración de Animales
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Gestiona los animales registrados en los refugios.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            + Nuevo animal
          </button>
        </div>

        {!loading && !errorMessage && animales.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {["todos", ...ESTADOS_ANIMAL].map((estado) => (
              <button
                key={estado}
                type="button"
                onClick={() => setFiltroEstado(estado)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition ${
                  filtroEstado === estado
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {estado === "todos" ? "Todos" : estado.replace("_", " ")}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              Cargando animales...
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
              <button
                type="button"
                onClick={fetchAnimales}
                className="mt-4 rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                Reintentar
              </button>
            </div>
          ) : animalesFiltrados.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              {filtroEstado === "todos"
                ? "No hay animales registrados todavía."
                : `No hay animales con estado "${filtroEstado}".`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-black">Nombre</th>
                    <th className="px-6 py-4 font-black">Especie / Raza</th>
                    <th className="px-6 py-4 font-black">Estado</th>
                    <th className="px-6 py-4 font-black">Refugio / Área</th>
                    <th className="px-6 py-4 font-black">Ingreso</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {animalesFiltrados.map((animal) => (
                    <tr
                      key={animal.id}
                      className="transition hover:bg-orange-50"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/animales/${animal.id}`}
                          className="font-extrabold text-slate-800 hover:text-orange-700"
                        >
                          {animal.nombre || "Sin nombre"}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400">
                          ID: {animal.id.slice(0, 8)}...
                        </p>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        <p className="font-semibold capitalize">
                          {animal.raza?.especie?.nombre_especie || "Sin especie"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {animal.raza?.nombre_raza || "Sin raza"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            ESTADO_COLORES[animal.estado] ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {animal.estado.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        <p className="font-semibold">
                          {animal.area?.refugio?.nombre || "Sin refugio"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {animal.area?.nombre_area || "Sin área"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {animal.fecha_ingreso || "Sin fecha"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CrearAnimal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => fetchAnimales()}
      />
    </div>
  );
}
