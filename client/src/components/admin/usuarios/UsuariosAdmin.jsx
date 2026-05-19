import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsuarios } from "./fetch";
import CrearUsuario from "./CrearUsuario";

const TIPO_COLORES = {
  adoptante: "bg-blue-100 text-blue-700",
  empleado: "bg-green-100 text-green-700",
  voluntario: "bg-yellow-100 text-yellow-700",
  donante: "bg-purple-100 text-purple-700",
  rescatista: "bg-orange-100 text-orange-700",
  refugio: "bg-slate-100 text-slate-700",
};

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    setErrorMessage("");
    setLoading(true);
    const response = await getUsuarios();
    setLoading(false);
    setErrorMessage(response.errorMessage);
    setUsuarios(response.data);
  }

  function formatDireccion(direccion) {
    if (!direccion) return "Sin dirección";
    return `${direccion.calle} ${direccion.no_ext}, ${direccion.colonia}, ${direccion.ciudad}`;
  }

  const tiposUnicos = ["todos", ...new Set(usuarios.map((u) => u.tipo_usuario))];

  const usuariosFiltrados =
    filtroTipo === "todos"
      ? usuarios
      : usuarios.filter((u) => u.tipo_usuario === filtroTipo);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver al dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              Administración de Usuarios
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Gestiona los contactos y roles registrados en el sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            + Nuevo usuario
          </button>
        </div>

        {/* Filtro por tipo */}
        {!loading && !errorMessage && usuarios.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {tiposUnicos.map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setFiltroTipo(tipo)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition ${
                  filtroTipo === tipo
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {tipo === "todos" ? "Todos" : tipo}
              </button>
            ))}
          </div>
        )}

        {/* Tabla */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              Cargando usuarios...
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
              <button
                type="button"
                onClick={fetchUsuarios}
                className="mt-4 rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                Reintentar
              </button>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              {filtroTipo === "todos"
                ? "No hay usuarios registrados todavía."
                : `No hay usuarios con el tipo "${filtroTipo}".`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-black">Nombre</th>
                    <th className="px-6 py-4 font-black">Tipo</th>
                    <th className="px-6 py-4 font-black">Teléfono</th>
                    <th className="px-6 py-4 font-black">Email</th>
                    <th className="px-6 py-4 font-black">Dirección</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {usuariosFiltrados.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="transition hover:bg-blue-50"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/usuario/${usuario.id}`}
                          className="font-extrabold text-slate-800 hover:text-blue-700"
                        >
                          {usuario.nombre}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400">
                          ID: {usuario.id.slice(0, 8)}...
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            TIPO_COLORES[usuario.tipo_usuario] ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {usuario.tipo_usuario}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {usuario.telefono || "Sin teléfono"}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {usuario.email || "Sin email"}
                      </td>

                      <td className="max-w-xs px-6 py-4 text-slate-500">
                        {formatDireccion(usuario.direccion)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CrearUsuario
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => fetchUsuarios()}
      />
    </div>
  );
}
