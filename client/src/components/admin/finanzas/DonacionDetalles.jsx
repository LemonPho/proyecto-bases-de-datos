import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getDonacionById,
  updateDonacion,
  TIPOS_DONACION,
  getRefugios,
  getDonantes,
} from "./fetch";

const TIPO_COLORES = {
  monetaria: "bg-green-100 text-green-700",
  especie: "bg-blue-100 text-blue-700",
  servicio: "bg-purple-100 text-purple-700",
};

function formatMonto(valor) {
  if (valor === null || valor === undefined || valor === "") return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(valor);
}

export default function DonacionDetalles() {
  const { id } = useParams();

  const [donacion, setDonacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [refugios, setRefugios] = useState([]);
  const [donantes, setDonantes] = useState([]);

  const [formData, setFormData] = useState({
    donanteId: "",
    refugioId: "",
    montoOValor: "",
    tipoDonacion: "monetaria",
    detalle: "",
  });

  useEffect(() => {
    fetchDonacion();
  }, [id]);

  useEffect(() => {
    if (isEditing && refugios.length === 0) {
      loadOptions();
    }
  }, [isEditing]);

  async function fetchDonacion() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getDonacionById(id);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        setDonacion(null);
      } else {
        setDonacion(response.data);
        loadFormData(response.data);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("Ocurrió un error inesperado cargando la donación.");
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [refugiosData, donantesData] = await Promise.all([
        getRefugios(),
        getDonantes(),
      ]);
      setRefugios(refugiosData || []);
      setDonantes(donantesData || []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
    } finally {
      setLoadingOptions(false);
    }
  }

  function loadFormData(data) {
    if (!data) return;
    setFormData({
      donanteId: data.donante_id || "",
      refugioId: data.refugio_id || "",
      montoOValor: data.monto_o_valor ?? "",
      tipoDonacion: data.tipo_donacion || "monetaria",
      detalle: data.detalle || "",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleEditClick() {
    loadFormData(donacion);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(donacion);
    setEditErrorMessage("");
    setIsEditing(false);
  }

  async function handleSaveEdit(event) {
    event.preventDefault();
    setSaving(true);
    setEditErrorMessage("");

    try {
      const response = await updateDonacion(id, formData);

      if (response.errorMessage) {
        setEditErrorMessage(response.errorMessage);
        return;
      }

      setDonacion(response.data);
      loadFormData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error inesperado:", error);
      setEditErrorMessage("Ocurrió un error inesperado actualizando la donación.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Cargando información de la donación...
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
              onClick={fetchDonacion}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Reintentar
            </button>
            <Link
              to="/admin/finanzas"
              className="rounded-full px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!donacion) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin/finanzas"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver a finanzas
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              Donación
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Detalles de la donación recibida.
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
                form="donacion-edit-form"
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
              Editar donación
            </button>
          )}
        </div>

        <form id="donacion-edit-form" onSubmit={handleSaveEdit}>
          {editErrorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {editErrorMessage}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
              <h2 className="text-lg font-extrabold text-slate-800">
                Información de la donación
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Donante
                  </label>
                  {isEditing ? (
                    <select
                      name="donanteId"
                      value={formData.donanteId}
                      onChange={handleInputChange}
                      required
                      disabled={loadingOptions}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    >
                      <option value="">Selecciona un donante...</option>
                      {donantes.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.contacto?.nombre || "Sin nombre"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {donacion.donante?.contacto?.nombre || "Sin nombre"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Refugio
                  </label>
                  {isEditing ? (
                    <select
                      name="refugioId"
                      value={formData.refugioId}
                      onChange={handleInputChange}
                      required
                      disabled={loadingOptions}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    >
                      <option value="">Selecciona un refugio...</option>
                      {refugios.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {donacion.refugio?.nombre || "Sin refugio"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Tipo de donación
                  </label>
                  {isEditing ? (
                    <select
                      name="tipoDonacion"
                      value={formData.tipoDonacion}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500 capitalize"
                    >
                      {TIPOS_DONACION.map((t) => (
                        <option key={t} value={t} className="capitalize">
                          {t}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        TIPO_COLORES[donacion.tipo_donacion] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {donacion.tipo_donacion}
                    </span>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Monto / Valor
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="montoOValor"
                      value={formData.montoOValor}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {formatMonto(donacion.monto_o_valor)}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Detalle
                  </label>
                  {isEditing ? (
                    <textarea
                      name="detalle"
                      value={formData.detalle}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <p className="mt-1 break-words text-sm font-bold text-slate-700">
                      {donacion.detalle || "Sin detalles registrados"}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    ID
                  </label>
                  <p className="mt-1 break-words text-sm font-bold text-slate-700">
                    {donacion.id}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-extrabold text-slate-800">Resumen</h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-green-700">
                    Monto registrado
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-slate-800">
                    {formatMonto(donacion.monto_o_valor)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Email donante
                  </p>
                  <p className="mt-1 break-words text-sm font-bold text-slate-700">
                    {donacion.donante?.contacto?.email || "Sin email"}
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
