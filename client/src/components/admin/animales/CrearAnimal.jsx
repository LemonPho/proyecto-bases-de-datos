import { useEffect, useState } from "react";
import {
  createAnimal,
  ESTADOS_ANIMAL,
  getAreasRefugio,
  getRazas,
  getEspecies,
  createRaza,
  createEspecie,
} from "./fetch";
import CrearArea from "../shared/CrearArea";

export default function CrearAnimal({ isOpen, onClose, onCreated }) {
  const INITIAL_FORM = {
    nombre: "",
    estado: "sano",
    fechaIngreso: new Date().toISOString().slice(0, 10),
    areaId: "",
    razaId: "",
    nuevaRazaNombre: "",
    nuevaRazaEspecieId: "",
    nuevaEspecieNombre: "",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [areas, setAreas] = useState([]);
  const [razas, setRazas] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreatingRaza, setIsCreatingRaza] = useState(false);
  const [isCreatingEspecie, setIsCreatingEspecie] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
      setFormData(INITIAL_FORM);
      setIsCreatingRaza(false);
      setIsCreatingEspecie(false);
      setErrorMessage("");
    }
  }, [isOpen]);

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [areasData, razasData, especiesData] = await Promise.all([
        getAreasRefugio(),
        getRazas(),
        getEspecies(),
      ]);

      setAreas(Array.isArray(areasData) ? areasData : []);
      setRazas(Array.isArray(razasData) ? razasData : []);
      setEspecies(Array.isArray(especiesData) ? especiesData : []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
      setErrorMessage("Error al cargar las listas de selección.");
    } finally {
      setLoadingOptions(false);
    }
  }

  async function handleAreaCreated(nuevaArea) {
    const areasData = await getAreasRefugio();
    setAreas(Array.isArray(areasData) ? areasData : []);
    if (nuevaArea?.id) {
      setFormData((current) => ({ ...current, areaId: nuevaArea.id }));
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
      let razaIdToUse = formData.razaId;

      if (isCreatingRaza) {
        if (!formData.nuevaRazaNombre.trim()) {
          setErrorMessage("Debes escribir un nombre para la nueva raza.");
          setSaving(false);
          return;
        }

        let especieIdToUse = formData.nuevaRazaEspecieId;

        if (isCreatingEspecie) {
          const nombreEspecie = formData.nuevaEspecieNombre.trim().toLowerCase();
          if (!nombreEspecie) {
            setErrorMessage("Debes escribir un nombre para la nueva especie.");
            setSaving(false);
            return;
          }
          const nuevaEspecie = await createEspecie(nombreEspecie);
          especieIdToUse = nuevaEspecie.id;
          setEspecies((prev) => [...prev, nuevaEspecie]);
        }

        if (!especieIdToUse) {
          setErrorMessage("Debes seleccionar la especie de la nueva raza.");
          setSaving(false);
          return;
        }

        const nuevaRaza = await createRaza(
          formData.nuevaRazaNombre,
          especieIdToUse
        );
        razaIdToUse = nuevaRaza.id;
      }

      const response = await createAnimal({
        ...formData,
        razaId: razaIdToUse,
      });

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        return;
      }

      if (onCreated) onCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error inesperado creando animal:", error);
      setErrorMessage(error.message || "Ocurrió un error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Registrar animal
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Captura los datos del animal y su ubicación.
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
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Nombre del animal
              </label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ej. Firulais"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500 capitalize"
              >
                {ESTADOS_ANIMAL.map((estado) => (
                  <option key={estado} value={estado} className="capitalize">
                    {estado.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Fecha de ingreso
              </label>
              <input
                type="date"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div className="md:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-bold text-slate-600">
                  Área del refugio
                </label>
                <button
                  type="button"
                  onClick={() => setIsAreaModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  + Crear área
                </button>
              </div>
              <select
                name="areaId"
                value={formData.areaId}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
              >
                <option value="">Selecciona un área...</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.refugio?.nombre || "Sin refugio"} — {area.nombre_area}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-bold text-slate-600">
                  Raza
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingRaza(!isCreatingRaza);
                    setErrorMessage("");
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {isCreatingRaza ? "Volver a seleccionar" : "+ Crear nueva raza"}
                </button>
              </div>

              {isCreatingRaza ? (
                <div className="space-y-3">
                  <input
                    name="nuevaRazaNombre"
                    value={formData.nuevaRazaNombre}
                    onChange={handleChange}
                    required={isCreatingRaza}
                    placeholder="Nombre de la raza (ej. Labrador)"
                    maxLength={50}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                  />

                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-600">
                        Especie
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingEspecie(!isCreatingEspecie);
                          setErrorMessage("");
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {isCreatingEspecie
                          ? "Volver a seleccionar"
                          : "+ Crear nueva especie"}
                      </button>
                    </div>

                    {isCreatingEspecie ? (
                      <input
                        name="nuevaEspecieNombre"
                        value={formData.nuevaEspecieNombre}
                        onChange={handleChange}
                        required={isCreatingEspecie}
                        maxLength={50}
                        placeholder="Nombre de la especie (ej. hurón)"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                      />
                    ) : (
                      <select
                        name="nuevaRazaEspecieId"
                        value={formData.nuevaRazaEspecieId}
                        onChange={handleChange}
                        required={isCreatingRaza && !isCreatingEspecie}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500 capitalize"
                      >
                        <option value="">Selecciona la especie...</option>
                        {especies.map((e) => (
                          <option key={e.id} value={e.id} className="capitalize">
                            {e.nombre_especie}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ) : (
                <select
                  name="razaId"
                  value={formData.razaId}
                  onChange={handleChange}
                  required={!isCreatingRaza}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                >
                  <option value="">Selecciona la raza...</option>
                  {razas.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre_raza}
                      {r.especie?.nombre_especie
                        ? ` (${r.especie.nombre_especie})`
                        : ""}
                    </option>
                  ))}
                </select>
              )}
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
              {saving ? "Guardando..." : "Registrar animal"}
            </button>
          </div>
        </form>
      </div>
    </div>

    <CrearArea
      isOpen={isAreaModalOpen}
      onClose={() => setIsAreaModalOpen(false)}
      onSaved={handleAreaCreated}
    />
    </>
  );
}
