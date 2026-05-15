import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUsuarioById, updateUsuario, TIPOS_USUARIO } from "./fetch";

const TIPO_COLORES = {
  adoptante: "bg-blue-100 text-blue-700",
  empleado: "bg-green-100 text-green-700",
  voluntario: "bg-yellow-100 text-yellow-700",
  donante: "bg-purple-100 text-purple-700",
  rescatista: "bg-orange-100 text-orange-700",
  refugio: "bg-slate-100 text-slate-700",
};

export default function UsuarioDetalles() {
  const { id } = useParams();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipoUsuario: "adoptante",
    tipoUsuarioAnterior: "adoptante",
    direccionId: "",
    calle: "",
    noExt: "",
    noInt: "",
    colonia: "",
    ciudad: "",
    estado: "",
    pais: "",
  });

  useEffect(() => {
    fetchUsuario();
  }, [id]);

  async function fetchUsuario() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getUsuarioById(id);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        setUsuario(null);
      } else {
        setUsuario(response.data);
        loadFormData(response.data);
      }
    } catch (error) {
      console.error("Error inesperado cargando usuario:", error);
      setErrorMessage("Ocurrió un error inesperado cargando el usuario.");
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }

  function loadFormData(usuarioData) {
    const direccion = usuarioData.direccion;

    setFormData({
      nombre: usuarioData.nombre || "",
      telefono: usuarioData.telefono || "",
      email: usuarioData.email || "",
      tipoUsuario: usuarioData.tipo_usuario || "adoptante",
      tipoUsuarioAnterior: usuarioData.tipo_usuario || "adoptante",
      direccionId: direccion?.id || "",
      calle: direccion?.calle || "",
      noExt: direccion?.no_ext || "",
      noInt: direccion?.no_int || "",
      colonia: direccion?.colonia || "",
      ciudad: direccion?.ciudad || "",
      estado: direccion?.estado || "",
      pais: direccion?.pais || "México",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleEditClick() {
    loadFormData(usuario);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(usuario);
    setEditErrorMessage("");
    setIsEditing(false);
  }

  async function handleSaveEdit(event) {
    event.preventDefault();
    setSaving(true);
    setEditErrorMessage("");

    try {
      const response = await updateUsuario(id, formData);

      if (response.errorMessage) {
        setEditErrorMessage(response.errorMessage);
        return;
      }

      setUsuario(response.data);
      loadFormData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error inesperado actualizando usuario:", error);
      setEditErrorMessage("Ocurrió un error inesperado actualizando el usuario.");
    } finally {
      setSaving(false);
    }
  }

  function formatDireccion(direccion) {
    if (!direccion) return "Sin dirección registrada";
    const calle = `${direccion.calle} ${direccion.no_ext}${
      direccion.no_int ? ` Int. ${direccion.no_int}` : ""
    }`;
    return `${calle}, ${direccion.colonia}, ${direccion.ciudad}, ${direccion.estado}, ${direccion.pais}`;
  }

  // ── Estados de carga / error ──────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Cargando información del usuario...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={fetchUsuario}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Reintentar
            </button>
            <Link
              to="/admin/usuario"
              className="rounded-full px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          No se encontró el usuario.
        </div>
      </div>
    );
  }

  const direccion = usuario.direccion;

  // ── Render principal ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin/usuario"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver a usuarios
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              {usuario.nombre}
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Detalles del usuario registrado en el sistema.
            </p>
          </div>

          {isEditing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="rounded-full px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="usuario-edit-form"
                disabled={saving}
                className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSaveEdit}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEditClick}
              className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
            >
              Editar usuario
            </button>
          )}
        </div>

        <form id="usuario-edit-form">
          {editErrorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {editErrorMessage}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Información principal */}
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
              <h2 className="text-lg font-extrabold text-slate-800">
                Información personal
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoItem
                  label="Nombre completo"
                  value={usuario.nombre}
                  isEditing={isEditing}
                  name="nombre"
                  formValue={formData.nombre}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />

                <InfoItem label="ID" value={usuario.id} />

                <InfoItem
                  label="Teléfono"
                  value={usuario.telefono || "Sin teléfono"}
                  isEditing={isEditing}
                  name="telefono"
                  formValue={formData.telefono}
                  onChange={handleInputChange}
                  maxLength={10}
                />

                <InfoItem
                  label="Email"
                  value={usuario.email || "Sin email"}
                  isEditing={isEditing}
                  name="email"
                  formValue={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  maxLength={100}
                />
              </div>
            </section>

            {/* Resumen / Rol */}
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-extrabold text-slate-800">Rol</h2>

              <div className="mt-6 space-y-4">
                {isEditing ? (
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Tipo de usuario
                    </label>
                    <select
                      name="tipoUsuario"
                      value={formData.tipoUsuario}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500 capitalize"
                    >
                      {TIPOS_USUARIO.map((tipo) => (
                        <option key={tipo} value={tipo} className="capitalize">
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </option>
                      ))}
                    </select>

                    {formData.tipoUsuario !== formData.tipoUsuarioAnterior && (
                      <p className="mt-2 text-xs font-semibold text-amber-600">
                        ⚠ Al cambiar el tipo de usuario se actualizará su tabla de rol.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl p-4" style={{ background: "" }}>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Tipo de usuario
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        TIPO_COLORES[usuario.tipo_usuario] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {usuario.tipo_usuario}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Dirección */}
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
              <h2 className="text-lg font-extrabold text-slate-800">Dirección</h2>

              <p className="mt-2 text-sm font-medium text-slate-400">
                {formatDireccion(direccion)}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InfoItem
                  label="Calle"
                  value={direccion?.calle || "Sin calle"}
                  isEditing={isEditing}
                  name="calle"
                  formValue={formData.calle}
                  onChange={handleInputChange}
                  maxLength={50}
                />

                <InfoItem
                  label="No. exterior"
                  value={direccion?.no_ext || "Sin número"}
                  isEditing={isEditing}
                  name="noExt"
                  formValue={formData.noExt}
                  onChange={handleInputChange}
                  maxLength={10}
                />

                <InfoItem
                  label="No. interior"
                  value={direccion?.no_int || "Sin número interior"}
                  isEditing={isEditing}
                  name="noInt"
                  formValue={formData.noInt}
                  onChange={handleInputChange}
                  maxLength={10}
                />

                <InfoItem
                  label="Colonia"
                  value={direccion?.colonia || "Sin colonia"}
                  isEditing={isEditing}
                  name="colonia"
                  formValue={formData.colonia}
                  onChange={handleInputChange}
                  maxLength={50}
                />

                <InfoItem
                  label="Ciudad"
                  value={direccion?.ciudad || "Sin ciudad"}
                  isEditing={isEditing}
                  name="ciudad"
                  formValue={formData.ciudad}
                  onChange={handleInputChange}
                  maxLength={50}
                />

                <InfoItem
                  label="Estado"
                  value={direccion?.estado || "Sin estado"}
                  isEditing={isEditing}
                  name="estado"
                  formValue={formData.estado}
                  onChange={handleInputChange}
                  maxLength={30}
                />

                <InfoItem
                  label="País"
                  value={direccion?.pais || "Sin país"}
                  isEditing={isEditing}
                  name="pais"
                  formValue={formData.pais}
                  onChange={handleInputChange}
                  maxLength={30}
                />
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Componente auxiliar (igual que en RefugioDetalles) ────────────────────────

function InfoItem({
  label,
  value,
  isEditing = false,
  name,
  formValue,
  onChange,
  required = false,
  type = "text",
  maxLength,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <label className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </label>

      {isEditing ? (
        <input
          type={type}
          name={name}
          value={formValue}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
        />
      ) : (
        <p className="mt-1 break-words text-sm font-bold text-slate-700">
          {value}
        </p>
      )}
    </div>
  );
}
