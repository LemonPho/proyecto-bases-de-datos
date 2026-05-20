import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getSolicitudById,
  updateSolicitud,
  formalizarAdopcion,
  ESTATUS_SOLICITUD,
  getAnimalesDisponibles,
  getAdoptantes,
} from "./fetch";

const ESTATUS_COLORES = {
  pendiente: "bg-amber-100 text-amber-700",
  en_revision: "bg-blue-100 text-blue-700",
  aprobada: "bg-green-100 text-green-700",
  rechazada: "bg-red-100 text-red-700",
  cancelada: "bg-slate-200 text-slate-600",
};

export default function SolicitudDetalles() {
  const { id } = useParams();

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [animales, setAnimales] = useState([]);
  const [adoptantes, setAdoptantes] = useState([]);

  const [formData, setFormData] = useState({
    animalId: "",
    adoptanteId: "",
    fechaSolicitud: "",
    estatus: "pendiente",
  });

  const [formalizando, setFormalizando] = useState(false);
  const [fechaAdopcion, setFechaAdopcion] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [contratoFirmado, setContratoFirmado] = useState(false);

  useEffect(() => {
    fetchSolicitud();
  }, [id]);

  useEffect(() => {
    if (isEditing && animales.length === 0) {
      loadOptions();
    }
  }, [isEditing]);

  async function fetchSolicitud() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getSolicitudById(id);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        setSolicitud(null);
      } else {
        setSolicitud(response.data);
        loadFormData(response.data);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("Ocurrió un error inesperado cargando la solicitud.");
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [animalesData, adoptantesData] = await Promise.all([
        getAnimalesDisponibles(),
        getAdoptantes(),
      ]);
      setAnimales(animalesData || []);
      setAdoptantes(adoptantesData || []);
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
      adoptanteId: data.adoptante_id || "",
      fechaSolicitud: data.fecha_solicitud || "",
      estatus: data.estatus || "pendiente",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleEditClick() {
    loadFormData(solicitud);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(solicitud);
    setEditErrorMessage("");
    setIsEditing(false);
  }

  async function handleSaveEdit(event) {
    event.preventDefault();
    setSaving(true);
    setEditErrorMessage("");

    try {
      const response = await updateSolicitud(id, formData);

      if (response.errorMessage) {
        setEditErrorMessage(response.errorMessage);
        return;
      }

      setSolicitud(response.data);
      loadFormData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error inesperado:", error);
      setEditErrorMessage("Ocurrió un error inesperado actualizando la solicitud.");
    } finally {
      setSaving(false);
    }
  }

  async function handleFormalizar() {
    setFormalizando(true);
    setEditErrorMessage("");
    try {
      const response = await formalizarAdopcion(id, fechaAdopcion, contratoFirmado);
      if (response.errorMessage) {
        setEditErrorMessage(response.errorMessage);
        return;
      }
      await fetchSolicitud();
    } catch (error) {
      console.error("Error formalizando:", error);
      setEditErrorMessage("Ocurrió un error formalizando la adopción.");
    } finally {
      setFormalizando(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Cargando información de la solicitud...
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
              onClick={fetchSolicitud}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Reintentar
            </button>
            <Link
              to="/admin/adopciones"
              className="rounded-full px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!solicitud) return null;

  const adopcionFormalizada = Array.isArray(solicitud.adopcion)
    ? solicitud.adopcion[0]
    : solicitud.adopcion;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin/adopciones"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver a solicitudes
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              Solicitud de adopción
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Detalles de la solicitud y formalización.
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
                form="solicitud-edit-form"
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
              Editar solicitud
            </button>
          )}
        </div>

        <form id="solicitud-edit-form" onSubmit={handleSaveEdit}>
          {editErrorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {editErrorMessage}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
              <h2 className="text-lg font-extrabold text-slate-800">
                Información de la solicitud
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
                      {solicitud.animal?.nombre || "Sin nombre"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Adoptante
                  </label>
                  {isEditing ? (
                    <select
                      name="adoptanteId"
                      value={formData.adoptanteId}
                      onChange={handleInputChange}
                      required
                      disabled={loadingOptions}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    >
                      <option value="">Selecciona un adoptante...</option>
                      {adoptantes.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.contacto?.nombre || "Sin nombre"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {solicitud.adoptante?.contacto?.nombre || "Sin nombre"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Fecha de solicitud
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="fechaSolicitud"
                      value={formData.fechaSolicitud}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {solicitud.fecha_solicitud}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Estatus
                  </label>
                  {isEditing ? (
                    <select
                      name="estatus"
                      value={formData.estatus}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500 capitalize"
                    >
                      {ESTATUS_SOLICITUD.map((e) => (
                        <option key={e} value={e} className="capitalize">
                          {e.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        ESTATUS_COLORES[solicitud.estatus] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {solicitud.estatus.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-extrabold text-slate-800">
                Adopción
              </h2>

              {adopcionFormalizada ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-green-50 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-green-700">
                      Estado
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      Formalizada
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Fecha
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {adopcionFormalizada.fecha_adopcion}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Contrato firmado
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {adopcionFormalizada.contrato_firmado ? "Sí" : "No"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-medium text-slate-500">
                    Esta solicitud aún no se formaliza como adopción.
                  </p>
                  <input
                    type="date"
                    value={fechaAdopcion}
                    onChange={(e) => setFechaAdopcion(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                  />
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <input
                      type="checkbox"
                      checked={contratoFirmado}
                      onChange={(e) => setContratoFirmado(e.target.checked)}
                    />
                    Contrato firmado
                  </label>
                  <button
                    type="button"
                    onClick={handleFormalizar}
                    disabled={formalizando || solicitud.estatus !== "aprobada"}
                    className="w-full rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {formalizando ? "Formalizando..." : "Formalizar adopción"}
                  </button>
                  {solicitud.estatus !== "aprobada" && (
                    <p className="text-xs font-medium text-amber-600">
                      Solo solicitudes aprobadas se pueden formalizar.
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}
