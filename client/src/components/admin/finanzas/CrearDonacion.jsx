import { useEffect, useState } from "react";
import {
  createDonacion,
  TIPOS_DONACION,
  getRefugios,
  getDonantes,
} from "./fetch";
import CrearUsuario from "../usuarios/CrearUsuario";

export default function CrearDonacion({ isOpen, onClose, onCreated }) {
  const INITIAL_FORM = {
    donanteId: "",
    refugioId: "",
    montoOValor: "",
    tipoDonacion: "monetaria",
    detalle: "",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [refugios, setRefugios] = useState([]);
  const [donantes, setDonantes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDonanteModalOpen, setIsDonanteModalOpen] = useState(false);

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
      const [refugiosData, donantesData] = await Promise.all([
        getRefugios(),
        getDonantes(),
      ]);
      setRefugios(Array.isArray(refugiosData) ? refugiosData : []);
      setDonantes(Array.isArray(donantesData) ? donantesData : []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
      setErrorMessage("Error al cargar las listas de selección.");
    } finally {
      setLoadingOptions(false);
    }
  }

  async function handleDonanteCreated(nuevoUsuario) {
    const donantesData = await getDonantes();
    const lista = Array.isArray(donantesData) ? donantesData : [];
    setDonantes(lista);
    const contactoId = nuevoUsuario?.id;
    const nuevo = lista.find((d) => d.contacto?.id === contactoId);
    if (nuevo) {
      setFormData((current) => ({ ...current, donanteId: nuevo.id }));
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
      const response = await createDonacion(formData);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        return;
      }

      if (onCreated) onCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error inesperado creando donación:", error);
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
              Registrar donación
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Registra una donación recibida por un refugio.
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
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-bold text-slate-600">Donante</label>
                <button
                  type="button"
                  onClick={() => setIsDonanteModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  + Crear donante
                </button>
              </div>
              <select
                name="donanteId"
                value={formData.donanteId}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
              >
                <option value="">Selecciona un donante...</option>
                {donantes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.contacto?.nombre || "Sin nombre"}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Refugio destinatario
              </label>
              <select
                name="refugioId"
                value={formData.refugioId}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
              >
                <option value="">Selecciona un refugio...</option>
                {refugios.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Tipo de donación
              </label>
              <select
                name="tipoDonacion"
                value={formData.tipoDonacion}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500 capitalize"
              >
                {TIPOS_DONACION.map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Monto / Valor
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="montoOValor"
                value={formData.montoOValor}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ej. 1500.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Detalle
              </label>
              <textarea
                name="detalle"
                value={formData.detalle}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Notas o descripción adicional..."
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
              {saving ? "Guardando..." : "Registrar donación"}
            </button>
          </div>
        </form>
      </div>
    </div>

    <CrearUsuario
      isOpen={isDonanteModalOpen}
      onClose={() => setIsDonanteModalOpen(false)}
      onCreated={handleDonanteCreated}
      defaultTipoUsuario="donante"
      lockTipoUsuario
    />
    </>
  );
}
