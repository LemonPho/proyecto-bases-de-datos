import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getRescateById,
  updateRescate,
  getAnimales,
  getRescatistas,
} from "./fetch";

export default function RescateDetalles() {
  const { id } = useParams();

  const [rescate, setRescate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [animales, setAnimales] = useState([]);
  const [rescatistas, setRescatistas] = useState([]);

  const [formData, setFormData] = useState({
    animalId: "",
    rescatistaId: "",
    fechaRescate: "",
    lugarRescate: "",
  });

  useEffect(() => {
    fetchRescate();
  }, [id]);

  useEffect(() => {
    if (isEditing && animales.length === 0) {
      loadOptions();
    }
  }, [isEditing]);

  async function fetchRescate() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getRescateById(id);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        setRescate(null);
      } else {
        setRescate(response.data);
        loadFormData(response.data);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("Ocurrió un error inesperado cargando el rescate.");
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [animalesData, rescatistasData] = await Promise.all([
        getAnimales(),
        getRescatistas(),
      ]);
      setAnimales(animalesData || []);
      setRescatistas(rescatistasData || []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
    } finally {
      setLoadingOptions(false);
    }
  }

  function loadFormData(data) {
    if (!data) return;
    setFormData({
      animalId: data.animal_id || "",
      rescatistaId: data.rescatista_id || "",
      fechaRescate: data.fecha_rescate || "",
      lugarRescate: data.lugar_rescate || "",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleEditClick() {
    loadFormData(rescate);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(rescate);
    setEditErrorMessage("");
    setIsEditing(false);
  }

  async function handleSaveEdit(event) {
    event.preventDefault();
    setSaving(true);
    setEditErrorMessage("");

    try {
      const response = await updateRescate(id, formData);

      if (response.errorMessage) {
        setEditErrorMessage(response.errorMessage);
        return;
      }

      setRescate(response.data);
      loadFormData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error inesperado:", error);
      setEditErrorMessage("Ocurrió un error inesperado actualizando el rescate.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Cargando información del rescate...
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
              onClick={fetchRescate}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Reintentar
            </button>
            <Link
              to="/admin/rescates"
              className="rounded-full px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!rescate) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin/rescates"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver a rescates
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              Rescate de {rescate.animal?.nombre || "animal"}
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Detalles del rescate registrado.
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
                form="rescate-edit-form"
                disabled={saving}
                className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
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
              Editar rescate
            </button>
          )}
        </div>

        <form id="rescate-edit-form" onSubmit={handleSaveEdit}>
          {editErrorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {editErrorMessage}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
              <h2 className="text-lg font-extrabold text-slate-800">
                Información del rescate
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Animal
                  </label>
                  {isEditing ? (
                    <select
                      name="animalId"
                      value={formData.animalId}
                      onChange={handleInputChange}
                      required
                      disabled={loadingOptions}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    >
                      <option value="">Selecciona un animal...</option>
                      {animales.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nombre || "Sin nombre"} — {a.raza?.nombre_raza || ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {rescate.animal?.nombre || "Sin nombre"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Rescatista
                  </label>
                  {isEditing ? (
                    <select
                      name="rescatistaId"
                      value={formData.rescatistaId}
                      onChange={handleInputChange}
                      required
                      disabled={loadingOptions}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    >
                      <option value="">Selecciona un rescatista...</option>
                      {rescatistas.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.contacto?.nombre || "Sin nombre"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {rescate.rescatista?.contacto?.nombre || "Sin nombre"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Fecha del rescate
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="fechaRescate"
                      value={formData.fechaRescate}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {rescate.fecha_rescate || "Sin fecha"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    ID
                  </label>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {rescate.id}
                  </p>
                </div>

                <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Lugar del rescate
                  </label>
                  {isEditing ? (
                    <textarea
                      name="lugarRescate"
                      value={formData.lugarRescate}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <p className="mt-1 break-words text-sm font-bold text-slate-700">
                      {rescate.lugar_rescate || "Sin lugar registrado"}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-extrabold text-slate-800">Resumen</h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Animal
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {rescate.animal?.nombre || "Sin nombre"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 capitalize">
                    {rescate.animal?.raza?.especie?.nombre_especie || ""} —{" "}
                    {rescate.animal?.raza?.nombre_raza || ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Contacto rescatista
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {rescate.rescatista?.contacto?.email || "Sin email"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {rescate.rescatista?.contacto?.telefono || "Sin teléfono"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}
