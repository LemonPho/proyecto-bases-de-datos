import { useState } from "react";
import { createRefugio } from "./fetch";

export default function CrearRefugio({ isOpen, onClose, onCreated }) {
  const INITIAL_FORM = {
    nombreRefugio: "",
    nombreContacto: "",
    telefono: "",
    email: "",
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

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");

    try {
      const response = await createRefugio(formData);

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
      console.error("Error inesperado creando refugio:", error);
      setErrorMessage("Ocurrió un error inesperado creando el refugio.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Crear refugio
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Registra los datos principales del refugio.
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

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Nombre del refugio
              </label>
              <input
                name="nombreRefugio"
                value={formData.nombreRefugio}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ej. Refugio Patitas Felices"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Nombre de contacto
              </label>
              <input
                name="nombreContacto"
                value={formData.nombreContacto}
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

            <div className="md:col-span-2">
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
                placeholder="contacto@refugio.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Calle
              </label>
              <input
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                required
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
                required
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
                required
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
                required
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
                required
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
                required
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
              {saving ? "Guardando..." : "Crear refugio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}