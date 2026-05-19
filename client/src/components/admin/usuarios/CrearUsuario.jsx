import { useState } from "react";
import { createUsuario, TIPOS_USUARIO } from "./fetch";

export default function CrearUsuario({ isOpen, onClose, onCreated }) {
  const INITIAL_FORM = {
    nombre: "",
    telefono: "",
    email: "",
    tipoUsuario: "adoptante",
    calle: "",
    noExt: "",
    noInt: "",
    colonia: "",
    ciudad: "",
    estado: "",
    pais: "México",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const response = await createUsuario(formData);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        return;
      }

      setFormData(INITIAL_FORM);

      if (onCreated) {
        onCreated(response.data);
      }

      onClose();
    } catch (error) {
      console.error("Error inesperado creando usuario:", error);
      setErrorMessage("Ocurrió un error inesperado creando el usuario.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Crear usuario
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Registra los datos del nuevo usuario y su rol en el sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-2xl font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            disabled={saving}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {errorMessage && (
            <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Datos personales */}
          <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
            Datos personales
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Nombre completo
              </label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ej. Laura Pérez"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Teléfono
              </label>
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                maxLength={10}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="3312345678"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={100}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Tipo de usuario
              </label>
              <select
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 bg-white capitalize"
              >
                {TIPOS_USUARIO.map((tipo) => (
                  <option key={tipo} value={tipo} className="capitalize">
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dirección */}
          <h3 className="mb-3 mt-7 text-xs font-black uppercase tracking-widest text-slate-400">
            Dirección (opcional)
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Calle
              </label>
              <input
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                No. exterior
              </label>
              <input
                name="noExt"
                value={formData.noExt}
                onChange={handleChange}
                maxLength={10}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                No. interior
              </label>
              <input
                name="noInt"
                value={formData.noInt}
                onChange={handleChange}
                maxLength={10}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Colonia
              </label>
              <input
                name="colonia"
                value={formData.colonia}
                onChange={handleChange}
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Ciudad
              </label>
              <input
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Estado
              </label>
              <input
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                maxLength={30}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                País
              </label>
              <input
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                maxLength={30}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
