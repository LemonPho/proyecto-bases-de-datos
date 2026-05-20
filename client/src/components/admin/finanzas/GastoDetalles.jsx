import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGastoById, updateGasto, getRefugios } from "./fetch";

function formatMonto(valor) {
  if (valor === null || valor === undefined || valor === "") return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(valor);
}

export default function GastoDetalles() {
  const { id } = useParams();

  const [gasto, setGasto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [refugios, setRefugios] = useState([]);

  const [formData, setFormData] = useState({
    refugioId: "",
    concepto: "",
    monto: "",
    fechaGasto: "",
  });

  useEffect(() => {
    fetchGasto();
  }, [id]);

  useEffect(() => {
    if (isEditing && refugios.length === 0) {
      loadOptions();
    }
  }, [isEditing]);

  async function fetchGasto() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getGastoById(id);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        setGasto(null);
      } else {
        setGasto(response.data);
        loadFormData(response.data);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("Ocurrió un error inesperado cargando el gasto.");
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const data = await getRefugios();
      setRefugios(data || []);
    } catch (error) {
      console.error("Error cargando refugios:", error);
    } finally {
      setLoadingOptions(false);
    }
  }

  function loadFormData(data) {
    if (!data) return;
    setFormData({
      refugioId: data.refugio_id || "",
      concepto: data.concepto || "",
      monto: data.monto ?? "",
      fechaGasto: data.fecha_gasto || "",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleEditClick() {
    loadFormData(gasto);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(gasto);
    setEditErrorMessage("");
    setIsEditing(false);
  }

  async function handleSaveEdit(event) {
    event.preventDefault();
    setSaving(true);
    setEditErrorMessage("");

    try {
      const response = await updateGasto(id, formData);

      if (response.errorMessage) {
        setEditErrorMessage(response.errorMessage);
        return;
      }

      setGasto(response.data);
      loadFormData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error inesperado:", error);
      setEditErrorMessage("Ocurrió un error inesperado actualizando el gasto.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Cargando información del gasto...
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
              onClick={fetchGasto}
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

  if (!gasto) return null;

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
              Gasto operativo
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Detalles del gasto registrado.
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
                form="gasto-edit-form"
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
              Editar gasto
            </button>
          )}
        </div>

        <form id="gasto-edit-form" onSubmit={handleSaveEdit}>
          {editErrorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {editErrorMessage}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
              <h2 className="text-lg font-extrabold text-slate-800">
                Información del gasto
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Concepto
                  </label>
                  {isEditing ? (
                    <input
                      name="concepto"
                      value={formData.concepto}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <p className="mt-1 break-words text-sm font-bold text-slate-700">
                      {gasto.concepto}
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
                      {gasto.refugio?.nombre || "Sin refugio"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Fecha del gasto
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="fechaGasto"
                      value={formData.fechaGasto}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {gasto.fecha_gasto}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Monto
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-bold text-red-700">
                      {formatMonto(gasto.monto)}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    ID
                  </label>
                  <p className="mt-1 break-words text-sm font-bold text-slate-700">
                    {gasto.id}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-extrabold text-slate-800">Resumen</h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-red-700">
                    Monto del gasto
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-slate-800">
                    {formatMonto(gasto.monto)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Refugio
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {gasto.refugio?.nombre || "Sin refugio"}
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
