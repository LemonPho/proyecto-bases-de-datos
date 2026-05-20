import { useEffect, useState } from "react";
import { createRescate, getAnimales, getRescatistas } from "./fetch";
import CrearUsuario from "../usuarios/CrearUsuario";

export default function CrearRescate({ isOpen, onClose, onCreated }) {
  const INITIAL_FORM = {
    animalId: "",
    rescatistaId: "",
    fechaRescate: new Date().toISOString().slice(0, 10),
    lugarRescate: "",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [animales, setAnimales] = useState([]);
  const [rescatistas, setRescatistas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRescatistaModalOpen, setIsRescatistaModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
      setFormData(INITIAL_FORM);
      setErrorMessage("");
    }
  }, [isOpen]);

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [animalesData, rescatistasData] = await Promise.all([
        getAnimales(),
        getRescatistas(),
      ]);
      setAnimales(Array.isArray(animalesData) ? animalesData : []);
      setRescatistas(Array.isArray(rescatistasData) ? rescatistasData : []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
      setErrorMessage("Error al cargar las listas de selección.");
    } finally {
      setLoadingOptions(false);
    }
  }

  async function handleRescatistaCreated(nuevoUsuario) {
    const rescatistasData = await getRescatistas();
    const lista = Array.isArray(rescatistasData) ? rescatistasData : [];
    setRescatistas(lista);
    const contactoId = nuevoUsuario?.id;
    const nuevo = lista.find((r) => r.contacto?.id === contactoId);
    if (nuevo) {
      setFormData((current) => ({ ...current, rescatistaId: nuevo.id }));
    }
  }

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
      const response = await createRescate(formData);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        return;
      }

      if (onCreated) onCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error inesperado creando rescate:", error);
      setErrorMessage(error.message || "Ocurrió un error inesperado.");
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
              Registrar rescate
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Registra un rescate vinculando animal y rescatista.
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

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">Animal</label>
              <select
                name="animalId"
                value={formData.animalId}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
              >
                <option value="">Selecciona un animal...</option>
                {animales.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre || "Sin nombre"} —{" "}
                    {a.raza?.nombre_raza || ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-bold text-slate-600">Rescatista</label>
                <button
                  type="button"
                  onClick={() => setIsRescatistaModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  + Crear rescatista
                </button>
              </div>
              <select
                name="rescatistaId"
                value={formData.rescatistaId}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
              >
                <option value="">Selecciona un rescatista...</option>
                {rescatistas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.contacto?.nombre || "Sin nombre"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Fecha del rescate
              </label>
              <input
                type="date"
                name="fechaRescate"
                value={formData.fechaRescate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Lugar del rescate
              </label>
              <textarea
                name="lugarRescate"
                value={formData.lugarRescate}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Calle, colonia, ciudad, referencias..."
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
              disabled={saving || loadingOptions}
              className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Registrar rescate"}
            </button>
          </div>
        </form>
      </div>
    </div>

    <CrearUsuario
      isOpen={isRescatistaModalOpen}
      onClose={() => setIsRescatistaModalOpen(false)}
      onCreated={handleRescatistaCreated}
      defaultTipoUsuario="rescatista"
      lockTipoUsuario
    />
    </>
  );
}
