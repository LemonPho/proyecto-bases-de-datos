import { useEffect, useState } from "react";
import {
  createSolicitud,
  ESTATUS_SOLICITUD,
  getAnimalesDisponibles,
  getAdoptantes,
} from "./fetch";
import CrearAnimal from "../animales/CrearAnimal";
import CrearUsuario from "../usuarios/CrearUsuario";

export default function CrearSolicitud({ isOpen, onClose, onCreated }) {
  const INITIAL_FORM = {
    animalId: "",
    adoptanteId: "",
    fechaSolicitud: new Date().toISOString().slice(0, 10),
    estatus: "pendiente",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [animales, setAnimales] = useState([]);
  const [adoptantes, setAdoptantes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [isAdoptanteModalOpen, setIsAdoptanteModalOpen] = useState(false);

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
      const [animalesData, adoptantesData] = await Promise.all([
        getAnimalesDisponibles(),
        getAdoptantes(),
      ]);
      setAnimales(Array.isArray(animalesData) ? animalesData : []);
      setAdoptantes(Array.isArray(adoptantesData) ? adoptantesData : []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
      setErrorMessage("Error al cargar las listas de selección.");
    } finally {
      setLoadingOptions(false);
    }
  }

  async function handleAnimalCreated(nuevoAnimal) {
    const animalesData = await getAnimalesDisponibles();
    setAnimales(Array.isArray(animalesData) ? animalesData : []);
    if (nuevoAnimal?.id) {
      setFormData((current) => ({ ...current, animalId: nuevoAnimal.id }));
    }
  }

  async function handleAdoptanteCreated(nuevoUsuario) {
    const adoptantesData = await getAdoptantes();
    const lista = Array.isArray(adoptantesData) ? adoptantesData : [];
    setAdoptantes(lista);
    const contactoId = nuevoUsuario?.id;
    const nuevo = lista.find((a) => a.contacto?.id === contactoId);
    if (nuevo) {
      setFormData((current) => ({ ...current, adoptanteId: nuevo.id }));
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
      const response = await createSolicitud(formData);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        return;
      }

      if (onCreated) onCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error inesperado creando solicitud:", error);
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
              Nueva solicitud de adopción
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Asocia un animal con un adoptante.
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
                <label className="text-sm font-bold text-slate-600">Animal</label>
                <button
                  type="button"
                  onClick={() => setIsAnimalModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  + Crear animal
                </button>
              </div>
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
                    {a.raza?.nombre_raza || ""} ({a.estado})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-bold text-slate-600">Adoptante</label>
                <button
                  type="button"
                  onClick={() => setIsAdoptanteModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  + Crear adoptante
                </button>
              </div>
              <select
                name="adoptanteId"
                value={formData.adoptanteId}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
              >
                <option value="">Selecciona un adoptante...</option>
                {adoptantes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.contacto?.nombre || "Sin nombre"}
                    {a.contacto?.email ? ` — ${a.contacto.email}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Fecha de solicitud
              </label>
              <input
                type="date"
                name="fechaSolicitud"
                value={formData.fechaSolicitud}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Estatus
              </label>
              <select
                name="estatus"
                value={formData.estatus}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500 capitalize"
              >
                {ESTATUS_SOLICITUD.map((e) => (
                  <option key={e} value={e} className="capitalize">
                    {e.replace("_", " ")}
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
              {saving ? "Guardando..." : "Crear solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>

    <CrearAnimal
      isOpen={isAnimalModalOpen}
      onClose={() => setIsAnimalModalOpen(false)}
      onCreated={handleAnimalCreated}
    />

    <CrearUsuario
      isOpen={isAdoptanteModalOpen}
      onClose={() => setIsAdoptanteModalOpen(false)}
      onCreated={handleAdoptanteCreated}
      defaultTipoUsuario="adoptante"
      lockTipoUsuario
    />
    </>
  );
}
