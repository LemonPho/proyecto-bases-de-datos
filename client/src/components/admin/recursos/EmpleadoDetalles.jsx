import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getEmpleadoById,
  updateEmpleado,
  getRefugios,
  getCargos,
  ESTATUS_EMPLEADO,
} from "./fetch";

const ESTATUS_COLORES = {
  activo: "bg-green-100 text-green-700",
  inactivo: "bg-slate-200 text-slate-600",
  vacaciones: "bg-blue-100 text-blue-700",
  suspendido: "bg-amber-100 text-amber-700",
  baja: "bg-red-100 text-red-700",
};

function formatMonto(valor) {
  if (valor === null || valor === undefined || valor === "") return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(valor);
}

export default function EmpleadoDetalles() {
  const { id } = useParams();

  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [refugios, setRefugios] = useState([]);
  const [cargos, setCargos] = useState([]);

  const [formData, setFormData] = useState({
    contactoId: "",
    nombre: "",
    telefono: "",
    email: "",
    refugioId: "",
    cargoId: "",
    estatus: "activo",
    sueldoId: "",
    sueldo: "",
  });

  useEffect(() => {
    fetchEmpleado();
  }, [id]);

  useEffect(() => {
    if (isEditing && refugios.length === 0) {
      loadOptions();
    }
  }, [isEditing]);

  async function fetchEmpleado() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getEmpleadoById(id);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        setEmpleado(null);
      } else {
        setEmpleado(response.data);
        loadFormData(response.data);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("Ocurrió un error inesperado cargando el empleado.");
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [refugiosData, cargosData] = await Promise.all([
        getRefugios(),
        getCargos(),
      ]);
      setRefugios(refugiosData || []);
      setCargos(cargosData || []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
    } finally {
      setLoadingOptions(false);
    }
  }

  function loadFormData(data) {
    if (!data) return;
    const sueldoActual = Array.isArray(data.sueldos)
      ? data.sueldos[0]
      : data.sueldos;
    setFormData({
      contactoId: data.contacto?.id || data.contacto_id || "",
      nombre: data.contacto?.nombre || "",
      telefono: data.contacto?.telefono || "",
      email: data.contacto?.email || "",
      refugioId: data.refugio_id || "",
      cargoId: data.cargo_id || "",
      estatus: data.estatus || "activo",
      sueldoId: sueldoActual?.id || "",
      sueldo: sueldoActual?.sueldo ?? "",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleEditClick() {
    loadFormData(empleado);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(empleado);
    setEditErrorMessage("");
    setIsEditing(false);
  }

  async function handleSaveEdit(event) {
    event.preventDefault();
    setSaving(true);
    setEditErrorMessage("");

    try {
      const response = await updateEmpleado(id, formData);

      if (response.errorMessage) {
        setEditErrorMessage(response.errorMessage);
        return;
      }

      setEmpleado(response.data);
      loadFormData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error inesperado:", error);
      setEditErrorMessage("Ocurrió un error inesperado actualizando el empleado.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Cargando información del empleado...
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
              onClick={fetchEmpleado}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Reintentar
            </button>
            <Link
              to="/admin/recursos"
              className="rounded-full px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!empleado) return null;

  const sueldoActual = Array.isArray(empleado.sueldos)
    ? empleado.sueldos[0]
    : empleado.sueldos;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin/recursos"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver a recursos humanos
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              {empleado.contacto?.nombre || "Empleado"}
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Información laboral del empleado.
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
                form="empleado-edit-form"
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
              Editar empleado
            </button>
          )}
        </div>

        <form id="empleado-edit-form" onSubmit={handleSaveEdit}>
          {editErrorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {editErrorMessage}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
              <h2 className="text-lg font-extrabold text-slate-800">
                Información personal
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoItem
                  label="Nombre completo"
                  value={empleado.contacto?.nombre || "Sin nombre"}
                  isEditing={isEditing}
                  name="nombre"
                  formValue={formData.nombre}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />

                <InfoItem
                  label="Teléfono"
                  value={empleado.contacto?.telefono || "Sin teléfono"}
                  isEditing={isEditing}
                  name="telefono"
                  formValue={formData.telefono}
                  onChange={handleInputChange}
                  maxLength={10}
                />

                <InfoItem
                  label="Email"
                  value={empleado.contacto?.email || "Sin email"}
                  isEditing={isEditing}
                  name="email"
                  formValue={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  maxLength={100}
                />

                <InfoItem label="ID" value={empleado.id} />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-extrabold text-slate-800">Sueldo</h2>

              <div className="mt-6">
                {isEditing ? (
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Sueldo (MXN)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="sueldo"
                      value={formData.sueldo}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-green-50 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-green-700">
                      Sueldo actual
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-slate-800">
                      {sueldoActual ? formatMonto(sueldoActual.sueldo) : "—"}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
              <h2 className="text-lg font-extrabold text-slate-800">
                Asignación
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
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
                      {ESTATUS_EMPLEADO.map((e) => (
                        <option key={e} value={e} className="capitalize">
                          {e}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        ESTATUS_COLORES[empleado.estatus] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {empleado.estatus || "—"}
                    </span>
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
                      {empleado.refugio?.nombre || "Sin refugio"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Cargo
                  </label>
                  {isEditing ? (
                    <select
                      name="cargoId"
                      value={formData.cargoId}
                      onChange={handleInputChange}
                      required
                      disabled={loadingOptions}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    >
                      <option value="">Selecciona un cargo...</option>
                      {cargos.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre_cargo}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {empleado.cargo?.nombre_cargo || "Sin cargo"}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  isEditing = false,
  name,
  formValue,
  onChange,
  required = false,
  type = "text",
  maxLength,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <label className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </label>

      {isEditing ? (
        <input
          type={type}
          name={name}
          value={formValue}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
        />
      ) : (
        <p className="mt-1 break-words text-sm font-bold text-slate-700">
          {value}
        </p>
      )}
    </div>
  );
}
