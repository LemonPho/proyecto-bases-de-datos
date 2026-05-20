import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const SELECT_AREA = `
  id,
  refugio_id,
  nombre_area,
  capacidad_maxima,
  refugio:refugio_id ( id, nombre )
`;

async function fetchRefugios() {
  const { data, error } = await supabase
    .from("refugios")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error obteniendo refugios:", error);
    return [];
  }
  return data || [];
}

/**
 * Modal para crear o editar un área de refugio.
 *
 * Props:
 *   isOpen, onClose, onSaved(area)
 *   refugioId: si se provee, queda fijo y no muestra el selector.
 *   area: si se provee, modo edición (no permite cambiar el refugio_id).
 */
export default function CrearArea({
  isOpen,
  onClose,
  onSaved,
  refugioId = null,
  area = null,
}) {
  const isEditMode = Boolean(area);
  const refugioFijo = Boolean(refugioId) || isEditMode;

  const INITIAL_FORM = {
    refugioId: refugioId || "",
    nombreArea: "",
    capacidadMaxima: "",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [refugios, setRefugios] = useState([]);
  const [loadingRefugios, setLoadingRefugios] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");

      if (area) {
        setFormData({
          refugioId: area.refugio_id || refugioId || "",
          nombreArea: area.nombre_area || "",
          capacidadMaxima:
            area.capacidad_maxima !== null && area.capacidad_maxima !== undefined
              ? area.capacidad_maxima
              : "",
        });
      } else {
        setFormData({ ...INITIAL_FORM, refugioId: refugioId || "" });
      }

      if (!refugioFijo) {
        loadRefugios();
      }
    }
  }, [isOpen, area, refugioId]);

  async function loadRefugios() {
    setLoadingRefugios(true);
    const data = await fetchRefugios();
    setRefugios(data);
    setLoadingRefugios(false);
  }

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.refugioId) {
      setErrorMessage("Debes seleccionar un refugio.");
      return;
    }

    const capacidad = parseInt(formData.capacidadMaxima, 10);
    if (isNaN(capacidad) || capacidad < 0) {
      setErrorMessage("La capacidad debe ser un número entero válido.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      let result;

      if (isEditMode) {
        const { data, error } = await supabase
          .from("areas_refugio")
          .update({
            nombre_area: formData.nombreArea,
            capacidad_maxima: capacidad,
          })
          .eq("id", area.id)
          .select(SELECT_AREA)
          .single();

        if (error) {
          console.error("Error actualizando área:", error);
          setErrorMessage("No se pudo actualizar el área.");
          return;
        }
        result = data;
      } else {
        const { data, error } = await supabase
          .from("areas_refugio")
          .insert({
            refugio_id: formData.refugioId,
            nombre_area: formData.nombreArea,
            capacidad_maxima: capacidad,
          })
          .select(SELECT_AREA)
          .single();

        if (error) {
          console.error("Error creando área:", error);
          setErrorMessage("No se pudo crear el área.");
          return;
        }
        result = data;
      }

      if (onSaved) onSaved(result);
      onClose();
    } catch (error) {
      console.error("Error inesperado guardando área:", error);
      setErrorMessage(error.message || "Ocurrió un error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              {isEditMode ? "Editar área" : "Nueva área"}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-400">
              {isEditMode
                ? "Actualiza los datos del área."
                : "Registra un área dentro de un refugio."}
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

          <div className="space-y-4">
            {!refugioFijo && (
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-600">
                  Refugio
                </label>
                <select
                  name="refugioId"
                  value={formData.refugioId}
                  onChange={handleChange}
                  required
                  disabled={loadingRefugios}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                >
                  <option value="">
                    {loadingRefugios ? "Cargando..." : "Selecciona un refugio..."}
                  </option>
                  {refugios.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Nombre del área
              </label>
              <input
                name="nombreArea"
                value={formData.nombreArea}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ej. Caninos pequeños"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Capacidad máxima
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="capacidadMaxima"
                value={formData.capacidadMaxima}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ej. 20"
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
              {saving
                ? "Guardando..."
                : isEditMode
                ? "Guardar cambios"
                : "Crear área"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
