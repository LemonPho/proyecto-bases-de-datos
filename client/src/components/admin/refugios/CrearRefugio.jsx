import { useEffect, useState } from "react";
import { createRefugio, getContactos } from "./fetch";
import CrearContacto from "../shared/CrearContacto";

export default function CrearRefugio({ isOpen, onClose, onCreated }) {
  const INITIAL_FORM = {
    nombreRefugio: "",
    contactoId: "",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [contactos, setContactos] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isContactoModalOpen, setIsContactoModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadContactos();
      setFormData(INITIAL_FORM);
      setErrorMessage("");
    }
  }, [isOpen]);

  async function loadContactos() {
    setLoadingOptions(true);
    const data = await getContactos();
    setContactos(Array.isArray(data) ? data : []);
    setLoadingOptions(false);
    return data;
  }

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleContactoCreated(nuevoContacto) {
    await loadContactos();
    if (nuevoContacto?.id) {
      setFormData((current) => ({ ...current, contactoId: nuevoContacto.id }));
    }
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
      if (onCreated) onCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error inesperado creando refugio:", error);
      setErrorMessage("Ocurrió un error inesperado creando el refugio.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">
                Crear refugio
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-400">
                Selecciona el contacto responsable del refugio.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full px-3 py-1 text-2xl font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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

            <div className="space-y-5">
              <div>
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
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-600">
                    Contacto del refugio
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsContactoModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    + Crear contacto
                  </button>
                </div>
                <select
                  name="contactoId"
                  value={formData.contactoId}
                  onChange={handleChange}
                  required
                  disabled={loadingOptions}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                >
                  <option value="">Selecciona un contacto...</option>
                  {contactos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                      {c.email ? ` — ${c.email}` : ""}
                      {c.tipo_usuario ? ` (${c.tipo_usuario})` : ""}
                    </option>
                  ))}
                </select>
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
                disabled={saving || loadingOptions}
                className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Crear refugio"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <CrearContacto
        isOpen={isContactoModalOpen}
        onClose={() => setIsContactoModalOpen(false)}
        onCreated={handleContactoCreated}
        defaultTipoUsuario="refugio"
      />
    </>
  );
}
